import '@nomiclabs/hardhat-waffle';
import 'dotenv/config';
import { task } from 'hardhat/config';

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

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4',

  networks: {
    bsc_testnet: {
      url: 'https://bsc-testnet.blockvision.org/v1/2EVSmLkqat2srLsqOUSjPcYbjpH',
      chainId: 97,
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
    except: ['sample', 'tests', 'labs'],
  },
};
