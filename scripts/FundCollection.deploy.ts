// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import hre, { upgrades } from "hardhat";
import { deployUpgradeProxy, deployUpgradeUpdate } from "./utils/deploy.util";

async function firstDeploy() {
  // We get the contract to deploy
  const DeployContractName = "FundCollection";
  const DeployContract = await hre.ethers.getContractFactory(
    DeployContractName
  );
  const deployContract = await upgrades.deployProxy(DeployContract);

  await deployContract.deployed();

  console.log("%s deployed to: %s", DeployContractName, deployContract.address);
  return deployContract.address;
}

async function main() {
  const contractAddress = null;
  //   const contractAddress = "0x33E7FB51160499a6D009BD504E25cc827BfB5e28";
  if (contractAddress) {
    await deployUpgradeUpdate("FundCollection", contractAddress);
  } else {
    await deployUpgradeProxy("FundCollection");
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
