import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe.only('MacondoPokerPassMinterBlindBox', () => {
  let macondoPokerPass: Contract;
  let contract: Contract;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();

    const MacondoPokerPass = await ethers.getContractFactory(
      'MacondoPokerPass'
    );
    macondoPokerPass = await upgrades.deployProxy(MacondoPokerPass);
    await macondoPokerPass.deployed();

    const MacondoPokerPassMinterBlindBox = await ethers.getContractFactory(
      'MacondoPokerPassMinterBlindBox'
    );
    contract = await upgrades.deployProxy(MacondoPokerPassMinterBlindBox, [
      macondoPokerPass.address,
      owner.address,
    ]);
    await contract.deployed();

    //grant role : MINTER_ROLE
    await macondoPokerPass.grantRole(
      await macondoPokerPass.MINTER_ROLE(),
      contract.address
    );
  });

  it('MacondoTableNFTMinterBlindBox:Deploy Test', async () => {
    const address = contract.address;
    expect(ethers.utils.isAddress(address)).to.be.any;

    const defaultConfig = await contract.defaultConfig();
    expect(defaultConfig.period).to.equal('0');
    expect(defaultConfig.price).to.equal('0');
    expect(defaultConfig.startTimestamp).to.equal('0');
    expect(defaultConfig.endTimestamp).to.equal('0');
  });

  describe('MacondoTableNFTMinterBlindBox:sale', () => {
    beforeEach(async () => {
      await contract.setSaleConfig(
        '1',
        ethers.utils.parseEther('1'),
        Math.floor(new Date().getTime() / 1000) - 20 * 60,
        Math.floor(new Date().getTime() / 1000) + 20 * 60,
        '50'
      );

      await contract.setInitialTokenId(200000);
    });

    it('success', async () => {
      const [owner, addr1] = await ethers.getSigners();

      await expect(contract.sale({ value: ethers.utils.parseEther('1') }))
        .to.emit(contract, 'SaleBox')
        .withArgs(owner.address, 200000);
      //check nft token
      expect(await macondoPokerPass.ownerOf(200000)).to.equal(owner.address);
      expect(await macondoPokerPass.tokenURI(200000)).to.equal(
        'https://macondo-nft-storage.s3.us-west-1.amazonaws.com/meta/poker-pass-200000'
      );

      await expect(contract.sale({ value: ethers.utils.parseEther('1') }))
        .to.emit(contract, 'SaleBox')
        .withArgs(owner.address, 200001);

      //check nft token
      expect(await macondoPokerPass.ownerOf(200001)).to.equal(owner.address);
      expect(await macondoPokerPass.tokenURI(200001)).to.equal(
        'https://macondo-nft-storage.s3.us-west-1.amazonaws.com/meta/poker-pass-200001'
      );
    });

    it('fail:not in period', async () => {
      const [owner, addr1] = await ethers.getSigners();

      await contract.setSaleConfig(
        '1',
        ethers.utils.parseEther('1'),
        Math.floor(new Date().getTime() / 1000) + 10 * 60,
        Math.floor(new Date().getTime() / 1000) + 20 * 60,
        '50'
      );

      await expect(
        contract.sale({ value: ethers.utils.parseEther('1') })
      ).to.be.revertedWith('sale not start');

      await contract.setSaleConfig(
        '1',
        ethers.utils.parseEther('1'),
        Math.floor(new Date().getTime() / 1000) - 40 * 60,
        Math.floor(new Date().getTime() / 1000) - 20 * 60,
        '50'
      );

      await expect(
        contract.sale({ value: ethers.utils.parseEther('1') })
      ).to.be.revertedWith('sale end');
    });

    it('fail:reach sale count limit', async () => {
      const [owner, addr1] = await ethers.getSigners();

      await contract.setSaleConfig(
        '1',
        ethers.utils.parseEther('1'),
        Math.floor(new Date().getTime() / 1000) - 20 * 60,
        Math.floor(new Date().getTime() / 1000) + 20 * 60,
        '1'
      );

      await contract.sale({ value: ethers.utils.parseEther('1') });

      await expect(
        contract.sale({ value: ethers.utils.parseEther('1') })
      ).to.be.revertedWith('sale count limit');
    });

    it('success withdraw', async () => {
      const [owner, addr1] = await ethers.getSigners();

      expect((await contract.currentTokenId()).toNumber()).to.equal(200000);
      await contract.sale({ value: ethers.utils.parseEther('1') });
      expect((await contract.currentTokenId()).toNumber()).to.equal(200001);
      await contract.sale({ value: ethers.utils.parseEther('1') });
      expect((await contract.currentTokenId()).toNumber()).to.equal(200002);
      await contract.sale({ value: ethers.utils.parseEther('1') });
      expect((await contract.currentTokenId()).toNumber()).to.equal(200003);

      const contractBalance = await ethers.provider.getBalance(
        contract.address
      );
      expect(contractBalance).to.equal(ethers.utils.parseEther('3'));

      await contract.withdraw();

      const contractBalanceAfter = await ethers.provider.getBalance(
        contract.address
      );
      expect(contractBalanceAfter).to.equal(0);
    });

    it('fail:wrong price', async () => {
      const [owner, addr1] = await ethers.getSigners();

      await contract.setSaleConfig(
        '1',
        ethers.utils.parseEther('2'),
        Math.floor(new Date().getTime() / 1000) - 20 * 60,
        Math.floor(new Date().getTime() / 1000) + 20 * 60,
        '50'
      );

      await expect(
        contract.sale({ value: ethers.utils.parseEther('1') })
      ).to.be.revertedWith('not enough money');
    });
  });
});
