import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe('OnChainRandomUpgradeableTest', () => {
  let contract: Contract;

  beforeEach(async () => {
    const OnChainRandomUpgradeableTest = await ethers.getContractFactory(
      'OnChainRandomUpgradeableTest'
    );
    contract = await upgrades.deployProxy(OnChainRandomUpgradeableTest);
    await contract.deployed();
  });

  it('should return a random number', async () => {
    const random1 = await contract.getRandom(0);
    const random2 = await contract.getRandom(0);

    expect(random1).to.equal(random2);

    const random3 = await contract.getRandom(1);

    expect(random3).not.to.equal(random2);
  });
});
