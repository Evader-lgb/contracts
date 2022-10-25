// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { ethers } from 'hardhat';
import { deployUpgradeProxy, deployUpgradeUpdate } from './utils/deploy.util';
const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;

async function main() {
  // const contractAddress = null;
  const contractAddress = '0x8023cCfaF67a34628e6e3093B3557E6184782289';
  const DeployContractName = 'TokenCollection';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );
  } else {
    const contract = await deployUpgradeProxy(DeployContractName);

    const withdrawAddress = CONTRACT_DEFAULT_CALLER_ADDRESS;
    console.log('TokenCollection withdraw Address', withdrawAddress);

    await contract.grantRole(ethers.utils.id('WITHDRAW'), withdrawAddress);
    await contract.grantRole(
      ethers.utils.id('WITHDRAW_ERC20'),
      withdrawAddress
    );
    await contract.grantRole(
      ethers.utils.id('WITHDRAW_ERC721'),
      withdrawAddress
    );
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
