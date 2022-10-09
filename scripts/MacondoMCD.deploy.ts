// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { deployUpgradeProxy, deployUpgradeUpdate } from './utils/deploy.util';

async function main() {
  const DeployContractName = 'MacondoMCD';

  // const contractAddress = null;
  const contractAddress = '0xbEa921D1a3625487BED6073cb981cc06f56Ed454';
  if (contractAddress) {
    await deployUpgradeUpdate(DeployContractName, contractAddress);
  } else {
    await deployUpgradeProxy(DeployContractName);
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
