import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

const {
  ALCHEMY_API_MAINNET_URL,
  PRIVATE_KEY,
  PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER,
} = process.env;
describe("MacondoItemToken", function () {
  it("MacondoItemToken:Deploy Test", async function () {
    const MacondoItemToken = await ethers.getContractFactory(
      "MacondoItemToken"
    );
    const macondoItemToken = await upgrades.deployProxy(MacondoItemToken);
    const address = await (await macondoItemToken.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log("address", address);

    expect(await macondoItemToken.uri(0)).to.equal("uri-base");

    const itemId = ethers.utils.id("我是一个uri");
    const amount = 2;
    const baseURI = "tables-nft-";
    const toAddress = ethers.utils.computeAddress(`0x${PRIVATE_KEY}`);
    const tokenId = 0;
    console.log("toAddress", toAddress);

    const [owner, second] = await ethers.getSigners();

    await expect(
      macondoItemToken.mint(
        toAddress,
        itemId,
        amount,
        ethers.utils.toUtf8Bytes("uri-base")
      )
    )
      .to.emit(macondoItemToken, "TransferSingle")
      .withArgs(
        owner.address,
        ethers.constants.AddressZero,
        toAddress,
        itemId,
        amount
      );

    const balance = await macondoItemToken.balanceOf(toAddress, itemId);
    console.log("balance", balance);
    expect(balance).to.equal(amount);
  });
});
