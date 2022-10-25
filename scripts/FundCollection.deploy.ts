// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { deployUpgradeProxy, deployUpgradeUpdate } from './utils/deploy.util';

async function main() {
  // const contractAddress = null;
  const contractAddress = '0x0608F91AD2016Cf80749AE14f5E825a47fef8899';
  if (contractAddress) {
    await deployUpgradeUpdate('FundCollection', contractAddress);
  } else {
    await deployUpgradeProxy('FundCollection');
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
