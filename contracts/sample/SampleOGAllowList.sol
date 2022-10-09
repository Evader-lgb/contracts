// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SampleOGAllowList is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    address public ogContractAddress;

    mapping(address => bool) public freeMintedAddressList;

    constructor(IERC721 _ogContractAddress) ERC721("MyToken", "MTK") {
        ogContractAddress = address(_ogContractAddress);
    }

    function preSale() public {
        require(
            IERC721(ogContractAddress).balanceOf(_msgSender()) > 0,
            "OG Allow List: Not OG"
        );
        require(
            !freeMintedAddressList[_msgSender()],
            "Address has already been used."
        );
        freeMintedAddressList[_msgSender()] = true;

        _freeMint();
    }

    function _freeMint() private {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);
    }
}
