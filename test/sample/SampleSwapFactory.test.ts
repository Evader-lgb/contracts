import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('SampleSwapFactory', () => {
  let contract: Contract;

  it('should be deploy pair', async () => {
    const SampleSwapFactory = await ethers.getContractFactory(
      'SampleSwapFactory'
    );
    contract = await SampleSwapFactory.deploy();

    const [owner, tokenA, tokenB] = await ethers.getSigners();
    await contract.createPair(tokenA.address, tokenB.address);

    const pair = await contract.getPair(tokenA.address, tokenB.address);
    expect(pair).not.to.equal(ethers.constants.AddressZero);
  });
});
