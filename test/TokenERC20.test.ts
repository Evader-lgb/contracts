import { expect } from 'chai';
import 'dotenv/config';
import { BigNumber, ethers } from 'ethers';

// 2.指定合约的Json文件
const contractABI = require('../third_party_abi/TokenERC20.json');
// 3.指定合约的合约地址
const contractAddress = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
// 4.指定合约调用地址和默认调用私钥
const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;

describe('ERC20 Token Test', function () {
  it('Polygon USDT Balance Test', async function () {
    const provider = new ethers.providers.JsonRpcProvider(
      ALCHEMY_API_MAINNET_URL
    );
    const signer = new ethers.Wallet(PRIVATE_KEY as string, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    //get polygon usdt balance
    const balance: BigNumber = await contract.balanceOf(signer.address);
    expect(balance).to.instanceOf(BigNumber);
    console.log(balance);
  });
});
