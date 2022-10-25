// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { deployUpgradeProxy, deployUpgradeUpdate } from './utils/deploy.util';
const { PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER } = process.env;

async function main() {
  // const contractAddress = null;
  const contractAddress = '0xe3D01EdA7Fc4843bBE6aDd29450a3F648a6a46AE';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      'MacondoItemNFT',
      contractAddress
    );
  } else {
    const contract = await deployUpgradeProxy('MacondoItemNFT');
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
