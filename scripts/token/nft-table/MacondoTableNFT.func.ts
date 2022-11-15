import { ethers } from 'hardhat';

async function main() {
  const contract = await ethers.getContractAt(
    'MacondoTableNFT',
    '0x1A516d0E324575Fd6BdD2E54FB9cFcB6C8F3e7A4'
  );

  //grant minter role to caller
  await contract.grantRole(
    ethers.utils.id('MINTER_ROLE'),
    '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  );

  console.log('done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
