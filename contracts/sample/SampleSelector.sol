// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SampleSelector {
    // event
    event SampleEvent(address indexed from, uint256 amount);

    function sampleFunction(uint256 amout) external {
        emit SampleEvent(msg.sender, amout);
    }

    function sampleFunctionSelector() external pure returns (bytes4) {
        return bytes4(keccak256("sampleFunction(uint256)"));
    }

    function callSampleFunction(address contractAddress, uint256 amount)
        external
        returns (bool, bytes memory)
    {
        (bool success, bytes memory data) = contractAddress.call(
            abi.encodeWithSelector(this.sampleFunctionSelector(), amount)
        );
        return (success, data);
    }
}
