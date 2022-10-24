// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
import { ethers } from 'hardhat';
import {
  deployUpgradeProxy,
  deployUpgradeUpdate,
} from '../../utils/deploy.util';
const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;

async function main() {
  // const contractAddress = null;
  //old nft contract address
  const contractAddress = '0x17C3481F45E47966Cd29c7fE573f78B377baEf6d';

  const contractAddressOfMacondoTableNFT =
    '0x1A516d0E324575Fd6BdD2E54FB9cFcB6C8F3e7A4';

  const DeployContractName = 'MacondoTableNFTMinterBlindBox';
  if (contractAddress) {
    const contract = await deployUpgradeUpdate(
      DeployContractName,
      contractAddress
    );
  } else {
    const contract = await deployUpgradeProxy(DeployContractName, [
      contractAddressOfMacondoTableNFT,
    ]);

    console.log('grant sale role to caller', CONTRACT_DEFAULT_CALLER_ADDRESS);
    //grant sale role to caller
    await contract.grantRole(
      ethers.utils.id('SALE_ROLE'),
      CONTRACT_DEFAULT_CALLER_ADDRESS
    );
    console.log('done');

    //grant minter role to nft contract
    const contractOfMacondoTableNFT = await ethers.getContractAt(
      'MacondoTableNFT',
      contractAddressOfMacondoTableNFT
    );

    console.log('grant minter role to nft contract');
    await contractOfMacondoTableNFT.grantRole(
      ethers.utils.id('MINTER_ROLE'),
      contract.address
    );
    console.log('done');
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
