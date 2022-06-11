import { deployNormal as deployer } from "./utils/deploy.util";

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployer(
  "RandomOracleConsumer",
  577,
  "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
  "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
