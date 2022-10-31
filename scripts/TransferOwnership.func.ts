import { upgrades } from 'hardhat';

const { CONTRACT_DEPLOYER_gnosisSafe } = process.env;
// scripts/transfer-ownership.js
async function main() {
  const gnosisSafe = CONTRACT_DEPLOYER_gnosisSafe as string;

  console.log('Transferring ownership of ProxyAdmin...');
  // The owner of the ProxyAdmin can upgrade our contracts
  await upgrades.admin.transferProxyAdminOwnership(gnosisSafe);
  console.log('Transferred ownership of ProxyAdmin to:', gnosisSafe);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
