import { ethers } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe.only("FundCollection", function () {
  it("FundCollection Test", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;

    console.log("address", address);
    //compute salt
    const salt = ethers.utils.id("12345");
    const result = await fundCollection.createFundCollectionMacondoUSDT(salt);

    result.wait();
    console.log("result", result);

    const FundCollectorMacondoUSDT = await ethers.getContractFactory(
      "FundCollectorMacondoUSDT"
    );
    const computedAddress = ethers.utils.getCreate2Address(
      address,
      salt,
      ethers.utils.keccak256(FundCollectorMacondoUSDT.bytecode)
    );
    console.log("computedAddress", computedAddress);
  });
});
