import { expect } from 'chai';

import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('SampleTransferContract', () => {
  let contract: Contract;
  let tokenContract: Contract;

  beforeEach(async () => {
    const TokenContract = await ethers.getContractFactory('MacondoBFB');
    tokenContract = await TokenContract.deploy();
    await tokenContract.deployed();
  });

  it('should deploy', async () => {
    const SampleTransferContract = await ethers.getContractFactory(
      'SampleTransferContract'
    );
    contract = await SampleTransferContract.deploy(tokenContract.address);
    await contract.deployed();
  });

  it('should portion', async () => {
    const SampleTransferContract = await ethers.getContractFactory(
      'SampleTransferContract'
    );
    contract = await SampleTransferContract.deploy(tokenContract.address);
    await contract.deployed();

    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    await tokenContract.mint(contract.address, ethers.utils.parseEther('1000'));

    await contract.setPortion(addr1.address, '200');
    await contract.setPortion(addr2.address, '300');
    await contract.setPortion(addr3.address, '500');
    await contract.portion();

    expect(await tokenContract.balanceOf(addr1.address)).to.equal(
      ethers.utils.parseEther('200').toString()
    );
    expect(await tokenContract.balanceOf(addr2.address)).to.equal(
      ethers.utils.parseEther('300').toString()
    );
    expect(await tokenContract.balanceOf(addr3.address)).to.equal(
      ethers.utils.parseEther('500').toString()
    );
  });
});
