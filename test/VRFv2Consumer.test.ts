import { ethers } from "hardhat";
// 3.指定合约的合约地址
const contractAddress = "0x5fc260eabf014b60272f1e04e93e3bda0b51174f";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;

describe("VRFv2Consumer", function () {
  it("VRFv2Consumer Test", async function () {
    const VRFv2Consumer = await ethers.getContractFactory("VRFv2Consumer");
    const vRFv2Consumer = await VRFv2Consumer.attach(contractAddress);
    const provider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_API_MAINNET_URL
    );
    // const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    // const tx = await vRFv2Consumer.connect(signer).requestRandomWords();
    // // const result = await vRFv2Consumer.connect(signer).s_requestId();
    // // console.log("result", result);
    // // expect(await macondoUSDT.name()).to.equal("Macondo-USDT");
    // // expect(await macondoUSDT.symbol()).to.equal("USDT");
  });
});
