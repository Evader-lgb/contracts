// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./SampleSwapPair.sol";

contract SampleSwapFactory {
    mapping(address => mapping(address => address)) public getPair; // 通过两个代币地址查Pair地址
    address[] public allPairs; // 保存所有Pair地址

    function createPair(address tokenA, address tokenB)
        external
        returns (address pairAddr)
    {
        // 创建新合约
        SampleSwapPair pair = new SampleSwapPair();
        // 调用新合约的initialize方法
        pair.initialize(tokenA, tokenB);
        // 更新地址map
        pairAddr = address(pair);
        allPairs.push(pairAddr);
        getPair[tokenA][tokenB] = pairAddr;
        getPair[tokenB][tokenA] = pairAddr;
    }
}
