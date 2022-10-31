import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';
const {
  CONTRACT_DEFAULT_CALLER_ADDRESS,
  PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER,
} = process.env;

//已经部署和合约地址
export const deployedContractAddress =
  '0xc26AcBB08E7c30375748ad0D4462fD140d9BCDBc';

async function main() {
  const contractAddress = deployedContractAddress;

  const DeployContractName = 'MacondoPokerPass';
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
