import { ethers } from "hardhat";
// 3.指定合约的合约地址
const contractAddress = "0x519a562Ebd4A55724B84871BAd626AC2D2a6246B";
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_TESTNET_URL, PRIVATE_KEY } = process.env;

describe("VRFv2Consumer", function () {
  it.skip("VRFv2Consumer Test", async function () {
    const VRFv2Consumer = await ethers.getContractFactory("VRFv2Consumer");
    const vRFv2Consumer = await VRFv2Consumer.attach(contractAddress);
    const provider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_API_TESTNET_URL
    );

    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    const contract = await vRFv2Consumer.connect(signer);
    let s_requestId = await contract.s_requestId();
    const tx = await contract.requestRandomWords({
      gasLimit: 100000,
    });
    const receipt = await tx.wait();
    s_requestId = await contract.s_requestId();
    console.log("s_requestId", s_requestId);

    const s_randomWords1 = await contract.s_randomWords(0);
    const s_randomWords2 = await contract.s_randomWords(1);
    console.log("s_randomWords", s_randomWords1, s_randomWords2);
  });
});
