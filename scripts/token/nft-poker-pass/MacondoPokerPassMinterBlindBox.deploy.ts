import { ethers } from 'hardhat';
import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';

// import { deployedContractAddress as NFTDeployedContractAddress } from './MacondoPokerPass.deploy';

const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;
//已经部署和合约地址
// export const deployedContractAddress = null;
export const deployedContractAddress =
  '0x5a8E09b7c7c55650fDc893009289B27677625d60';

async function main() {
  const contractAddressOfMacondoPokerPass =
    '0xc26AcBB08E7c30375748ad0D4462fD140d9BCDBc';

  const preContractAddress = null;
  const contractAddress = deployedContractAddress;

  const DeployContractName = 'MacondoPokerPassMinterBlindBox';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );
  } else {
    const [deployer] = await ethers.getSigners();
    const contract = await deployUpgradeProxy(DeployContractName, [
      contractAddressOfMacondoPokerPass,
      deployer.address,
    ]);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
