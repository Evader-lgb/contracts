import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

const {
  ALCHEMY_API_MAINNET_URL,
  PRIVATE_KEY,
  PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER,
} = process.env;
describe('MacondoItemNFT', function () {
  it('MacondoItemNFT:Deploy Test', async function () {
    const MacondoItemNFT = await ethers.getContractFactory('MacondoItemNFT');
    const macondoItemNFT = await upgrades.deployProxy(MacondoItemNFT);
    const address = await (await macondoItemNFT.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log('address', address);

    expect(await macondoItemNFT.uri(0)).to.equal('uri-base');

    const itemId = ethers.utils.id('tables-nft::0');
    const amount = 3;
    const toAddress = ethers.utils.computeAddress(`0x${PRIVATE_KEY}`);
    console.log('toAddress', toAddress);

    const [owner] = await ethers.getSigners();

    await expect(
      macondoItemNFT.mint(
        toAddress,
        itemId,
        amount,
        ethers.utils.toUtf8Bytes('table-nft')
      )
    )
      .to.emit(macondoItemNFT, 'TransferSingle')
      .withArgs(
        owner.address,
        ethers.constants.AddressZero,
        toAddress,
        itemId,
        amount
      );

    const balance = await macondoItemNFT.balanceOf(toAddress, itemId);
    expect(balance).to.equal(amount);
  });
});
