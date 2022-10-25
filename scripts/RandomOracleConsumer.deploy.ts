import { ethers } from 'hardhat';
import { deployNormal as deployer } from './utils/deploy.util';
const { PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER } = process.env;

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

async function main() {
  const subscriptionId = 1592;
  const m_vrfCoordinator = '0x6a2aad07396b36fe02a22b33cf443582f682c82f';
  const m_keyHash =
    '0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314';

  const contract = await deployer(
    'RandomOracleConsumer',
    subscriptionId,
    m_vrfCoordinator,
    m_keyHash
  );
  const newOwnerAddress = ethers.utils.computeAddress(
    PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER as string
  );
  console.log('RandomOracleConsumer new Owner Address', newOwnerAddress);
  await contract.transferOwnership(newOwnerAddress);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
