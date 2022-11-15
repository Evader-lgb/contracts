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

/**
 * 获取随机牌
 * @param randomSeed  随机数种子
 * @param totalCards  总牌数
 * @returns  {number[]}
 */
function getRandomCards(
  randomSeed: BigNumberish,
  totalCards: number
): number[] {
  const cards = [];
  for (let i = 0; i < totalCards; i++) {
    cards.push(i);
  }
  for (let i = 0; i < totalCards; i++) {
    const j = randomWithSeed(randomSeed, i, totalCards - i).toNumber();
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

describe('PokerValidator', () => {
  let contract: Contract;

  beforeEach(async () => {
    const PokerValidator = await ethers.getContractFactory('PokerValidator');
    contract = await upgrades.deployProxy(PokerValidator);
    await contract.deployed();
  });

  it('should getRandomCards', async () => {
    const randomSeed =
      '0x814cc265bde15991d28d4212ac5dabe95c5ed2c7c8ff5c8d7c89217eccabd429';
    const totalCards = 52;
    const result: BigNumber[] = await contract.getRandomCards(
      randomSeed,
      totalCards
    );
    expect(result.length).to.equal(totalCards);
    //check unique
    const set = new Set(result);
    expect(set.size).to.equal(totalCards);

    //check max number is totalCards - 1
    const maxNumber = result.reduce((a, b) => (a.gt(b) ? a : b));
    expect(maxNumber).to.equal(totalCards - 1);

    //check min number is 0
    const minNumber = result.reduce((a, b) => (a.lt(b) ? a : b));
    expect(minNumber).to.equal(0);

    //convert result to int array
    const resultInt = result.map((item) => item.toNumber());
    console.log(resultInt);
    expect(resultInt).to.eql([
      51, 50, 47, 0, 42, 45, 44, 24, 34, 9, 40, 33, 21, 4, 17, 29, 8, 16, 12,
      11, 30, 27, 26, 15, 2, 3, 28, 13, 35, 19, 5, 20, 18, 7, 31, 23, 14, 37,
      46, 32, 1, 38, 25, 36, 41, 39, 43, 22, 6, 48, 10, 49,
    ]);
  });

  it('should getRandomCards equal with Typescript function', async () => {
    const randomSeed =
      '0x814cc265bde15991d28d4212ac5dabe95c5ed2c7c8ff5c8d7c89217eccabd429';
    const totalCards = 52;
    const result: BigNumber[] = await contract.getRandomCards(
      randomSeed,
      totalCards
    );
    const resultInt = result.map((item) => item.toNumber());
    const resultInt2 = getRandomCards(randomSeed, totalCards);
    expect(resultInt).to.eql(resultInt2);
  });
});
