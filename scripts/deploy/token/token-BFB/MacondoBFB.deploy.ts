// We require the Hardhat Runtime Environment explicitly here. This is optional

import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';

export const contractAddress = '0x849Ac2eAF42C7239A1f807f250928Eac23376C63';

async function main() {
  // We get the contract to deploy
  const DeployContractName = 'MacondoBFB';

  const contractAddress = null;
  // const contractAddress = '0x849Ac2eAF42C7239A1f807f250928Eac23376C63';
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
