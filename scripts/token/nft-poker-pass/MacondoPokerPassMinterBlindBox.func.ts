import { BigNumberish } from 'ethers';
import { ethers } from 'hardhat';
import { ContractDeployAddress } from '../../consts/deploy.address.const';

const { CONTRACT_DEFAULT_CALLER_ADDRESS } = process.env;

async function getContract() {
  const contract = await ethers.getContractAt(
    'MacondoPokerPassMinterBlindBox',
    ContractDeployAddress.MacondoPokerPassMinterBlindBox
  );
  const [owner] = await ethers.getSigners();

  return contract.connect(owner);
}

async function setSaleConfig(
  initTokenId: BigNumberish,
  initTotalSupply: BigNumberish
) {
  const contract = await getContract();

  await contract.setInitialTokenId(initTokenId);
  const tx = await contract.setSaleConfig(
    '1',
    ethers.utils.parseEther('0.02'),
    Math.floor(new Date().getTime() / 1000) - 20 * 60,
    Math.floor(new Date().getTime() / 1000) + 10 * 24 * 60 * 60,
    initTotalSupply
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

async function getSaleConfig() {
  const contract = await getContract();

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

  const soldTokenId = await contract.currentTokenId();
  const [custom] = await ethers.getSigners();
  const tx = await contract
    .connect(custom)
    .sale({ value: ethers.utils.parseEther('0.02') });
  await tx.wait();

  const saleConfig = await contract.defaultConfig();
  const totalSupply = await contract.totalSupply();
  const leftCount = await contract.getLeftSaleCount();
  const currentTokenId = await contract.currentTokenId();

  console.log(
    `sold Success!custom Address: ${
      custom.address
    }, TokenId:${soldTokenId.toString()}`
  );
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

async function withdraw() {
  const contract = await getContract();
  const tx = await contract.withdraw();
  await tx.wait();
  console.log('withdraw success!');
}

async function main() {
  await setSaleConfig('11000010', '500');
  // await getSaleConfig();
  // await saleOne();
  // await withdraw();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
