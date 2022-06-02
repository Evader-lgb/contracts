import { expect } from "chai";
import { ethers } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
const TokenERC20ContractABI = require("../third_party_abi/TokenERC20.json");
describe("FundCollection", function () {
  it("FundCollection:Deploy Test", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log("address", address);
  });

  it("FundCollection:createFundCollectionMacondoUSDT", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;

    console.log("address", address);
    //compute salt
    const salt = ethers.utils.id("12345");

    const FundCollectorMacondoUSDT = await ethers.getContractFactory(
      "FundCollectorMacondoUSDT"
    );
    const fundCollectorMacondoUSDTInitCode = ethers.utils.keccak256(
      FundCollectorMacondoUSDT.bytecode
    );
    console.log(
      "fundCollectorMacondoUSDTInitCode",
      fundCollectorMacondoUSDTInitCode
    );
    const computedAddress = ethers.utils.getCreate2Address(
      address,
      salt,
      fundCollectorMacondoUSDTInitCode
    );

    await expect(fundCollection.createFundCollectionMacondoUSDT(salt))
      .to.emit(fundCollection, "Deployed")
      .withArgs(computedAddress, salt);
    console.log("computedAddress", computedAddress);
  });

  it("FundCollection:CollectionMacondoUSDT Use Case", async function () {
    const FundCollection = await ethers.getContractFactory("FundCollection");
    const fundCollection = await FundCollection.deploy();
    const fundCollectionAddress = await (
      await fundCollection.deployed()
    ).address;
    console.log("fundCollection address", fundCollectionAddress);

    const fundCollectionBalance = await fundCollection.provider.getBalance(
      fundCollectionAddress
    );
    console.log("fundCollectionBalance", fundCollectionBalance);

    //compute salt
    const salt = ethers.utils.id("12345");

    //compute address
    const FundCollectorMacondoUSDT = await ethers.getContractFactory(
      "FundCollectorMacondoUSDT"
    );
    const fundCollectorMacondoUSDTInitCode = ethers.utils.keccak256(
      FundCollectorMacondoUSDT.bytecode
    );
    const computedAddress = ethers.utils.getCreate2Address(
      fundCollectionAddress,
      salt,
      fundCollectorMacondoUSDTInitCode
    );
    console.log("computedAddress", computedAddress);

    const TokenAddress = "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66";
    const hotWalletAddress = "0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3";
    //get TokenERC20 contract
    const TokenContract = new ethers.Contract(
      TokenAddress,
      TokenERC20ContractABI,
      fundCollection.provider
    );

    const computeAddressBalance = await TokenContract.balanceOf(
      computedAddress
    );
    expect(computeAddressBalance).to.equal(0);
    console.log("computed balance", computeAddressBalance);

    const hotWalletBalance = await TokenContract.balanceOf(hotWalletAddress);
    expect(hotWalletBalance).to.equal(0);
    console.log("hotWallet balance", hotWalletBalance);

    //transfer 1000 token to computedAddress
    const signer = new ethers.Wallet(
      PRIVATE_KEY as string,
      fundCollection.provider
    );
    const tx = await TokenContract.connect(signer).transfer(
      computedAddress,
      1000
    );
    const txWait = await tx.wait();
    console.log("transfer gas used", txWait.gasUsed);
    const computeAddressBalanceAfterTransfer = await TokenContract.balanceOf(
      computedAddress
    );
    expect(computeAddressBalanceAfterTransfer).to.equal(1000);
    console.log(
      "computed balance after transfer",
      computeAddressBalanceAfterTransfer
    );

    //开始归集资金
    //设置手续费账号
    const [owner, gasFeeAccount] = await ethers.getSigners();
    console.log("gasFeeAccount address", gasFeeAccount.address);

    //开始归集资金
    const txCollection = await fundCollection
      .connect(gasFeeAccount)
      .createFundCollectionMacondoUSDT(salt);
    const txCollectionReceipt = await txCollection.wait();
    console.log("Collection gas used", txCollectionReceipt.gasUsed);

    //检查 computeAddress 余额是否为0
    const computeAddressBalanceAfterCollect = await TokenContract.balanceOf(
      computedAddress
    );
    expect(computeAddressBalanceAfterCollect).to.equal(0);
    console.log(
      "computed balance after collect",
      computeAddressBalanceAfterCollect
    );

    //check hotWallet balance
    const hotWalletBalanceAfterCollect = await TokenContract.balanceOf(
      hotWalletAddress
    );
    expect(hotWalletBalanceAfterCollect).to.equal(1000);
    console.log(
      "hotWallet balance after  collect",
      hotWalletBalanceAfterCollect
    );

    const fundCollectionBalanceAfter = await fundCollection.provider.getBalance(
      hotWalletAddress
    );
    console.log("fundCollectionBalanceAfter", fundCollectionBalanceAfter);
  });
});
