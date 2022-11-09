// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

import "./MacondoUSDT.sol";

contract MacondoUSDTFaucet is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    bytes32 public constant FAUCET_ROLE = keccak256("FAUCET_ROLE");

    //event
    event Faucet(address indexed to, uint256 amount);

    /// 货币合约地址
    MacondoUSDT public macondoUSDT;
    /// 每次领取的数量
    uint256 public faucetAmount;
    /// 已经领取的地址=>领取时间
    mapping(address => uint256) public faucetTime;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(MacondoUSDT _macondoUSDT) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
        _grantRole(FAUCET_ROLE, msg.sender);

        macondoUSDT = _macondoUSDT;
        faucetAmount = 100 ether;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    /// @dev user claim faucet by self
    function claim() external {
        address _to = _msgSender();
        _claim(_to, faucetAmount);
    }

    /// @dev admin claim faucet to other
    function claimWithRole(address _to) external onlyRole(FAUCET_ROLE) {
        _claim(_to, faucetAmount);
    }

    /// @dev admin claim faucet to other
    function claimAmountWithRole(address _to, uint256 _amount)
        external
        onlyRole(FAUCET_ROLE)
    {
        _claim(_to, _amount);
    }

    function _claim(address _to, uint256 _amount)
        internal
        whenNotPaused
        whenNotReachedClaimTimeLimit(_to)
    {
        if (_to == address(0)) {
            revert("MacondoUSDTFaucet: claim to the zero address");
        }
        if (_amount == 0) {
            revert("MacondoUSDTFaucet: claim amount must be greater than zero");
        }

        //记录领取时间
        faucetTime[_to] = block.timestamp;
        //发放
        macondoUSDT.mint(_to, _amount);
        //触发事件
        emit Faucet(_to, _amount);
    }

    modifier whenNotReachedClaimTimeLimit(address _to) {
        //如果不够一天,则可以不可以领取
        if (faucetTime[_to] + 1 days > block.timestamp) {
            revert(
                string(
                    abi.encodePacked(
                        "MacondoUSDTFaucet: faucetTime not reached, left time: ",
                        StringsUpgradeable.toString(
                            faucetTime[_to] + 1 days - block.timestamp
                        ),
                        " s"
                    )
                )
            );
        }

        _;
    }
}
