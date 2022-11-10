// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { ethers } from 'hardhat';
import { ContractDeployAddress } from '../../consts/deploy.address.const';
import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';
const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;

async function main() {
  const contractAddressOfMacondoTableNFT =
    ContractDeployAddress.MacondoTableNFT;

  // const contractAddress = null;
  //old nft contract address
  const preContractAddress = null;
  const contractAddress = ContractDeployAddress.MacondoTableNFTMinterBlindBox;

  const DeployContractName = 'MacondoTableNFTMinterBlindBox';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );
  } else {
    const [deployer] = await ethers.getSigners();
    const contract = await deployUpgradeProxy(DeployContractName, [
      contractAddressOfMacondoTableNFT,
      deployer.address,
    ]);

    //grant minter role to nft contract
    const contractOfMacondoTableNFT = await ethers.getContractAt(
      'MacondoTableNFT',
      contractAddressOfMacondoTableNFT
    );
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
