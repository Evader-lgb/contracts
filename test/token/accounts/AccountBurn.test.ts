import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe('AccountBurn', () => {
  let accountBurn: Contract;
  let token: Contract;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory('MacondoBFB');
    token = await upgrades.deployProxy(Token);
    await token.deployed();

    const AccountBurn = await ethers.getContractFactory('AccountBurn');
    accountBurn = await upgrades.deployProxy(AccountBurn, [token.address]);
    await accountBurn.deployed();
  });

  it('AccountBurn:burn Test', async () => {
    const [owner] = await ethers.getSigners();
    const amount = ethers.utils.parseEther('100');

    const accountBurnAddress = accountBurn.address;
    const totalSupply = await token.totalSupply();

    const tx = await token.mint(accountBurnAddress, amount);
    await tx.wait();

    expect(await token.totalSupply()).to.equal(totalSupply.add(amount));

    expect(await accountBurn.balance()).to.equal(amount);

    await expect(accountBurn.burn())
      .to.emit(accountBurn, 'BurnToken')
      .withArgs(accountBurnAddress, amount);

    expect(await accountBurn.balance()).to.equal('0');
    expect(await token.totalSupply()).to.equal(totalSupply);
  });
});
