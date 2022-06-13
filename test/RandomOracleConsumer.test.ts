import { expect } from "chai";
import { BigNumber, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";
import random from "random";
const seedRandom = require("seedrandom");
// 3.指定合约的合约地址
const contractAddress = "0xCCFB5E9f45858b93ffA8932fD1ccE2373a9D9E25";
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
    const s_randomWords = await contract.getRandomWords(1);
    console.log("s_randomWords", s_randomWords);
    expect(s_randomWords).to.be.empty;
    const s_requestId = await contract.s_requestId();
    console.log("s_requestId", s_requestId);
  });

  it.only("RandomOracleConsumer:Request random number", async function () {
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    contract = ContractFactory.attach(contractAddress).connect(signer);
    const tx = await contract.requestRandomWords({
      gasLimit: 100000,
    });
    const s_requestId: BigNumber = await contract.s_requestId();
    const s_randomWords = await contract.getRandomWords(s_requestId.toString());
    expect(s_randomWords).not.to.be.empty;
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

  it("RandomOracleConsumer:Poker Knuth-Durstenfeld Shuffle", async function () {
    const randomSeed = "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed";
    const rng = random.clone(seedRandom(randomSeed));
    let r = [];
    for (let i = 0; i < 50; i++) {
      r.push(rng.int(0, 200));
    }

    expect(r).to.eql([
      56, 178, 71, 102, 118, 22, 66, 73, 168, 137, 155, 175, 70, 19, 103, 112,
      109, 98, 72, 79, 109, 78, 141, 117, 200, 166, 21, 109, 68, 173, 109, 71,
      133, 161, 114, 89, 21, 142, 1, 57, 176, 77, 179, 91, 195, 153, 138, 136,
      200, 82,
    ]);

    let cards = [];
    for (let i = 0; i < 54; i++) {
      cards.push(i);
    }
    expect(cards).to.eql([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
      39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
    ]);

    for (let i = cards.length - 1; i >= 0; i--) {
      const j = rng.int(0, i);
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    expect(cards).to.eql([
      2, 10, 30, 40, 39, 50, 9, 15, 12, 28, 51, 32, 25, 27, 37, 34, 3, 26, 44,
      33, 38, 41, 23, 53, 31, 5, 48, 19, 21, 46, 18, 4, 6, 0, 35, 49, 24, 43,
      52, 16, 1, 17, 22, 7, 11, 47, 14, 42, 36, 20, 29, 13, 8, 45,
    ]);
  });
});
