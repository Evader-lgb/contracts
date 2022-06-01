import { ethers } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe("FundCollection", function () {
  it("FundCollection Test", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;

    console.log("address", address);
    //compute salt
    const salt = ethers.utils.id("12345");
    const result = await fundCollection.createFundCollectionMacondoUSDT(salt);

    result.wait();

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
    console.log("computedAddress", computedAddress);
  });
});
