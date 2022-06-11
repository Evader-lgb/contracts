import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
// 3.指定合约的合约地址
const contractAddress = "0xeABe0c63EBef2F49ec93d31369c9F1C552532C62";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_TESTNET_URL, PRIVATE_KEY } = process.env;

describe("RandomOracleConsumer", function () {
  let randomOracleConsumer: Contract;
  let provider: any;
  beforeEach(async function () {
    const RandomOracleConsumer = await ethers.getContractFactory(
      "RandomOracleConsumer"
    );
    randomOracleConsumer = await RandomOracleConsumer.deploy(
      577,
      "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
    );
    await randomOracleConsumer.deployed();
  });

  it("RandomOracleConsumer:Test", async function () {
    const s_randomWords1 = await randomOracleConsumer.getRandomWords();
    console.log("s_randomWords", s_randomWords1);
    expect(s_randomWords1).to.be.empty;
  });
});
