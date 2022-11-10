// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../../../core/utils/random/OnChainRandomUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract OnChainRandomUpgradeableTest is
    Initializable,
    OnChainRandomUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __OnChainRandom_init();
    }

    function getRandomBySeed(uint256 _seed, uint256 _index)
        public
        pure
        returns (uint256)
    {
        return _getRandomBySeed(_seed, _index);
    }

    function getRandom(uint256 _index) public view returns (uint256) {
        return _getRandom(_index);
    }
}
