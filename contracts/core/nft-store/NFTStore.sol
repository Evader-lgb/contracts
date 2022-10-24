// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

import "./INFTStoreItem.sol";

contract NFTStore is Initializable, ContextUpgradeable {
    //event
    event SaleBox(address indexed to, uint256 indexed tokenId);
    event Withdraw(address indexed to, uint256 indexed amount);

    //errors
    error ErrorSaleRoleSignature(address signer);
    error ErrorSaleRoleCannotSaleToSelf();

    INFTStoreItem public tokenContract;

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

    function __NFTMinterBlindBox_init(INFTStoreItem _tokenContract)
        internal
        onlyInitializing
    {
        __NFTMinterBlindBox_init_unchained(_tokenContract);
    }

    function __NFTMinterBlindBox_init_unchained(INFTStoreItem _tokenContract)
        internal
        onlyInitializing
    {
        tokenContract = _tokenContract;
    }

    function _saleBefore(
        address to,
        uint256 tokenId,
        string memory uri,
        uint256 price
    ) internal virtual {}

    function _sale(
        address to,
        uint256 tokenId,
        string memory uri,
        uint256 price
    ) internal inSalePeriod checkSaleLimit {
        //check money
        if (price <= 1) {
            revert(string(abi.encodePacked("price must be greater than 1")));
        }
        if (msg.value < price) {
            revert(string(abi.encodePacked("not enough money")));
        }
        _saleBefore(to, tokenId, uri, price);

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

    function _withdraw() internal {
        AddressUpgradeable.sendValue(
            payable(msg.sender),
            address(this).balance
        );
        emit Withdraw(msg.sender, address(this).balance);
    }

    function _setSaleConfig(
        uint256 _salePeroiod,
        uint256 _salePrice,
        uint256 _saleStartTime,
        uint256 _saleEndTime,
        uint256 _saleLimit
    ) internal {
        defaultConfig.period = _salePeroiod;
        defaultConfig.price = _salePrice;
        defaultConfig.startTimestamp = _saleStartTime;
        defaultConfig.endTimestamp = _saleEndTime;

        saleLimit = _saleLimit;
    }

    modifier inSalePeriod() {
        if (block.timestamp < defaultConfig.startTimestamp) {
            revert(string(abi.encodePacked("sale not start")));
        }
        if (block.timestamp > defaultConfig.endTimestamp) {
            revert(string(abi.encodePacked("sale end")));
        }

        _;
    }

    modifier checkSaleLimit() {
        if (saleLimit > 0 && soldCount >= saleLimit) {
            revert(string(abi.encodePacked("sale count limit")));
        }
        _;
    }

    function getLeftSaleCount() public view returns (uint256) {
        if (saleLimit == 0) {
            return 0;
        }
        return saleLimit - soldCount;
    }
}
