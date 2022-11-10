import { expect } from 'chai';
import { BigNumber, BigNumberish, Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

function randomWithSeed(
  seed: BigNumberish,
  index: BigNumberish,
  maxNumber?: BigNumberish
): BigNumber {
  const random = BigNumber.from(
    ethers.utils.solidityKeccak256(['uint256', 'uint256'], [seed, index])
  );
  if (maxNumber) {
    return random.mod(maxNumber);
  }
  return random;
}

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

  it('should return a random number with a seed and index', async () => {
    for (let i = 0; i < 100; i++) {
      const seed = ethers.utils.randomBytes(32);
      const random1 = await contract.getRandomBySeed(seed, i);
      const random2 = randomWithSeed(seed, i);
      expect(random1).to.equal(random2);
    }
  });

  it('should return a random number with a seed and index with maxNumber', async () => {
    for (let i = 0; i < 100; i++) {
      const seed = ethers.utils.randomBytes(32);
      const mod = i + 1;
      const random1 = await contract.getRandomBySeed2(seed, i, mod);
      const random2 = randomWithSeed(seed, i, mod);
      expect(random1).to.equal(random2);
    }
  });
});
