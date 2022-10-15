// We recommend this pattern to be able to use async/await everywhere

import { deployNormal } from '../utils/deploy.util';

async function main() {
  let labLootTokenAddress = '0x3f79f74FEeFBcD8B4E3AD1F1300016afc810dbfb';
  if (!labLootTokenAddress) {
    const labLootTokenResource = await deployNormal('LabLootTokenResource');
    labLootTokenAddress = labLootTokenResource.address;
  }

  await deployNormal('LabLootToken', labLootTokenAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
