import { expect } from 'chai';
import { randomInt } from 'crypto';
import { ethers, upgrades } from 'hardhat';

describe('MacondoTableNFT', function () {
  it('MacondoTableNFT:Deploy Test', async function () {
    const MacondoTableNFT = await ethers.getContractFactory('MacondoTableNFT');
    const macondoTableNFT = await upgrades.deployProxy(MacondoTableNFT);
    const address = await (await macondoTableNFT.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    expect(await macondoTableNFT.name()).to.equal('MacondoTableNFT');
    expect(await macondoTableNFT.symbol()).to.equal('MCT');
  });

  it('MacondoTableNFT:SafeMin', async function () {
    const MacondoTableNFT = await ethers.getContractFactory('MacondoTableNFT');
    const macondoTableNFT = await upgrades.deployProxy(MacondoTableNFT);

    const uri =
      'https://ipfs.filebase.io/ipfs/QmeNbXJvrXS8MwSV6zMoQQFey46dM4WqDR5NLnC5Qi24GU';
    const baseURI = '';
    const toAddress = '0x74D748501728cAc09f4b6bc9c989E1854e0af7Df';

    const tokenId = randomInt(10000);
    await expect(macondoTableNFT.safeMint(toAddress, tokenId, uri))
      .to.emit(macondoTableNFT, 'Transfer')
      .withArgs(ethers.constants.AddressZero, toAddress, tokenId);

    const tokenURI = await macondoTableNFT.tokenURI(tokenId);
    expect(tokenURI).to.equal(`${baseURI}${uri}`);
  });
});
