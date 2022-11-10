// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

import "./NFTStore.sol";

contract NFTStoreSellerWithSigner is Initializable, NFTStore {
    //signers map
    mapping(address => bool) internal _signers;

    /**
     * @dev Initializes the contract
     */
    function __NFTStoreSellerWithSigner_init() internal onlyInitializing {
        __NFTStoreSellerWithSigner_init_unchained();
    }

    function __NFTStoreSellerWithSigner_init_unchained()
        internal
        onlyInitializing
    {}

    function _grantSigner(address signer) internal {
        _signers[signer] = true;
    }

    function _revokeSigner(address signer) internal {
        _signers[signer] = false;
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        public
        pure
        returns (address)
    {
        bytes32 ethSign = ECDSAUpgradeable.toEthSignedMessageHash(hash);
        return ECDSAUpgradeable.recover(ethSign, signature);
    }

    function _buyWithSaleRoleSign(
        uint256 tokenId,
        string memory uri,
        uint256 price,
        bytes memory signature
    ) internal {
        address to = _msgSender();
        address signer = recoverSigner(
            keccak256(abi.encodePacked(to, tokenId, price)),
            signature
        );

        if (to == signer) {
            revert("signer can not be buyer");
        }

        if (!_signers[signer]) {
            revert("signer is not in signers");
        }

        _sale(to, tokenId, uri, price);
    }
}
