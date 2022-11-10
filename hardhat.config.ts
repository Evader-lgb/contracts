import '@nomiclabs/hardhat-waffle';
import 'dotenv/config';
import { task } from 'hardhat/config';

import '@openzeppelin/hardhat-defender';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-abi-exporter';

const { ALCHEMY_API_TESTNET_URL, PRIVATE_KEY, HARDHAT_BLOCKNUMBER } =
  process.env;
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
//url: 'https://bsc-testnet.blockvision.org/v1/2EVSmLkqat2srLsqOUSjPcYbjpH',
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.9',

  networks: {
    bsc_testnet: {
      url: 'https://macondo:macondo@apis.ankr.com/dc6b7aacd5264d7da2a720924d7f43d4/076fde4bad3f062d326ccc9dab7c7a38/binance/full/test',
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    bsc_local: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      gasPrice: 20000000000,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    mumbai: {
      url: ALCHEMY_API_TESTNET_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
  mocha: {
    timeout: 2 * 60 * 1000,
  },
  abiExporter: {
    except: [
      'contracts/sample',
      'contracts/tests',
      'contracts/labs',
      'contracts/core',
    ],
  },
  defender: {
    apiKey: process.env.CONTRACT_DEPLOYER_DEFENDER_TEAM_API_KEY,
    apiSecret: process.env.CONTRACT_DEPLOYER_DEFENDER_API_SECRET_KEY,
  },
};
