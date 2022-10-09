// We require the Hardhat Runtime Environment explicitly here. This is optional

import { deployUpgradeProxy, deployUpgradeUpdate } from './utils/deploy.util';

async function main() {
  // We get the contract to deploy
  const DeployContractName = 'MacondoBFB';

  // const contractAddress = null;
  const contractAddress = '0x142FDB4C5B01486f4526744668aEDf574ab045DB';
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
