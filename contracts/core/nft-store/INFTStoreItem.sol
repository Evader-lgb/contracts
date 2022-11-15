// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";

interface INFTStoreItem {
    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) external;
}
