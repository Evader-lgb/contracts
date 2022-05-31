import { expect } from "chai";
import { ethers } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe.only("TokenTransfer", function () {
  it("TokenTransfer Test", async function () {
    const TokenTransfer = await ethers.getContractFactory("TokenTransfer");
    const tokenTransfer = await TokenTransfer.deploy(
      "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66"
    );
    const address = await (await tokenTransfer.deployed()).address;
    console.log(address);
    const balanceBefore = await tokenTransfer.getContractBalance();
    console.log(balanceBefore);
    expect(balanceBefore).to.equal("0");

    // expect(await tokenTransfer.getContractBalance()).to.equal('TokenTransfer');
    // expect(await tokenTransfer.symbol()).to.equal('TT');
  });

  it("TokenTransfer Transfer USDT Test", async function () {
    const TokenTransfer = await ethers.getContractFactory("TokenTransfer");
    const tokenTransfer = await TokenTransfer.deploy(
      "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66"
    );
    const address = await (await tokenTransfer.deployed()).address;
    //before transfer into contract balance
    const balanceBeforeTransferIntoContract =
      await tokenTransfer.getContractBalance();
    console.log(
      "before transfer into contract balance:",
      balanceBeforeTransferIntoContract
    );
    expect(balanceBeforeTransferIntoContract).to.equal("0");

    const USDTContract = await ethers.getContractAt(
      "MacondoUSDT",
      "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66"
    );

    const [owner, addr1] = await ethers.getSigners();
    const signer = new ethers.Wallet(PRIVATE_KEY as string, owner.provider);

    //before transfer
    const balanceBefore = await USDTContract.balanceOf(signer.address);
    console.log("before transfer:", balanceBefore);
    const result = await USDTContract.connect(signer).transfer(
      tokenTransfer.address,
      "100"
    );
    result.wait();

    const balanceAfter = await USDTContract.balanceOf(signer.address);
    console.log("after transfer:", balanceAfter);
    expect(balanceBefore.sub(balanceAfter)).to.equal("100");

    //after transfer into contract balance
    const balanceAfterTransferIntoContract =
      await tokenTransfer.getContractBalance();
    console.log(
      "after transfer into contract balance:",
      balanceAfterTransferIntoContract
    );
    expect(balanceAfterTransferIntoContract).to.equal("100");
  });
});
