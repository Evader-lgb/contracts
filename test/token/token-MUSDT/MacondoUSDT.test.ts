import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

describe('MacondoUSDT', function () {
  it('MacondoUSDT Test', async function () {
    const MacondoUSDT = await ethers.getContractFactory('MacondoUSDT');
    const macondoUSDT = await upgrades.deployProxy(MacondoUSDT);
    await macondoUSDT.deployed();

    expect(await macondoUSDT.name()).to.equal('Macondo-USDT');
    expect(await macondoUSDT.symbol()).to.equal('MUSDT');
  });
});
