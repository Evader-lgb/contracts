// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

contract FreeMintTableWithSign is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    mapping(bytes => bool) private signatureUsed;

    IERC721Upgradeable private tokenContract;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(IERC721Upgradeable _tokenContract) public initializer {
        __Pausable_init();
        __AccessControl_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        tokenContract = _tokenContract;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    using ECDSAUpgradeable for bytes32;

    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        return hash.toEthSignedMessageHash().recover(signature);
    }

    function freeMint(
        address to,
        uint256 tokenId,
        string memory uri,
        bytes memory signature
    ) public whenNotPaused {
        bytes32 hash = keccak256(abi.encodePacked(to, tokenId, uri));
        address signer = recoverSigner(hash, signature);
        _checkRole(MINTER_ROLE, signer);

        require(!signatureUsed[signature], "Signature has already been used.");

        //mint
        // tokenContract.safeMint(to, tokenId, uri);

        signatureUsed[signature] = true;
    }
}
