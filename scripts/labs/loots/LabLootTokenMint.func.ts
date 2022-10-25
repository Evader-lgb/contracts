import { ethers } from 'hardhat';

async function mint() {
  const contract = await ethers.getContractAt(
    'LabLootToken',
    '0xF90DdAEf7801faE75412CBaFdf844e78ea911402'
  );

  const tokenId = 2;
  const [owner] = await ethers.getSigners();
  console.log('owner', owner.address);
  const tx = await contract.connect(owner).claim(tokenId);
  await tx.wait();

  const tokenURI = await contract.tokenURI(tokenId);
  console.log(tokenURI);

  console.log('done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
