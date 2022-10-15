// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./MacondoTableNFT.sol";

contract MacondoTableNFTFreeMintWithSign is
    Initializable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    ReentrancyGuardUpgradeable
{
    //event
    event FreeMint(address indexed to, uint256 indexed tokenId);

    //errors
    error ErrorSigner(address signer);
    error ErrorSignatureUsed(bytes signature);

    mapping(bytes => bool) internal signatureUsed;

    MacondoTableNFT internal tokenContract;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(MacondoTableNFT _tokenContract) public initializer {
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

    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 ethSign = ECDSAUpgradeable.toEthSignedMessageHash(hash);
        return ECDSAUpgradeable.recover(ethSign, signature);
    }

    function getMessageHash(address to, uint256 tokenId)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(to, tokenId));
    }

    function freeMint(
        address to,
        uint256 tokenId,
        string memory uri,
        bytes memory signature
    ) external whenNotPaused nonReentrant {
        bytes32 _messageHash = getMessageHash(to, tokenId);
        address signer = recoverSigner(_messageHash, signature);

        if (!hasRole(MINTER_ROLE, signer)) {
            revert ErrorSigner(signer);
        }
        if (signatureUsed[signature]) {
            revert ErrorSignatureUsed(signature);
        }

        signatureUsed[signature] = true;
        //mint
        tokenContract.safeMint(to, tokenId, uri);
        emit FreeMint(to, tokenId);
    }
}
