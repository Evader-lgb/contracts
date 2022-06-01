import { expect } from "chai";
import { ethers } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe("FundCollection", function () {
  it("FundCollection:Deploy Test", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log("address", address);
  });

  it("FundCollection:createFundCollectionMacondoUSDT", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;

    console.log("address", address);
    //compute salt
    const salt = ethers.utils.id("12345");

    const FundCollectorMacondoUSDT = await ethers.getContractFactory(
      "FundCollectorMacondoUSDT"
    );
    const fundCollectorMacondoUSDTInitCode = ethers.utils.keccak256(
      FundCollectorMacondoUSDT.bytecode
    );
    console.log(
      "fundCollectorMacondoUSDTInitCode",
      fundCollectorMacondoUSDTInitCode
    );
    const computedAddress = ethers.utils.getCreate2Address(
      address,
      salt,
      fundCollectorMacondoUSDTInitCode
    );

    await expect(fundCollection.createFundCollectionMacondoUSDT(salt))
      .to.emit(fundCollection, "Deployed")
      .withArgs(computedAddress, salt);
    console.log("computedAddress", computedAddress);
  });
});
