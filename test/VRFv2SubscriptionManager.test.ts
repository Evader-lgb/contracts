import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
// 3.指定合约的合约地址
const contractAddress = "0xeABe0c63EBef2F49ec93d31369c9F1C552532C62";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_URL, PRIVATE_KEY } = process.env;

describe("VRFv2SubscriptionManager", function () {
  it("VRFv2SubscriptionManager Test", async function () {
    const VRFv2SubscriptionManager = await ethers.getContractFactory(
      "VRFv2SubscriptionManager"
    );
    const vRFv2SubscriptionManager = await VRFv2SubscriptionManager.attach(
      contractAddress
    );
    const provider = new ethers.providers.JsonRpcProvider(ALCHEMY_API_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    const s_subscriptionId = await vRFv2SubscriptionManager
      .connect(signer)
      .s_subscriptionId();
    console.log("s_subscriptionId", s_subscriptionId);
    expect(s_subscriptionId).to.be.instanceOf(BigNumber);
    // // const result = await vRFv2Consumer.connect(signer).s_requestId();
    // // console.log("result", result);
    // // expect(await macondoUSDT.name()).to.equal("Macondo-USDT");
    // // expect(await macondoUSDT.symbol()).to.equal("USDT");
  });
});
