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
  console.log(
    "[deploy contract]:%s upgrade to: %s",
    DeployContractName,
    deployContract.address
  );

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
    "[deploy contract]:deploy contract: [%s] complete",
    DeployContractName
  );
  return deployContract.address;
}
/**
 * 部署普通合约
 * @param contractName  合约名称
 * @returns  合约地址
 */
export async function deployUpgradeProxy(contractName: string) {
  const DeployContractName = contractName;
  const DeployContract = await hre.ethers.getContractFactory(
    DeployContractName
  );
  const deployContract = await upgrades.deployProxy(DeployContract);
  
  console.log("[deploy contract]:deploy [%s] start", DeployContractName);
  const [deployer] = await hre.ethers.getSigners();
  console.log("[deploy contract]:deployer address", deployer.address);
  const deployerBalance = await deployer.getBalance();
  console.log(
    "[deploy contract]:deployer balance before",
    deployerBalance.toString()
  );
  await deployContract.deployed();
  console.log(
    "[deploy contract]:%s upgrade to: %s",
    DeployContractName,
    deployContract.address
  );

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
    "[deploy contract]:deploy contract: [%s] complete",
    DeployContractName
  );
  return deployContract.address;
}
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
