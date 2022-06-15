import { ethers } from "hardhat";
import { deployNormal as deployer } from "./utils/deploy.util";
const { PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER } = process.env;

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

async function main() {
  const contract = await deployer(
    "RandomOracleConsumer",
    577,
    "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f"
  );
  const newOwnerAddress = ethers.utils.computeAddress(
    PRIVATE_KEY_RANDOM_CONSUMER_CONTRACT_CALLER as string
  );
  console.log("RandomOracleConsumer new Owner Address", newOwnerAddress);
  await contract.transferOwnership(newOwnerAddress);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
