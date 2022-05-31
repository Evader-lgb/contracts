import { expect } from "chai";
import { ethers } from "hardhat";

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe("TokenTransfer", function () {
  it("TokenTransfer Test", async function () {
    const TokenTransfer = await ethers.getContractFactory("TokenTransfer");
    const tokenTransfer = await TokenTransfer.deploy(
      "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66"
    );
    const address = await (await tokenTransfer.deployed()).address;
    console.log(address);
    const balanceBefore = await tokenTransfer.getContractBalance();
    console.log("balanceBefore", balanceBefore);
    expect(balanceBefore).to.equal("0");

    const USDTContract = await ethers.getContractAt(
      "MacondoUSDT",
      "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66"
    );

    const [owner, addr1] = await ethers.getSigners();
    const signer = new ethers.Wallet(PRIVATE_KEY as string, owner.provider);
    const result = await USDTContract.connect(signer).approve(
      tokenTransfer.address,
      "1000000000000000000"
    );

    await expect(tokenTransfer.connect(signer).deposit("1000000000000000000"))
      .to.emit(tokenTransfer, "tokenChangedEvent")
      .withArgs("1000000000000000000");
    const balanceAfter = await tokenTransfer.getContractBalance();

    console.log("balanceAfter", balanceAfter);
    expect(balanceAfter).to.equal("1000000000000000000");

    // check counter
    const counter = await tokenTransfer.counter();
    console.log("counter", counter);
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

    //provider on transfer event
    const filter = {
      address: "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66",
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        ethers.utils.id("Transfer(address,address,uint256)"),
      ],
    };
    signer.provider.on(filter, (result) => {
      console.log("result", result);
    });

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
