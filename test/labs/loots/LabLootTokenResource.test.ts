import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('LabLootTokenResource', () => {
  let labLootToken: Contract;
  let labLootTokenResource: Contract;

  beforeEach(async () => {
    const LabLootTokenResource = await ethers.getContractFactory(
      'LabLootTokenResource'
    );
    labLootTokenResource = await LabLootTokenResource.deploy();
    await labLootTokenResource.deployed();
  });

  it('should tokenURI', async () => {
    const tokenURI = await labLootTokenResource.tokenURI(1, '1#1665827927');
    console.log(tokenURI);

    expect(tokenURI).to.any;
  });
});
