import { expect } from "chai";
import { ethers } from "hardhat";

describe("MacondoUSDT", function () {
  it("MacondoUSDT Test", async function () {
    const MacondoUSDT = await ethers.getContractFactory("MacondoUSDT");
    const macondoUSDT = await MacondoUSDT.deploy();
    await macondoUSDT.deployed();

    expect(await macondoUSDT.name()).to.equal("Macondo-USDT");
    expect(await macondoUSDT.symbol()).to.equal("USDT");
  });
});
