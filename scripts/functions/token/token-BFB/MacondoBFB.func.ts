import { ethers } from 'hardhat';
import { contractAddress } from '../../../deploy/token/token-BFB/MacondoBFB.deploy';
const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;

async function getContract() {
  const contract = await ethers.getContractAt('MacondoBFB', contractAddress);
  const [owner] = await ethers.getSigners();

  return contract.connect(owner);
}

async function grantRole() {
  const contract = await getContract();

  //grant minter role to default caller
  await contract
    .grantRole(ethers.utils.id('MINTER_ROLE'), CONTRACT_DEFAULT_CALLER_ADDRESS)
    .then(async (tx: any) => await tx.wait());
  console.log('done');
}

async function showGrantRole() {
  const contract = await getContract();
  const role = await contract.hasRole(
    ethers.utils.id('MINTER_ROLE'),
    CONTRACT_DEFAULT_CALLER_ADDRESS
  );
  console.log('role', role);
}

async function main() {
  await showGrantRole();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
