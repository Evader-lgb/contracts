// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title ERC20 Token with control over token transfers
 */
contract TokenCollection is AccessControl {
    event TokenReceived(address from, uint256 amount);
    event Withdraw(address to, uint256 amount);
    event ERC20Withdraw(
        IERC20 indexed token,
        address indexed to,
        uint256 amount
    );
    event ERC721Withdraw(
        IERC721 indexed token,
        address indexed to,
        uint256 tokenId
    );

    bytes32 public constant WITHDRAW = keccak256("WITHDRAW");
    bytes32 public constant WITHDRAW_ERC20 = keccak256("WITHDRAW_ERC20");
    bytes32 public constant WITHDRAW_ERC721 = keccak256("WITHDRAW_ERC721");

    constructor() {
        // Grant the minter role to a specified account
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    receive() external payable virtual {
        emit TokenReceived(_msgSender(), msg.value);
    }

    function withdraw(address payable to, uint256 amount)
        public
        onlyRole(WITHDRAW)
    {
        Address.sendValue(to, amount);
        emit Withdraw(to, amount);
    }

    function withdrawERC20(
        IERC20 token,
        address to,
        uint256 value
    ) public onlyRole(WITHDRAW_ERC20) {
        SafeERC20.safeTransfer(token, to, value);
        emit ERC20Withdraw(token, to, value);
    }

    function withdrawERC721(
        IERC721 token,
        address to,
        uint256 tokenId
    ) public onlyRole(WITHDRAW_ERC721) {
        token.safeTransferFrom(address(this), to, tokenId);
        emit ERC721Withdraw(token, to, tokenId);
    }
}
