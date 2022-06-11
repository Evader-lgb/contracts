import { expect } from "chai";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
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
});
