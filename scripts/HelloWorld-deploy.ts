import { deployNormal } from "./utils/deploy.util";

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployNormal("HelloWorld", "Hello, Macondo!")
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
