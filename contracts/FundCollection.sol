//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract FundCollectorMacondoUSDT {
    address token = 0x3F0528D040f31ace17a0c733469145928b9C88a4;
    address hotWallet = 0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3;

    event Complete(address sender, uint256 amount);

    constructor(address _token, address _hotWallet) {
        token = _token;
        hotWallet = _hotWallet;
        // send all tokens from this contract to hotwallet
        IERC20(token).transfer(
            hotWallet,
            IERC20(token).balanceOf(address(this))
        );

        // selfdestruct to receive gas refund and reset nonce to 0
        selfdestruct(payable(hotWallet));
    }
}

contract FundCollection {
    event Deployed(address addr, uint256 salt);

    function getCreationByteCode(address _token, address _hotWallet)
        public
        pure
        returns (bytes memory)
    {
        bytes memory bytecode = type(FundCollectorMacondoUSDT).creationCode;

        return abi.encodePacked(bytecode, abi.encode(_token, _hotWallet));
    }

    function createFundCollectionMacondoUSDT(uint256 salt) public {
        //get FundCollectorMacondoUSDT init_code
        bytes memory bytecode = type(FundCollectorMacondoUSDT).creationCode;
        address newAddr;
        assembly {
            let codeSize := mload(bytecode)
            newAddr := create2(0, add(bytecode, 32), codeSize, salt)
        }

        console.log(
            "createFundCollectionMacondoUSDT:deloy factory contract addresss: ",
            newAddr
        );
        emit Deployed(newAddr, salt);
    }

    function createFundCollection(bytes memory bytecode, uint256 salt) public {
        //get FundCollectorMacondoUSDT init_code
        address newAddr;
        assembly {
            let codeSize := mload(bytecode)
            newAddr := create2(0, add(bytecode, 32), codeSize, salt)
        }

        console.log(
            "createFundCollection:deloy factory contract addresss: ",
            newAddr
        );
        emit Deployed(newAddr, salt);
    }
}
