// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SamplePaymentSplitter is PaymentSplitter, Ownable {
    constructor(address[] memory payees, uint256[] memory shares)
        PaymentSplitter(payees, shares)
    {}

    //override release function
    function release(address payable payee) public override onlyOwner {
        super.release(payee);
    }

    //override release function
    function release(IERC20 token, address account) public override onlyOwner {
        super.release(token, account);
    }
}
