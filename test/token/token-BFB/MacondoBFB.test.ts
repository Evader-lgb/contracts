import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

describe('MacondoBFB', function () {
  it('MacondoBFB Test', async function () {
    const MacondoBFB = await ethers.getContractFactory('MacondoBFB');
    const macondoBFB = await upgrades.deployProxy(MacondoBFB, []);
    await macondoBFB.deployed();

    expect(await macondoBFB.name()).to.equal('BestFriendBet');
    expect(await macondoBFB.symbol()).to.equal('BFB');
  });
});
