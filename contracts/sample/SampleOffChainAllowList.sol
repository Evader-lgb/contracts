// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SampleOffChainAllowList is Ownable {
    mapping(bytes => bool) public signatureUsed;
    using ECDSA for bytes32;

    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        return hash.toEthSignedMessageHash().recover(signature);
    }

    function preSale(
        uint256 _count,
        bytes32 hash,
        bytes memory signature
    ) public {
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not allowlisted"
        );
        require(!signatureUsed[signature], "Signature has already been used.");

        // do something with _count

        signatureUsed[signature] = true;
    }
}
