import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

const {
  ALCHEMY_API_MAINNET_URL,
  PRIVATE_KEY,
  PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER,
} = process.env;
describe("MacondoTableNFT", function () {
  it("MacondoTableNFT:Deploy Test", async function () {
    const MacondoTableNFT = await ethers.getContractFactory("MacondoTableNFT");
    const macondoTableNFT = await upgrades.deployProxy(MacondoTableNFT);
    const address = await (await macondoTableNFT.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log("address", address);

    expect(await macondoTableNFT.name()).to.equal("MacondoTableNFT");
    expect(await macondoTableNFT.symbol()).to.equal("NFT-Table");

    const uri = ethers.utils.id("我是一个uri");
    const baseURI = "tables-nft-";
    const toAddress = ethers.utils.computeAddress(`0x${PRIVATE_KEY}`);
    const tokenId = 0;
    console.log("toAddress", toAddress);

    // const tx = await macondoTableNFT.safeMint(toAddress, uri);
    // await tx.wait();

    await expect(macondoTableNFT.safeMint(toAddress, uri))
      .to.emit(macondoTableNFT, "Transfer")
      .withArgs(ethers.constants.AddressZero, toAddress, tokenId);

    const tokenURI = await macondoTableNFT.tokenURI(tokenId);
    console.log("tokenURI", tokenURI);
    expect(tokenURI).to.equal(`${baseURI}${uri}`);
  });
});
