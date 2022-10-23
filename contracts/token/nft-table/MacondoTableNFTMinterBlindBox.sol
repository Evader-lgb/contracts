// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "./MacondoTableNFT.sol";

contract MacondoTableNFTMinterBlindBox is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    //event
    event SaleBox(address indexed to, uint256 indexed tokenId);

    //errors
    error ErrorSaleRoleSignature(address signer);
    error ErrorSaleRoleCannotSaleToSelf();

    MacondoTableNFT public tokenContract;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant SALE_ROLE = keccak256("SALE_ROLE");

    struct saleConfig {
        //default sale period
        uint256 period;
        //default price
        uint256 price;
        //sale start time
        uint256 startTimestamp;
        //sale end time
        uint256 endTimestamp;
    }

    //sale config
    saleConfig public defaultConfig;

    //current sold count
    uint256 public soldCount;
    //max sale count
    uint256 public saleLimit;

    struct saleListData {
        //sale list
        uint256[] tokenIds;
    }
    //sale list
    mapping(address => saleListData) internal saleList;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(MacondoTableNFT _tokenContract) public initializer {
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(SALE_ROLE, msg.sender);

        tokenContract = _tokenContract;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
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
    ) external payable {
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

    function _sale(
        address to,
        uint256 tokenId,
        string memory uri,
        uint256 price
    ) internal whenNotPaused {
        _checkInSalePeriod();
        //check money
        if (price <= 1) {
            revert(string(abi.encodePacked("price must be greater than 1")));
        }
        if (msg.value < price) {
            revert(string(abi.encodePacked("not enough money")));
        }
        //check sale limit
        if (saleLimit > 0 && soldCount >= saleLimit) {
            revert(string(abi.encodePacked("sale limit")));
        }

        //set to sale list
        saleList[to].tokenIds.push(tokenId);
        //add sold count
        soldCount++;

        //mint token
        tokenContract.safeMint(to, tokenId, uri);
        //refund
        if (msg.value > price) {
            AddressUpgradeable.sendValue(
                payable(msg.sender),
                msg.value - price
            );
        }
        //emit event
        emit SaleBox(to, tokenId);
    }

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        AddressUpgradeable.sendValue(
            payable(msg.sender),
            address(this).balance
        );
    }

    function setSaleConfig(
        uint256 _salePeroiod,
        uint256 _salePrice,
        uint256 _saleStartTime,
        uint256 _saleEndTime,
        uint256 _saleLimit
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        defaultConfig.period = _salePeroiod;
        defaultConfig.price = _salePrice;
        defaultConfig.startTimestamp = _saleStartTime;
        defaultConfig.endTimestamp = _saleEndTime;

        saleLimit = _saleLimit;
    }

    function _checkInSalePeriod() internal view {
        if (block.timestamp < defaultConfig.startTimestamp) {
            revert(string(abi.encodePacked("sale not start")));
        }
        if (block.timestamp > defaultConfig.endTimestamp) {
            revert(string(abi.encodePacked("sale end")));
        }
    }
}
