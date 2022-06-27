import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe("MacondoNFT", function () {
  it("MacondoNFT:Deploy Test", async function () {
    const MacondoNFT = await ethers.getContractFactory("MacondoNFT");
    const macondoNFT = await upgrades.deployProxy(MacondoNFT);
    const address = await (await macondoNFT.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log("address", address);
  });
});
