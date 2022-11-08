// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";

import "./INFTStoreItem.sol";

contract NFTStore is Initializable, ContextUpgradeable {
    using SafeMathUpgradeable for uint256;
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
    uint256 public totalSupply;

    //sold list
    mapping(uint256 => address) public soldList;
    //sold count by address
    mapping(address => uint256) public soldCountByAddress;

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

    function _saleAfter(
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
    ) internal inSalePeriod checkTotalSupply {
        //check money
        if (price <= 1) {
            revert(string(abi.encodePacked("price must be greater than 1")));
        }
        if (msg.value < price) {
            revert(string(abi.encodePacked("not enough money")));
        }
        //check sold list
        if (soldList[tokenId] != address(0)) {
            revert(string(abi.encodePacked("token already sold")));
        }

        _saleBefore(to, tokenId, uri, price);
        //add sold count
        soldCount = soldCount.add(1);
        //add sold list
        soldList[tokenId] = to;

        //add sold count by address
        soldCountByAddress[to] = soldCountByAddress[to].add(1);

        //mint token
        tokenContract.safeMint(to, tokenId, uri);
        //refund
        if (msg.value > price) {
            AddressUpgradeable.sendValue(
                payable(msg.sender),
                msg.value.sub(price)
            );
        }

        _saleAfter(to, tokenId, uri, price);
        //emit event
        emit SaleBox(to, tokenId);
    }

    function _withdraw(address to) internal {
        AddressUpgradeable.sendValue(payable(to), address(this).balance);
        emit Withdraw(to, address(this).balance);
    }

    function _setSaleDefaultConfig(
        uint256 _salePeriod,
        uint256 _salePrice,
        uint256 _saleStartTime,
        uint256 _saleEndTime,
        uint256 _totalSupply
    ) internal {
        _setSaleConfigPeriod(_salePeriod);
        _setSaleConfigSaleTime(_saleStartTime, _saleEndTime);
        _setSaleConfigPrice(_salePrice);
        _setTotalSupply(_totalSupply);
    }

    function _setSaleConfigPeriod(uint256 _salePeriod) internal {
        defaultConfig.period = _salePeriod;
    }

    function _setSaleConfigSaleTime(
        uint256 _saleStartTime,
        uint256 _saleEndTime
    ) internal {
        //start time must be less than end time
        if (_saleStartTime > _saleEndTime) {
            revert(
                string(
                    abi.encodePacked(
                        "start time must be less than end time,",
                        StringsUpgradeable.toString(_saleStartTime),
                        ">",
                        StringsUpgradeable.toString(_saleEndTime)
                    )
                )
            );
        }
        defaultConfig.startTimestamp = _saleStartTime;
        defaultConfig.endTimestamp = _saleEndTime;
    }

    function _setSaleConfigPrice(uint256 _salePrice) internal {
        //price must be greater than 0
        if (_salePrice <= 0) {
            revert(string(abi.encodePacked("price must be greater than 0")));
        }
        defaultConfig.price = _salePrice;
    }

    function _setSoldCount(uint256 _soldCount) internal {
        //check sold count
        if (_soldCount > totalSupply) {
            revert(
                string(
                    abi.encodePacked(
                        "sold count must be less than total supply"
                    )
                )
            );
        }
        soldCount = _soldCount;
    }

    function _setTotalSupply(uint256 _totalSupply) internal {
        if (_totalSupply < soldCount) {
            revert(
                string(
                    abi.encodePacked(
                        "sale limit must be greater than sold count"
                    )
                )
            );
        }

        totalSupply = _totalSupply;
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

    modifier checkTotalSupply() {
        if (totalSupply > 0 && soldCount >= totalSupply) {
            revert(string(abi.encodePacked("sale count limit")));
        }
        _;
    }

    function getLeftSaleCount() public view returns (uint256) {
        if (totalSupply == 0) {
            return 0;
        }
        return totalSupply.sub(soldCount);
    }

    //@dev 单一地址限制购买数量
    function _guardLimitSoldCountByAddress(address to, uint256 limit)
        internal
        view
    {
        if (limit > 0 && soldCountByAddress[to] >= limit) {
            revert(
                string(
                    abi.encodePacked(
                        "sold count limit ",
                        StringsUpgradeable.toString(limit),
                        " each address!"
                    )
                )
            );
        }
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[49] private __gap;
}
