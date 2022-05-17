//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract HelloWorld {
    /**
    说点其它的
     */
    string private something = "Say Something";

    function sayHello() public pure returns (string memory) {
        return "HelloWorld!";
    }

    constructor(string memory _saySomething) {
        console.log("Deploying Helloworld Contract With:", _saySomething);
        something = _saySomething;
    }

    function saySomething() public view returns (string memory) {
        return something;
    }

    function setSaySomething(string memory _saySomething) public {
        console.log(
            "Changing Saysomething from '%s' to '%s'",
            something,
            _saySomething
        );
        something = _saySomething;
    }
}
