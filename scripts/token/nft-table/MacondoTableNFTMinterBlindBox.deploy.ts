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
  const contractAddressOfMacondoTableNFT =
    '0x1A516d0E324575Fd6BdD2E54FB9cFcB6C8F3e7A4';

  // const contractAddress = null;
  //old nft contract address
  const preContractAddress = null;
  const contractAddress = '0x55Cc50499747951d9fDD66D9867c00b8EbFA5d66';

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

    console.log('grant sale role to caller', CONTRACT_DEFAULT_CALLER_ADDRESS);
    //grant sale role to caller
    await contract
      .grantRole(ethers.utils.id('SALE_ROLE'), CONTRACT_DEFAULT_CALLER_ADDRESS)
      .then(async (tx: any) => await tx.wait());
    //grant sale manage role to nft contract
    await contract
      .grantRole(
        ethers.utils.id('SALE_MANAGE_ROLE'),
        CONTRACT_DEFAULT_CALLER_ADDRESS
      )
      .then(async (tx: any) => await tx.wait());

    await contract
      .grantRole(
        ethers.utils.id('PAUSER_ROLE'),
        CONTRACT_DEFAULT_CALLER_ADDRESS
      )
      .then(async (tx: any) => await tx.wait());

    //grant minter role to nft contract
    const contractOfMacondoTableNFT = await ethers.getContractAt(
      'MacondoTableNFT',
      contractAddressOfMacondoTableNFT
    );

    console.log('revoke minter role from old nft contract');
    //revoke minter role from old nft contract
    if (preContractAddress) {
      await contractOfMacondoTableNFT
        .revokeRole(ethers.utils.id('MINTER_ROLE'), preContractAddress)
        .then(async (tx: any) => await tx.wait());
    }
    console.log('grant minter role to nft contract');
    await contractOfMacondoTableNFT
      .grantRole(ethers.utils.id('MINTER_ROLE'), contract.address)
      .then(async (tx: any) => await tx.wait());
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
