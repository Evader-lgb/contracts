import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

describe('Contract TokenCollection', function () {
  let contract: Contract;

  beforeEach(async function () {
    const TokenCollection = await ethers.getContractFactory('TokenCollection');
    contract = await TokenCollection.deploy();
    await contract.deployed();
  });

  it('TokenCollection Transfer And withdraw Test', async function () {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    contract.grantRole(ethers.utils.id('WITHDRAW'), addr3.address);

    const tx = await addr1.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther('1'),
    });
    await tx.wait();

    await ethers.provider.getBalance(contract.address).then((balance) => {
      expect(balance).to.equal(ethers.utils.parseEther('1'));
    });

    await expect(
      contract.withdraw(addr1.address, ethers.utils.parseEther('1'))
    ).to.revertedWith(
      'AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x7a8dc26796a1e50e6e190b70259f58f6a4edd5b22280ceecc82b687b8e982869'
    );

    await contract
      .connect(addr3)
      .withdraw(addr1.address, ethers.utils.parseEther('1'));
    await ethers.provider.getBalance(contract.address).then((balance) => {
      expect(balance).to.equal(ethers.utils.parseEther('0'));
    });
  });

  it('TokenCollection Transfer And withdraw ERC20 Test', async function () {
    const MacondoUSDT = await ethers.getContractFactory('MacondoUSDT');
    const macondoUSDT = await MacondoUSDT.deploy();
    await macondoUSDT.deployed();

    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    contract.grantRole(ethers.utils.id('WITHDRAW_ERC20'), addr3.address);

    await macondoUSDT.mint(addr1.address, ethers.utils.parseEther('100'));

    await macondoUSDT
      .connect(addr1)
      .transfer(contract.address, ethers.utils.parseEther('100'));

    await macondoUSDT.balanceOf(contract.address).then((balance: string) => {
      expect(balance).to.equal(ethers.utils.parseEther('100'));
    });

    await expect(
      contract.withdrawERC20(
        macondoUSDT.address,
        addr1.address,
        ethers.utils.parseEther('100')
      )
    ).to.revertedWith(
      'AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0xa330ce73e09a78b66adf5d63034fbc76118eb63ebf42f8a90adff6eede66bd61'
    );

    await contract
      .connect(addr3)
      .withdrawERC20(
        macondoUSDT.address,
        addr1.address,
        ethers.utils.parseEther('100')
      );

    await macondoUSDT.balanceOf(contract.address).then((balance: string) => {
      expect(balance).to.equal(ethers.utils.parseEther('0'));
    });

    await macondoUSDT.balanceOf(addr1.address).then((balance: string) => {
      expect(balance).to.equal(ethers.utils.parseEther('100'));
    });
  });
});
