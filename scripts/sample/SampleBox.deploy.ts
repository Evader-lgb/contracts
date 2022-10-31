// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

import { deployUpgradeProxy, deployUpgradeUpdate } from '../utils/deploy.util';

const { CONTRACT_DEFAULT_CALLER_ADDRESS, CONTRACT_DEPLOYER_gnosisSafe } =
  process.env;

async function main() {
  let deployedContractAddress = null;
  //如果已经部署了合约,记录在这里
  deployedContractAddress = '0x61906b37C0614C63CDA65b46Afe7081d16b30CE6';

  const contractAddress = deployedContractAddress;

  const DeployContractName = 'SampleBox';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );
  } else {
    const contract = await deployUpgradeProxy(DeployContractName, [42], {
      initializer: 'store',
    });
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
