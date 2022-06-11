import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC20TokenUtil } from "./utils/ERC20Token.util";
// 3.指定合约的合约地址
const contractAddress = "0xeABe0c63EBef2F49ec93d31369c9F1C552532C62";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_TESTNET_URL, PRIVATE_KEY } = process.env;

describe.skip("VRFv2SubscriptionManager", function () {
  let vRFv2SubscriptionManager: Contract;
  let provider: any;
  beforeEach(async function () {
    const VRFv2SubscriptionManager = await ethers.getContractFactory(
      "VRFv2SubscriptionManager"
    );
    vRFv2SubscriptionManager = await VRFv2SubscriptionManager.attach(
      contractAddress
    );
    provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_TESTNET_URL);
  });

  it("VRFv2SubscriptionManager Test", async function () {
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    const contract = await vRFv2SubscriptionManager.connect(signer);
    const s_subscriptionId = await contract.s_subscriptionId();
    console.log("s_subscriptionId", s_subscriptionId);
    expect(s_subscriptionId).to.be.instanceOf(BigNumber);
    expect(s_subscriptionId).to.equal(573);

    const tokenLinkContract = ERC20TokenUtil.createTokenLink(signer);
    // balance of manager
    const balanceOfManager: BigNumber = await tokenLinkContract.balanceOf(
      contractAddress
    );
  });

  it("VRFv2SubscriptionManager:Generate random number", async function () {
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    const contract = await vRFv2SubscriptionManager.connect(signer);
    const tx = await contract.requestRandomWords({
      gasLimit: 100000,
    });
    const receipt = await tx.wait();

    const s_randomWords1 = await contract.s_randomWords(0);
    const s_randomWords2 = await contract.s_randomWords(1);
    console.log("s_randomWords", s_randomWords1, s_randomWords2);
  });

  it.skip("VRFv2SubscriptionManager Recharge Subscription Fee", async function () {
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    const contract = await vRFv2SubscriptionManager.connect(signer);
    const s_subscriptionId = await contract.s_subscriptionId();
    console.log("s_subscriptionId", s_subscriptionId);
    expect(s_subscriptionId).to.be.instanceOf(BigNumber);
    expect(s_subscriptionId).to.equal(573);

    const tokenLinkContract = ERC20TokenUtil.createTokenLink(signer);
    const balance: BigNumber = await tokenLinkContract.balanceOf(
      signer.address
    );
    console.log("tokenLinkContract balance", ethers.utils.formatEther(balance));

    //transfer link to subscription manager
    let tx = await tokenLinkContract.transfer(
      contractAddress,
      ethers.utils.parseEther("0.1")
    );
    let receipt = await tx.wait();
    console.log("transfer receipt", receipt);
    const balance2: BigNumber = await tokenLinkContract.balanceOf(
      signer.address
    );
    console.log(
      "tokenLinkContract balance of signer",
      ethers.utils.formatEther(balance2)
    );

    //balance of manager
    const balanceOfManager: BigNumber = await tokenLinkContract.balanceOf(
      contractAddress
    );
    console.log(
      "tokenLinkContract balance of SubscriptionManager",
      ethers.utils.formatEther(balanceOfManager)
    );

    if (balanceOfManager.gt(0)) {
      let tx = await contract.topUpSubscription(balanceOfManager, {
        gasLimit: 100000,
      });
      let receipt = await tx.wait();
      console.log("receipt", receipt);
    }
  });
});
