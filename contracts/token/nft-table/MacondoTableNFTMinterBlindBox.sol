// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

import "../../core/nft-store/NFTStore.sol";

contract MacondoTableNFTMinterBlindBox is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable,
    NFTStore
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant SALE_ROLE = keccak256("SALE_ROLE");

    //initial token id
    uint256 private initialTokenId;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(INFTStoreItem _tokenContract) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __ReentrancyGuard_init();
        __NFTMinterBlindBox_init(_tokenContract);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(SALE_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _withdraw();
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
        uint256 _saleLimit
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setSaleConfig(_salePeroiod, _salePrice, _saleStartTime, _saleEndTime);
        _setSaleLimit(_saleLimit);
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

    function setInitialTokenId(uint256 _initialTokenId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        initialTokenId = _initialTokenId;
    }

    function currentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current() + initialTokenId;
    }

    //sale
    function sale() external payable nonReentrant {
        address _to = _msgSender();

        uint256 _tokenId = _tokenIdCounter.current() + initialTokenId;
        _tokenIdCounter.increment();

        string memory _uri = _tokenURI(_tokenId);
        _sale(_to, _tokenId, _uri, defaultConfig.price);
    }

    function _tokenURI(uint256 tokenId)
        internal
        view
        virtual
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "meta/desk_",
                    StringsUpgradeable.toString(tokenId)
                )
            );
    }
}
