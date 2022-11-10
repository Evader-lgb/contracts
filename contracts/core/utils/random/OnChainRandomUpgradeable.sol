// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

contract OnChainRandomUpgradeable is Initializable, ContextUpgradeable {
    function __OnChainRandom_init() internal onlyInitializing {
        __OnChainRandom_init_unchained();
    }

    function __OnChainRandom_init_unchained() internal onlyInitializing {}

    /// @dev Returns a random number between 0 and maxNumber
    function _getRandomBySeed(uint256 _seed, uint256 _index)
        internal
        pure
        returns (uint256)
    {
        return uint256(keccak256(abi.encodePacked(_seed, _index)));
    }

    /// @dev Returns a random number between 0 and maxNumber
    function _getRandom(uint256 _index) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        _index,
                        msg.sender,
                        block.difficulty
                    )
                )
            );
    }
}
