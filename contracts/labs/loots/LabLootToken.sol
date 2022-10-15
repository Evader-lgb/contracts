// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./LabLootTokenResource.sol";

contract LabLootToken is
    ERC721,
    ERC721Enumerable,
    Pausable,
    AccessControl,
    ERC721URIStorage
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    LabLootTokenResource public immutable resource;

    constructor(LabLootTokenResource _resource) ERC721("LabLootToken", "LLT") {
        resource = _resource;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        string memory baseURI = super.tokenURI(tokenId);
        return resource.tokenURI(tokenId, baseURI);
    }

    function _claimMint(address to, uint256 tokenId) private {
        require(tokenId > 0 && tokenId < 10001, "Token ID invalid");

        _safeMint(to, tokenId);
        string memory _tokenURI = string(
            abi.encodePacked(
                Strings.toString(tokenId),
                "#",
                Strings.toString(block.timestamp)
            )
        );
        _setTokenURI(tokenId, _tokenURI);
    }

    function claim(uint256 tokenId) public {
        require(tokenId > 0 && tokenId < 8888, "Token ID invalid");
        _claimMint(_msgSender(), tokenId);
    }

    function ownerClaim(uint256 tokenId) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokenId > 8887 && tokenId <= 10000, "Token ID invalid");
        _claimMint(_msgSender(), tokenId);
    }
}
