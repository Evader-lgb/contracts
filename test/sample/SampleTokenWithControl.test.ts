import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('SampleTokenWithControl', () => {
  let contract: Contract;
  let tokenContract: Contract;

  beforeEach(async () => {});

  it('should deploy', async () => {
    const SampleTokenWithControl = await ethers.getContractFactory(
      'SampleTokenWithControl'
    );
    contract = await SampleTokenWithControl.deploy();
    await contract.deployed();
  });

  it('should mint', async () => {
    const SampleTokenWithControl = await ethers.getContractFactory(
      'SampleTokenWithControl'
    );
    contract = await SampleTokenWithControl.deploy();
    await contract.deployed();

    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    //grant role
    await contract.grantRole(ethers.utils.id('MINTER_ROLE'), owner.address);

    await contract.mint(addr1.address, '100');
  });

  it('should mint role', async () => {
    const SampleTokenWithControl = await ethers.getContractFactory(
      'SampleTokenWithControl'
    );
    contract = await SampleTokenWithControl.deploy();
    await contract.deployed();

    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const roleAdmin = await contract.getRoleAdmin(
      ethers.utils.id('MINTER_ROLE')
    );
    expect(roleAdmin).to.equal(ethers.constants.HashZero);

    const superAdmin = await contract.getRoleAdmin(
      contract.DEFAULT_ADMIN_ROLE()
    );
    expect(superAdmin).to.equal(ethers.constants.HashZero);

    const hasRole = await contract.hasRole(
      contract.DEFAULT_ADMIN_ROLE(),
      owner.address
    );
    expect(hasRole).to.equal(true);

    //grant role
    await contract.grantRole(ethers.utils.id('MINTER_ROLE'), owner.address);
    await contract.mint(addr1.address, '100');

    //revoke role
    await contract.revokeRole(ethers.utils.id('MINTER_ROLE'), owner.address);
    await expect(contract.mint(addr2.address, '100')).to.be.revertedWith(
      'AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
    );
  });
});
