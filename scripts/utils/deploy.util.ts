import { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/dist/utils';
import { Contract, ContractFactory } from 'ethers';
import hre, { defender, ethers, upgrades } from 'hardhat';

/**
 *
 * @param DeployContractName
 * @param deployContract
 * @returns Contract
 */
async function _deploy(
  DeployContractName: string,
  deployContract: Contract
): Promise<Contract> {
  // We get the contract to deploy
  console.log('[deploy contract]:deploy [%s] start', DeployContractName);
  const [deployer] = await hre.ethers.getSigners();
  console.log('[deploy contract]:deployer address', deployer.address);
  const deployerBalance = await deployer.getBalance();
  console.log(
    '[deploy contract]:deployer balance before',
    hre.ethers.utils.formatEther(deployerBalance)
  );
  await deployContract.deployed();

  const deployerBalanceAfter = await deployer.getBalance();
  console.log(
    '[deploy contract]:deployer balance after',
    hre.ethers.utils.formatEther(deployerBalanceAfter)
  );
  console.log(
    '[deploy contract]:deploy gas fee',
    ethers.utils.formatEther(deployerBalance.sub(deployerBalanceAfter))
  );
  console.log(
    '[deploy contract]:deploy complete! contract: [%s] deployed to: %s',
    DeployContractName,
    deployContract.address
  );
  return deployContract;
}
/**
 * 部署普通合约(不可升级)
 * @param DeployContractName  contract name
 * @param args  contract args
 * @returns  Contract
 */
export async function deployNormal(
  DeployContractName: string,
  ...args: any[]
): Promise<Contract> {
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
export async function deployUpgradeProxy(
  contractName: string,
  args?: unknown[],
  opts?: DeployProxyOptions
): Promise<Contract> {
  const DeployContractName = contractName;
  const DeployContract = await hre.ethers.getContractFactory(
    DeployContractName
  );
  const deployContract = await upgrades.deployProxy(DeployContract, args, opts);
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
): Promise<Contract> {
  console.log('[deploy contract]:deploy [%s] upgrade ...', contractName);
  const DeployContractName = contractName;
  const DeployContract = await getContractFactory(DeployContractName);
  const deployContract = await upgrades.upgradeProxy(
    contractAddress,
    DeployContract
  );
  return _deploy(DeployContractName, deployContract);
}

/**
 * 更新可升级合约(通过 defender proposal)
 * @param contractName 合约名称
 * @param contractAddress  合约地址
 * @returns
 */
export async function deployUpgradeUpdateWithProposal(
  contractName: string,
  contractAddress: string
): Promise<void> {
  console.log('[deploy contract]:deploy [%s] upgrade ...', contractName);
  const Contract = await getContractFactory(contractName);
  console.log('Preparing proposal...');
  const proposal = await defender.proposeUpgrade(contractAddress, Contract);
  console.log('Upgrade proposal created at:', proposal.url);
}

export async function getContractFactory(
  contractName: string
): Promise<ContractFactory> {
  return hre.ethers.getContractFactory(contractName);
}
