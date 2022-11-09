import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, network, upgrades } from 'hardhat';

describe('MacondoUSDTFaucet', function () {
  let macondoUSDT: Contract;
  let macondoUSDTFaucet: Contract;
  beforeEach(async () => {
    const MacondoUSDT = await ethers.getContractFactory('MacondoUSDT');
    macondoUSDT = await upgrades.deployProxy(MacondoUSDT);
    await macondoUSDT.deployed();

    const MacondoUSDTFaucet = await ethers.getContractFactory(
      'MacondoUSDTFaucet'
    );
    macondoUSDTFaucet = await upgrades.deployProxy(MacondoUSDTFaucet, [
      macondoUSDT.address,
    ]);
    await macondoUSDTFaucet.deployed();

    //grant minter role to macondoUSDTFaucet
    await macondoUSDT.grantRole(
      await macondoUSDT.MINTER_ROLE(),
      macondoUSDTFaucet.address
    );
  });

  describe('MacondoUSDTFaucet claim', async function () {
    it('success', async () => {
      const [owner, addr1] = await ethers.getSigners();
      await expect(macondoUSDTFaucet.connect(addr1).claim())
        .emit(macondoUSDTFaucet, 'Faucet')
        .withArgs(addr1.address, ethers.utils.parseEther('100'));

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther('100')
      );
    });

    it('success claim 2 days', async () => {
      const [owner, addr1] = await ethers.getSigners();
      macondoUSDTFaucet = macondoUSDTFaucet.connect(addr1);
      await expect(macondoUSDTFaucet.claim())
        .emit(macondoUSDTFaucet, 'Faucet')
        .withArgs(addr1.address, ethers.utils.parseEther('100'));

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther('100')
      );

      await network.provider.send('evm_increaseTime', [86400]);
      await macondoUSDTFaucet.claim().then(async (tx: any) => {
        await tx.wait();
      });

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther('200')
      );
    });

    it('fail:claim 2 times', async () => {
      const [owner, addr1] = await ethers.getSigners();
      macondoUSDTFaucet = macondoUSDTFaucet.connect(addr1);

      await macondoUSDTFaucet.claim().then(async (tx: any) => {
        await tx.wait();
      });

      await expect(macondoUSDTFaucet.claim()).to.be.revertedWith(
        'MacondoUSDTFaucet: faucetTime not reached, left time: '
      );
    });
  });

  describe('MacondoUSDTFaucet claimWithRole', async function () {
    it('success', async () => {
      const [owner, addr1] = await ethers.getSigners();
      await expect(macondoUSDTFaucet.claimWithRole(addr1.address))
        .emit(macondoUSDTFaucet, 'Faucet')
        .withArgs(addr1.address, ethers.utils.parseEther('100'));

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther('100')
      );
    });

    it('success claim 2 days', async () => {
      const [owner, addr1] = await ethers.getSigners();
      await macondoUSDTFaucet
        .claimWithRole(addr1.address)
        .then(async (tx: any) => {
          await tx.wait();
        });

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther('100')
      );

      await network.provider.send('evm_increaseTime', [86400]);
      await macondoUSDTFaucet
        .claimWithRole(addr1.address)
        .then(async (tx: any) => {
          await tx.wait();
        });

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(
        ethers.utils.parseEther('200')
      );
    });
    it('fail:claim 2 times', async () => {
      const [owner, addr1] = await ethers.getSigners();

      await macondoUSDTFaucet
        .claimWithRole(addr1.address)
        .then(async (tx: any) => {
          await tx.wait();
        });

      await expect(macondoUSDTFaucet.claimWithRole(addr1.address)).to.be
        .reverted;
    });
  });

  describe('MacondoUSDTFaucet claimAmountWithRole', async function () {
    it('success', async () => {
      const [owner, addr1] = await ethers.getSigners();
      const amount = ethers.utils.parseEther('1000');
      await expect(macondoUSDTFaucet.claimAmountWithRole(addr1.address, amount))
        .emit(macondoUSDTFaucet, 'Faucet')
        .withArgs(addr1.address, amount);

      //check balance
      expect(await macondoUSDT.balanceOf(addr1.address)).to.equal(amount);
    });

    it('fail:claim 2 times', async () => {
      const [owner, addr1] = await ethers.getSigners();
      const amount = ethers.utils.parseEther('1000');
      await macondoUSDTFaucet
        .claimAmountWithRole(addr1.address, amount)
        .then(async (tx: any) => {
          await tx.wait();
        });

      await expect(macondoUSDTFaucet.claimAmountWithRole(addr1.address, amount))
        .to.be.reverted;
    });

    it('fail:claim zero amount', async () => {
      const [owner, addr1] = await ethers.getSigners();
      const amount = ethers.utils.parseEther('0');
      await expect(macondoUSDTFaucet.claimAmountWithRole(addr1.address, amount))
        .to.be.reverted;
    });

    it('fail:claim to zero address', async () => {
      const [owner, addr1] = await ethers.getSigners();
      const amount = ethers.utils.parseEther('1000');
      await expect(
        macondoUSDTFaucet.claimAmountWithRole(
          ethers.constants.AddressZero,
          amount
        )
      ).to.be.reverted;
    });
  });
});
