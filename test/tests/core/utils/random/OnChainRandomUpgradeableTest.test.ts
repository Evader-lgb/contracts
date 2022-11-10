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

  it('should return a random number with a seed', async () => {
    const seed =
      '46672134033264489063721065857950797364633243009474115366978012516340856789160';
    const random1 = await contract.getRandomBySeed(seed, 0);
    const random2 = await contract.getRandomBySeed(seed, 0);

    expect(random1).to.equal(
      '78186544682697568394469585502892849925345949349572456956614040161341429022826'
    );
    expect(random1).to.equal(random2);

    const random3 = await contract.getRandomBySeed(seed, 1);

    expect(random3).not.to.equal(random2);
  });
});
