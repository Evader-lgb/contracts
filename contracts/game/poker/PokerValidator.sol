// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "../../core/utils/random/OnChainRandomUpgradeable.sol";

contract PokerValidator is
    Initializable,
    AccessControlUpgradeable,
    OnChainRandomUpgradeable,
    UUPSUpgradeable
{
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    using SafeMathUpgradeable for uint256;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __OnChainRandom_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    function _getRandom(
        uint256 seed,
        uint256 index,
        uint256 maxNumber
    ) internal pure returns (uint256) {
        return _getRandomBySeed(seed, index).mod(maxNumber);
    }

    function getRandomCards(uint256 seed, uint256 count)
        public
        pure
        returns (uint256[] memory)
    {
        uint256[] memory cards = new uint256[](count);
        /// inital cards
        for (uint256 i = 0; i < count; i++) {
            cards[i] = i;
        }
        uint256 j = 0;
        for (uint256 i = 0; i < count; i++) {
            j = _getRandom(seed, i, count - i);
            (cards[i], cards[j]) = (cards[j], cards[i]);
        }
        return cards;
    }
}
