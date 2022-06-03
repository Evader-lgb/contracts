import { Contract } from "ethers";
import hre, { upgrades } from "hardhat";

async function _deploy(DeployContractName: string, deployContract: Contract) {
  // We get the contract to deploy
  console.log("[deploy contract]:deploy [%s] start", DeployContractName);
  const [deployer] = await hre.ethers.getSigners();
  console.log("[deploy contract]:deployer address", deployer.address);
  const deployerBalance = await deployer.getBalance();
  console.log(
    "[deploy contract]:deployer balance before",
    deployerBalance.toString()
  );
  await deployContract.deployed();

  const deployerBalanceAfter = await deployer.getBalance();
  console.log(
    "[deploy contract]:deployer balance after",
    deployerBalanceAfter.toString()
  );
  console.log(
    "[deploy contract]:deploy gas fee",
    deployerBalance.sub(deployerBalanceAfter).toString()
  );
  console.log(
    "[deploy contract]:deploy contract: [%s] complete! address %s",
    DeployContractName,
    deployContract.address
  );
  return deployContract.address;
}
/**
 * 部署普通合约(不可升级)
 * @param DeployContractName  contract name
 * @param args  contract args
 * @returns  contract address
 */
export async function deployNormal(DeployContractName: string, ...args: any[]) {
  const DeployContract = await hre.ethers.getContractFactory(
    DeployContractName
  );
  const deployContract = await DeployContract.deploy(...args);
  return _deploy(DeployContractName, deployContract);
}

/**
 * 部署可升级合约
 * @param contractName  合约名称
 * @returns  合约地址
 */
export async function deployUpgradeProxy(contractName: string) {
  const DeployContractName = contractName;
  const DeployContract = await hre.ethers.getContractFactory(
    DeployContractName
  );
  const deployContract = await upgrades.deployProxy(DeployContract);
  return _deploy(DeployContractName, deployContract);
}
/**
 * 更新可升级合约
 * @param contractName 合约名称
 * @param contractAddress  合约地址
 * @returns
 */
export async function deployUpgradeUpdate(
  contractName: string,
  contractAddress: string
) {
  const DeployContractName = contractName;
  const DeployContract = await hre.ethers.getContractFactory(
    DeployContractName
  );
  const deployContract = await upgrades.upgradeProxy(
    contractAddress,
    DeployContract
  );
  return _deploy(DeployContractName, deployContract);
}
