import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MacondoBFB', function () {
  it('MacondoBFB Test', async function () {
    const MacondoUSDT = await ethers.getContractFactory('MacondoBFB');
    const macondoUSDT = await MacondoUSDT.deploy();
    await macondoUSDT.deployed();

    expect(await macondoUSDT.name()).to.equal('BestFriendBet');
    expect(await macondoUSDT.symbol()).to.equal('BFB');
  });
});
