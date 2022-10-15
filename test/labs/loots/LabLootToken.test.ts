import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('LabLootToken', () => {
  let labLootToken: Contract;

  beforeEach(async () => {
    const LabLootToken = await ethers.getContractFactory('LabLootToken');
    labLootToken = await LabLootToken.deploy();
    await labLootToken.deployed();
  });

  it('should return the right name', async () => {
    expect(await labLootToken.name()).to.equal('LabLootToken');
  });

  it('should tokenURI', async () => {
    await labLootToken.claim(1);

    const tokenURI = await labLootToken.tokenURI(1);
    console.log(tokenURI);

    expect(tokenURI).to.any;
  });
});
