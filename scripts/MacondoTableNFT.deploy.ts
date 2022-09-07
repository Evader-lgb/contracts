// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { ethers } from 'ethers';
import { deployUpgradeProxy, deployUpgradeUpdate } from './utils/deploy.util';
const {
  BSC_CONTRACT_MacondoTableNFTOwnerAddress,
  PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER,
} = process.env;

async function main() {
  // const contractAddress = null;
  const contractAddress = '0x07DDD08CC777D15ABDf796DfE7924494d97ec9fC';
  const DeployContractName = 'MacondoTableNFT';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );

    // const newOwnerAddress = ethers.utils.computeAddress(
    //   PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER as string
    // );
    // const tx = await contract.transferOwnership(newOwnerAddress);
    // await tx.wait();
  } else {
    const contract = await deployUpgradeProxy(DeployContractName);

    const newOwnerAddress = ethers.utils.computeAddress(
      PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER as string
    );
    console.log('MacondoTableNFT new Owner Address', newOwnerAddress);
    await contract.transferOwnership(newOwnerAddress);
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
