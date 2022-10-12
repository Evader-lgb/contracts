// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RandomOracleConsumer is VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface COORDINATOR;

    // 随机数请求完成
    event RequestComplete(uint256 requestId);

    // Your subscription ID.
    uint64 immutable s_subscriptionId;

    // Rinkeby coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    address vrfCoordinator;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 keyHash;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 300000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 10;

    mapping(uint256 => uint256[]) s_requestIdToRandomWords;

    uint256 public s_requestId;

    constructor(
        uint64 subscriptionId,
        address m_vrfCoordinator,
        bytes32 m_keyHash
    ) VRFConsumerBaseV2(m_vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(m_vrfCoordinator);
        vrfCoordinator = m_vrfCoordinator;
        s_subscriptionId = subscriptionId;
        keyHash = m_keyHash;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external onlyOwner {
        // Will revert if subscription is not set and funded.
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_requestId = requestId;
        emit RequestComplete(requestId);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        s_requestIdToRandomWords[requestId] = randomWords;
    }

    function getRandomWords(uint256 requestId)
        public
        view
        onlyOwner
        returns (uint256[] memory)
    {
        return s_requestIdToRandomWords[requestId];
    }
}
