import { expect } from "chai";
import { BigNumber, Contract, Wallet } from "ethers";
import { ethers } from "hardhat";
import { ERC20TokenUtil } from "./utils/ERC20Token.util";
// 3.指定合约的合约地址
const contractAddress = "0xeABe0c63EBef2F49ec93d31369c9F1C552532C62";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_TESTNET_URL, PRIVATE_KEY } = process.env;

const ERC20ABI = require("../third_party_abi/TokenERC20.json");

function createERC20Contract(erc20Address: string, signer?: Wallet): Contract {
  return new ethers.Contract(erc20Address, ERC20ABI, signer);
}
function createERCLink(signer?: Wallet): Contract {
  return new ethers.Contract(
    "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    ERC20ABI,
    signer
  );
}

describe("VRFv2SubscriptionManager", function () {
  it("VRFv2SubscriptionManager Test", async function () {
    const VRFv2SubscriptionManager = await ethers.getContractFactory(
      "VRFv2SubscriptionManager"
    );
    const vRFv2SubscriptionManager = await VRFv2SubscriptionManager.attach(
      contractAddress
    );
    const provider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_API_TESTNET_URL
    );

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

    // // const result = await vRFv2Consumer.connect(signer).s_requestId();
    // // console.log("result", result);
    // // expect(await macondoUSDT.name()).to.equal("Macondo-USDT");
    // // expect(await macondoUSDT.symbol()).to.equal("USDT");
  });

  it.skip("VRFv2SubscriptionManager Recharge Subscription Fee", async function () {
    const VRFv2SubscriptionManager = await ethers.getContractFactory(
      "VRFv2SubscriptionManager"
    );
    const vRFv2SubscriptionManager = await VRFv2SubscriptionManager.attach(
      contractAddress
    );
    const provider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_API_TESTNET_URL
    );

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
