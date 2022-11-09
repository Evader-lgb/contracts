import { ContractDeployAddress } from '../../consts/deploy.address.const';
import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';

//已经部署和合约地址
export const deployedContractAddress = ContractDeployAddress.MacondoUSDT;

async function main() {
  const contractAddress = deployedContractAddress;

  const DeployContractName = 'MacondoUSDT';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );
  } else {
    const contract = await deployUpgradeProxy(DeployContractName);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
