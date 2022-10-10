// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";

contract SampleTransferContract is Pausable, Ownable {
    //token amount
    uint256 private _tokenAmount;
    //token address
    address private _tokenAddress;

    error TransferBalanceError(uint256 amount, uint256 balance);

    using EnumerableMap for EnumerableMap.AddressToUintMap;
    EnumerableMap.AddressToUintMap private _portions;

    event Deposit(address indexed from, uint256 amount);

    constructor(address tokenAddress) {
        _tokenAddress = tokenAddress;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getContractBalance() private view onlyOwner returns (uint256) {
        IERC20 token_ = IERC20(_tokenAddress);
        return token_.balanceOf(address(this));
    }

    function portion() public onlyOwner whenNotPaused {
        uint256 balance = getContractBalance();
        uint256 _minAmount = 1 * 10**18;
        // require(
        //     balance >= _minAmount,
        //     "Amount must be greater than minimum amount"
        // );
        if (balance < _minAmount) {
            revert TransferBalanceError({amount: balance, balance: _minAmount});
        }

        require(
            _portions.length() > 0,
            "There are no addresses to transfer to"
        );

        uint256 totalWeight = 0;
        for (uint256 i = 0; i < _portions.length(); i++) {
            (, uint256 weight) = _portions.at(i);
            totalWeight += weight;
        }

        IERC20 token_ = IERC20(_tokenAddress);
        for (uint256 i = 0; i < _portions.length(); i++) {
            (address addr, uint256 weight) = _portions.at(i);
            uint256 amount = (balance * weight) / totalWeight;
            token_.transfer(addr, amount);
        }
    }

    function setPortion(address _address, uint256 _weight)
        public
        onlyOwner
        whenNotPaused
    {
        require(
            _weight > 0 && _weight <= 10000,
            "Weight must be greater than 0"
        );
        _portions.set(_address, _weight);
    }
}
