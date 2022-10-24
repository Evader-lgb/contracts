import { ethers } from 'hardhat';

async function getContract() {
  const contract = await ethers.getContractAt(
    'MacondoTableNFTMinterBlindBox',
    '0x17C3481F45E47966Cd29c7fE573f78B377baEf6d'
  );
  const [owner] = await ethers.getSigners();

  return contract.connect(owner);
}

async function setSaleConfig() {
  const contract = await getContract();

  const tx = await contract.setSaleConfig(
    '1',
    ethers.utils.parseEther('0.05'),
    Math.floor(new Date().getTime() / 1000) - 20 * 60,
    Math.floor(new Date().getTime() / 1000) + 10 * 24 * 60 * 60,
    '10'
  );
  await tx.wait();

  await contract.setInitialTokenId(110000);

  const saleConfig = await contract.defaultConfig();
  const saleLimit = await contract.saleLimit();
  const leftCount = await contract.getLeftSaleCount();
  const currentTokenId = await contract.currentTokenId();

  console.log('saleConfig', saleConfig);
  console.log('saleLimit', saleLimit.toString());
  console.log('leftCount', leftCount.toString());
  console.log('currentTokenId', currentTokenId.toString());
}

async function saleOne() {
  const contract = await getContract();

  const tx = await contract.sale({ value: ethers.utils.parseEther('0.05') });
  await tx.wait();

  const saleConfig = await contract.defaultConfig();
  const saleLimit = await contract.saleLimit();
  const leftCount = await contract.getLeftSaleCount();
  const currentTokenId = await contract.currentTokenId();

  console.log('saleConfig', saleConfig);
  console.log('saleLimit', saleLimit.toString());
  console.log('leftCount', leftCount.toString());
  console.log('currentTokenId', currentTokenId.toString());
}

async function main() {
  await saleOne();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
