// contracts/Box.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./SampleBox.sol";

contract SampleBoxV2 is SampleBox {
    // Increments the stored value by 1
    function increment() public {
        store(retrieve() + 1);
    }
}
