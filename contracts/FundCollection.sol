//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract FundCollectorMacondoUSDT {
    address internal token = 0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66;
    address internal hotWallet = 0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3;

    constructor() {
        // send all tokens from this contract to hotwallet
        IERC20(token).transfer(
            hotWallet,
            IERC20(token).balanceOf(address(this))
        );

        // selfdestruct to receive gas refund and reset nonce to 0
        selfdestruct(payable(msg.sender));
    }
}

contract FundCollection {
    event Deployed(address addr, uint256 salt);

    function createFundCollectionMacondoUSDT(uint256 salt) public {
        //get FundCollectorMacondoUSDT init_code
        bytes memory bytecode = type(FundCollectorMacondoUSDT).creationCode;
        address newAddr;
        assembly {
            let codeSize := mload(bytecode)
            newAddr := create2(0, add(bytecode, 32), codeSize, salt)
        }

        console.log("addresss: ", newAddr);
        emit Deployed(newAddr, salt);
    }
}
