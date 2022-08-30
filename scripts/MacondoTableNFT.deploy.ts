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
  const contractAddress = '0x8706b341A1678a1a7A2971C995CABB761752c9DB';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      'MacondoTableNFT',
      contractAddress
    );

    // const newOwnerAddress = ethers.utils.computeAddress(
    //   PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER as string
    // );
    // const tx = await contract.transferOwnership(newOwnerAddress);
    // await tx.wait();
  } else {
    const contract = await deployUpgradeProxy('MacondoTableNFT');

    // const newOwnerAddress = ethers.utils.computeAddress(
    // PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER as string
    // );
    // const tx = await contract.transferOwnership(newOwnerAddress);
    // await tx.wait();
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
