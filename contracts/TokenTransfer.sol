//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenTransfer is Ownable {
    //public counter
    uint256 public counter;
    //token address
    address private token;

    event tokenChangedEvent(uint256 value);

    constructor(address _token) {
        token = _token;
        counter = 0;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _minAmount = 1 * 10**18;
        console.log("Depositing '%d' min: '%d'", _amount, _minAmount);

        require(
            _amount >= _minAmount,
            "Amount must be greater than minimum amount"
        );

        IERC20 token_ = IERC20(token);
        token_.transferFrom(msg.sender, address(this), _amount);

        emit tokenChangedEvent(_amount);
        counter = counter + 1;
    }

    function getContractBalance() public view onlyOwner returns (uint256) {
        IERC20 token_ = IERC20(token);
        return token_.balanceOf(address(this));
    }
}
