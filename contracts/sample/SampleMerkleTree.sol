// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract SampleMerkleTree {
    /// @notice The Merkle root
    bytes32 public root;

    using MerkleProof for bytes32[];

    constructor(bytes32 _root) {
        root = _root;
    }

    /// @notice Verify a Merkle proof
    /// @param proof The Merkle proof
    /// @param leaf The leaf to verify
    /// @return True if the proof is valid, false otherwise
    function verify(bytes32[] calldata proof, bytes32 leaf)
        public
        view
        returns (bool)
    {
        return proof.verify(root, leaf);
    }
}
