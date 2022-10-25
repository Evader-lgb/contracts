import { ethers } from 'hardhat';

const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;

async function getContract() {
  const contract = await ethers.getContractAt(
    'MacondoTableNFTMinterBlindBox',
    '0x114dB974ADC69747F49bc9516429BA6ab332eCEB'
  );
  const [owner] = await ethers.getSigners();

  return contract.connect(owner);
}

async function setSaleConfig() {
  const contract = await getContract();

  await contract.setInitialTokenId(110010);
  const tx = await contract.setSaleConfig(
    '1',
    ethers.utils.parseEther('0.05'),
    Math.floor(new Date().getTime() / 1000) - 20 * 60,
    Math.floor(new Date().getTime() / 1000) + 10 * 24 * 60 * 60,
    '10'
  );
  await tx.wait();

  const saleConfig = await contract.defaultConfig();
  const totalSupply = await contract.totalSupply();
  const leftCount = await contract.getLeftSaleCount();
  const currentTokenId = await contract.currentTokenId();

  console.log('saleConfig', saleConfig);
  console.log('totalSupply', totalSupply.toString());
  console.log('leftCount', leftCount.toString());
  console.log('currentTokenId', currentTokenId.toString());
}

async function saleOne() {
  const contract = await getContract();

  const tx = await contract.sale({ value: ethers.utils.parseEther('0.05') });
  await tx.wait();

  const saleConfig = await contract.defaultConfig();
  const totalSupply = await contract.totalSupply();
  const leftCount = await contract.getLeftSaleCount();
  const currentTokenId = await contract.currentTokenId();

  console.log('saleConfig', saleConfig);
  console.log('totalSupply', totalSupply.toString());
  console.log('leftCount', leftCount.toString());
  console.log('currentTokenId', currentTokenId.toString());
}

async function grantRole() {
  const contract = await getContract();
  const tx = await contract.grantRole(
    ethers.utils.id('PAUSER_ROLE'),
    CONTRACT_DEFAULT_CALLER_ADDRESS
  );
  await tx.wait();
  console.log('grant pauser role to caller', CONTRACT_DEFAULT_CALLER_ADDRESS);
}

async function main() {
  // await setSaleConfig();
  // await saleOne();

  await grantRole();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
