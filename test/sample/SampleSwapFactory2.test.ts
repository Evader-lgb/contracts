import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('SampleSwapFactory2', () => {
  let contract: Contract;

  it('should be deploy pair', async () => {
    const SampleSwapFactory = await ethers.getContractFactory(
      'SampleSwapFactory2'
    );
    contract = await SampleSwapFactory.deploy();

    const [owner, tokenA, tokenB] = await ethers.getSigners();

    //计算将要部署的合约地址
    const pairAddress = await contract.calculateAddr(
      tokenA.address,
      tokenB.address
    );
    console.log(`pairAddress: ${pairAddress}`);

    await contract.createPair2(tokenA.address, tokenB.address);

    const pair = await contract.getPair(tokenA.address, tokenB.address);
    expect(pair).to.equal(pairAddress);

    const pairAddressWithLib = await contract.calculateAddrWithLib(
      tokenA.address,
      tokenB.address
    );
    expect(pair).to.equal(pairAddressWithLib);
  });
});
