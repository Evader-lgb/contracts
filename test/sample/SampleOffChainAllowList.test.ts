import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('SampleOffChainAllowList', () => {
  let contract: Contract;

  beforeEach(async () => {
    const SampleOffChainAllowList = await ethers.getContractFactory(
      'SampleOffChainAllowList'
    );
    contract = await SampleOffChainAllowList.deploy();
    await contract.deployed();
  });

  it('should recoverSigner and preSale', async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    // Define a list of allowlisted wallets
    const allowlistedAddresses = [
      '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
      '0x90f79bf6eb2c4f870365e785982e1f101e93b906',
      '0x15d34aaf54267db7d7c367839aaf71a00a2c6a65',
      '0x9965507d1a55bcc2695c58ba16fb37d819b0a4dc',
    ];

    // Select an allowlisted address to mint NFT
    const selectedAddress = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';

    let messageHash, signature;

    // Check if selected address is in allowlist
    // If yes, sign the wallet's address
    if (allowlistedAddresses.includes(selectedAddress)) {
      console.log('Address is allowlisted! Minting should be possible.');

      // Compute message hash
      messageHash = ethers.utils.id(selectedAddress);
      console.log('Message Hash: ', messageHash);

      // Sign the message hash
      let messageBytes = ethers.utils.arrayify(messageHash);
      signature = await owner.signMessage(messageBytes);
      console.log('Signature: ', signature, '\n');
    }

    console.log(
      'Contract deployed by (Owner/Signing Wallet): ',
      owner.address,
      '\n'
    );

    const recover = await contract.recoverSigner(messageHash, signature);
    console.log('Message was signed by: ', recover.toString());

    expect(recover.toString()).to.equal(owner.address);
    let txn;
    txn = await contract.preSale(2, messageHash, signature);
    await txn.wait();
    console.log('NFTs minted successfully!');
  });
});
