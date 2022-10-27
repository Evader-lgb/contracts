// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "../../core/nft-store/NFTStore.sol";
import "../../core/nft-store/NFTStoreSellerIncrease.sol";

contract MacondoTableNFTMinterBlindBox is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    NFTStore,
    NFTStoreSellerIncrease
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant SALE_MANAGE_ROLE = keccak256("SALE_MANAGE_ROLE");
    bytes32 public constant SALE_ROLE = keccak256("SALE_ROLE");

    // withdraw address
    address internal withdrawAddress;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        INFTStoreItem _tokenContract,
        address payable _withdrawAddress
    ) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __NFTMinterBlindBox_init(_tokenContract);
        __NFTStoreSellerIncrease_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(SALE_MANAGE_ROLE, msg.sender);
        _grantRole(SALE_ROLE, msg.sender);

        withdrawAddress = _withdrawAddress;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _saleBefore(
        address to,
        uint256 tokenId,
        string memory uri,
        uint256 price
    ) internal override whenNotPaused {
        super._saleBefore(to, tokenId, uri, price);
    }

    function setSaleConfig(
        uint256 _salePeroiod,
        uint256 _salePrice,
        uint256 _saleStartTime,
        uint256 _saleEndTime,
        uint256 _totalSupply
    ) external onlyRole(SALE_MANAGE_ROLE) {
        _setSaleDefaultConfig(
            _salePeroiod,
            _salePrice,
            _saleStartTime,
            _saleEndTime,
            _totalSupply
        );
    }

    function setSaleConfigPrice(uint256 _salePrice)
        external
        onlyRole(SALE_MANAGE_ROLE)
    {
        _setSaleConfigPrice(_salePrice);
    }

    function setSaleConfigPeriod(
        uint256 _salePeriod,
        uint256 _saleStartTime,
        uint256 _saleEndTime
    ) external onlyRole(SALE_MANAGE_ROLE) {
        _setSaleConfigPeriod(_salePeriod);
        _setSaleConfigSaleTime(_saleStartTime, _saleEndTime);
    }

    function setTotalSupply(uint256 _totalSupply)
        external
        onlyRole(SALE_MANAGE_ROLE)
    {
        _setTotalSupply(_totalSupply);
    }

    function resetSoldCount() external onlyRole(SALE_MANAGE_ROLE) {
        _setSoldCount(0);
    }

    /**
     * initial token id to start
     * also initial token id counter
     */
    function setInitialTokenId(uint256 _initialTokenId)
        external
        onlyRole(SALE_MANAGE_ROLE)
    {
        _setInitialTokenId(_initialTokenId);
    }

    function setWithdrawAddress(address payable _withdrawAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        withdrawAddress = _withdrawAddress;
    }

    function withdraw() external nonReentrant onlyRole(SALE_MANAGE_ROLE) {
        _withdraw(withdrawAddress);
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 ethSign = ECDSAUpgradeable.toEthSignedMessageHash(hash);
        return ECDSAUpgradeable.recover(ethSign, signature);
    }

    function buyWithSaleRoleSign(
        uint256 tokenId,
        string memory uri,
        uint256 price,
        bytes memory signature
    ) external payable nonReentrant {
        address to = _msgSender();
        address signer = recoverSigner(
            keccak256(abi.encodePacked(to, tokenId, price)),
            signature
        );

        if (!hasRole(SALE_ROLE, signer)) {
            revert ErrorSaleRoleSignature(signer);
        }
        if (to == signer) {
            revert ErrorSaleRoleCannotSaleToSelf();
        }

        _sale(to, tokenId, uri, price);
    }

    //sale
    function sale() external payable nonReentrant {
        _saleWithIncreaseTokenId(_msgSender());
    }

    function _StoreItemTokenURI(uint256 tokenId)
        internal
        pure
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "meta/desk-",
                    StringsUpgradeable.toString(tokenId)
                )
            );
    }
}
