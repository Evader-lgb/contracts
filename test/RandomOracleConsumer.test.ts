import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import random from "random";
const seedRandom = require("seedrandom");
// 3.指定合约的合约地址
const contractAddress = "0x046d33a22149857FaAEc9440019D9782a6d138e4";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_TESTNET_URL, PRIVATE_KEY } = process.env;

describe("RandomOracleConsumer", function () {
  let ContractFactory: ContractFactory;
  let contract: Contract;
  let provider: any;
  beforeEach(async function () {
    ContractFactory = await ethers.getContractFactory("RandomOracleConsumer");
    contract = await ContractFactory.deploy(
      577,
      "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
    );
    await contract.deployed();
    provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_TESTNET_URL);
  });

  it("RandomOracleConsumer:Test", async function () {
    const s_randomWords = await contract.getRandomWords();
    console.log("s_randomWords", s_randomWords);
    expect(s_randomWords).to.be.empty;
  });

  it("RandomOracleConsumer:Request random number", async function () {
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    contract = ContractFactory.attach(contractAddress).connect(signer);
    const tx = await contract.requestRandomWords({
      gasLimit: 100000,
    });
    const receipt = await tx.wait();
    const s_randomWords = await contract.getRandomWords();
    expect(s_randomWords).to.not.be.empty;
    console.log("s_randomWords", s_randomWords);
  });

  it("RandomOracleConsumer:Generate seed random number", async function () {
    const randomSeed = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    let r: number[] = [];
    for (let i = 0; i < 50; i++) {
      r.push(random.int(0, 100));
    }
    // console.log("r", r);

    //seed random number
    random.use(seedRandom(randomSeed));
    r = [];
    for (let i = 0; i < 50; i++) {
      r.push(random.int(0, 200));
    }

    expect(r).to.eql([
      56, 178, 71, 102, 118, 22, 66, 73, 168, 137, 155, 175, 70, 19, 103, 112,
      109, 98, 72, 79, 109, 78, 141, 117, 200, 166, 21, 109, 68, 173, 109, 71,
      133, 161, 114, 89, 21, 142, 1, 57, 176, 77, 179, 91, 195, 153, 138, 136,
      200, 82,
    ]);
  });
});
