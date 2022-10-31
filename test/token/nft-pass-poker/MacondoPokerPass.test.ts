import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe.only('MacondoPokerPass', function () {
  let macondoTableNFT: Contract;

  it('MacondoPokerPass:Deploy Test', async function () {
    const MacondoTableNFT = await ethers.getContractFactory('MacondoPokerPass');
    macondoTableNFT = await upgrades.deployProxy(MacondoTableNFT);
    const address = await (await macondoTableNFT.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    expect(await macondoTableNFT.name()).to.equal("Tokens Hodl'em Poker Pass");
    expect(await macondoTableNFT.symbol()).to.equal('THP-PAS');
  });

  it('MacondoPokerPass:safeMint Test', async function () {
    const [owner] = await ethers.getSigners();
    const tokenId = '1';
    const tokenURI = '1';
    const tx = await macondoTableNFT.safeMint(owner.address, tokenId, tokenURI);
    await tx.wait();
    expect(await macondoTableNFT.totalSupply()).to.equal(1);

    const url = await macondoTableNFT.tokenURI(tokenId);
    expect(url).to.equal(
      'https://macondo-nft-storage.s3.us-west-1.amazonaws.com/meta/poker-pass-1'
    );
  });
});
