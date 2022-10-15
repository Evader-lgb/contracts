// We recommend this pattern to be able to use async/await everywhere

import { deployNormal } from '../utils/deploy.util';

// and properly handle errors.
deployNormal('LabLootToken')
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
