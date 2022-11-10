import { ethers } from 'hardhat';
import { ContractDeployAddress } from '../../consts/deploy.address.const';
import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';

// import { deployedContractAddress as NFTDeployedContractAddress } from './MacondoPokerPass.deploy';

const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;
//已经部署和合约地址
// export const deployedContractAddress = null;
export const deployedContractAddress =
  ContractDeployAddress.MacondoPokerPassMinterBlindBox;

async function main() {
  const contractAddressOfMacondoPokerPass =
    ContractDeployAddress.MacondoPokerPass;

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
