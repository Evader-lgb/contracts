import { Contract, Wallet } from "ethers";
import { ethers } from "hardhat";
// 3.指定合约的合约地址

const ERC20ABI = require("../../third_party_abi/TokenERC20.json");

/**
 * 测试助手方法
 */
export class ERC20TokenUtil {
  /**
   * Token Normal
   * @param erc20Address
   * @param signer
   * @returns
   */
  static createERC20(erc20Address: string, signer?: Wallet): Contract {
    return new ethers.Contract(erc20Address, ERC20ABI, signer);
  }
  /**
   * Token Link on Polygon Testnet
   * @param signer
   * @returns
   */
  static createTokenLink(signer?: Wallet): Contract {
    return new ethers.Contract(
      "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
      ERC20ABI,
      signer
    );
  }

  /**
   * Token USDT on Polygon Testnet
   * @param signer
   * @returns
   */
  static createTokenUSDT(signer?: Wallet): Contract {
    return new ethers.Contract(
      "0x4Ea9C43e09A51ba39a31a29f2b7494F60C766E66",
      ERC20ABI,
      signer
    );
  }
}
