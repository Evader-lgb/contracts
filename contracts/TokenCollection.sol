// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

/**
 * @title ERC20 Token with control over token transfers
 */
contract TokenCollection is
    Initializable,
    AccessControlUpgradeable,
    ERC721HolderUpgradeable,
    PausableUpgradeable
{
    event TokenReceived(address from, uint256 amount);
    event Withdraw(address to, uint256 amount);
    event ERC20Withdraw(
        IERC20Upgradeable indexed token,
        address indexed to,
        uint256 amount
    );
    event ERC721Withdraw(
        IERC721Upgradeable indexed token,
        address indexed to,
        uint256 tokenId
    );

    bytes32 public constant WITHDRAW = keccak256("WITHDRAW");
    bytes32 public constant WITHDRAW_ERC20 = keccak256("WITHDRAW_ERC20");
    bytes32 public constant WITHDRAW_ERC721 = keccak256("WITHDRAW_ERC721");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __AccessControl_init();
        __ERC721Holder_init();

        __Pausable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    receive() external payable virtual {
        emit TokenReceived(_msgSender(), msg.value);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function withdraw(address payable to, uint256 amount)
        public
        whenNotPaused
        onlyRole(WITHDRAW)
    {
        AddressUpgradeable.sendValue(to, amount);
        emit Withdraw(to, amount);
    }

    function withdrawERC20(
        IERC20Upgradeable token,
        address to,
        uint256 value
    ) public whenNotPaused onlyRole(WITHDRAW_ERC20) {
        SafeERC20Upgradeable.safeTransfer(token, to, value);
        emit ERC20Withdraw(token, to, value);
    }

    function withdrawERC721(
        IERC721Upgradeable token,
        address to,
        uint256 tokenId
    ) public whenNotPaused onlyRole(WITHDRAW_ERC721) {
        token.safeTransferFrom(address(this), to, tokenId);
        emit ERC721Withdraw(token, to, tokenId);
    }
}
