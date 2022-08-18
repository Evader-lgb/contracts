import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
const TokenERC20ContractABI = require('../third_party_abi/TokenERC20.json');
describe('FundCollection', function () {
  it('FundCollection:Deploy Test', async function () {
    const FundCollection = await ethers.getContractFactory('FundCollection');
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log('address', address);
  });
  it('FundCollection:Deploy InitCode', async function () {
    const FundCollection = await ethers.getContractFactory('FundCollection');
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;

    console.log('address', address);

    const TokenAddress = '0x5ebED46E2534084f61c1407782DEc04E1395eCc9';
    const fundCollectorMacondoUSDTByteCode =
      await fundCollection.getCreationByteCode(
        TokenAddress,
        '0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3'
      );
    console.log(
      'fundCollectorMacondoUSDTByteCode',
      fundCollectorMacondoUSDTByteCode
    );
    const fundCollectorMacondoUSDTInitCode = ethers.utils.keccak256(
      fundCollectorMacondoUSDTByteCode
    );

    console.log(
      'fundCollectorMacondoUSDTInitCode',
      fundCollectorMacondoUSDTInitCode
    );
  });

  it('FundCollection:Deploy Upgrade Test', async function () {
    const FundCollection = await ethers.getContractFactory('FundCollection');
    const fundCollection = await upgrades.deployProxy(FundCollection);
    const address = await (await fundCollection.deployed()).address;
    expect(ethers.utils.isAddress(address)).to.be.true;
    console.log('address', address);

    const FundCollectionV1 = await ethers.getContractFactory('FundCollection');
    const updatedFundCollectionV1 = await upgrades.upgradeProxy(
      address,
      FundCollectionV1
    );
    const updatedFundCollectionDeployV1 =
      await updatedFundCollectionV1.deployed();

    console.log(
      'updatedFundCollectionDeployV1',
      updatedFundCollectionDeployV1.address
    );

    expect(address).to.equal(updatedFundCollectionDeployV1.address);
  });

  /**
   * @dev Test FundCollection:deposit
   */
  it('FundCollection:createFundCollectionMacondoUSDT', async function () {
    const FundCollection = await ethers.getContractFactory('FundCollection');
    const fundCollection = await FundCollection.deploy();
    const address = await (await fundCollection.deployed()).address;

    console.log('address', address);
    const MacondoUSDT = await ethers.getContractFactory('MacondoUSDT');
    const macondoUSDT = await MacondoUSDT.deploy();
    const macondoUSDTDeploy = await macondoUSDT.deployed();
    const macondoUSDTAddress = macondoUSDTDeploy.address;
    console.log('macondoUSDTAddress', macondoUSDTAddress);

    //compute salt
    const salt = ethers.utils.id('12345');

    const fundCollectorMacondoUSDTByteCode =
      await fundCollection.getCreationByteCode(
        macondoUSDTAddress,
        '0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3'
      );
    const fundCollectorMacondoUSDTInitCode = ethers.utils.keccak256(
      fundCollectorMacondoUSDTByteCode
    );

    const computedAddress = ethers.utils.getCreate2Address(
      address,
      salt,
      fundCollectorMacondoUSDTInitCode
    );
    console.log('computedAddress', computedAddress);

    await expect(
      fundCollection.createFundCollection(
        fundCollectorMacondoUSDTByteCode,
        salt
      )
    )
      .to.emit(fundCollection, 'Deployed')
      .withArgs(computedAddress, salt);
  });

  /**
   * @dev Test FundCollection:collection MacondoUSDT
   */
  it('FundCollection:CollectionMacondoUSDT Use Case', async function () {
    const [owner, gasFeeAccount] = await ethers.getSigners();
    const FundCollection = await ethers.getContractFactory('FundCollection');
    const fundCollection = await upgrades.deployProxy(FundCollection);
    const fundCollectionAddress = await (
      await fundCollection.deployed()
    ).address;
    console.log('fundCollection address', fundCollectionAddress);

    const MacondoUSDT = await ethers.getContractFactory('MacondoUSDT');
    const macondoUSDT = await MacondoUSDT.deploy();
    const macondoUSDTDeploy = await macondoUSDT.deployed();
    const macondoUSDTAddress = macondoUSDTDeploy.address;
    console.log('macondoUSDTAddress', macondoUSDTAddress);

    const fundCollectionBalance = await fundCollection.provider.getBalance(
      fundCollectionAddress
    );
    console.log('fundCollectionBalance', fundCollectionBalance);

    //compute salt
    const salt = ethers.utils.id('12345');

    const fundCollectorMacondoUSDTByteCode =
      await fundCollection.getCreationByteCode(
        macondoUSDTAddress,
        '0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3'
      );

    const fundCollectorMacondoUSDTInitCode = ethers.utils.keccak256(
      fundCollectorMacondoUSDTByteCode
    );

    const computeFundCollectorAddress = ethers.utils.getCreate2Address(
      fundCollectionAddress,
      salt,
      fundCollectorMacondoUSDTInitCode
    );
    console.log('computeFundCollectorAddress', computeFundCollectorAddress);

    const TokenAddress = macondoUSDTAddress;
    const hotWalletAddress = '0x52830f99820f80ED2513Cd0bdA155F96Cc8aAed3';
    //get TokenERC20 contract
    const TokenContract = new ethers.Contract(
      TokenAddress,
      TokenERC20ContractABI,
      fundCollection.provider
    );

    const hotWalletBalance = await TokenContract.balanceOf(hotWalletAddress);
    expect(hotWalletBalance).to.equal(0);
    console.log('hotWallet balance', hotWalletBalance);

    const usdtFaucet = new ethers.Wallet(
      PRIVATE_KEY as string,
      fundCollection.provider
    );
    //transfer 1000 token to usdFaucet
    await macondoUSDT.transfer(
      usdtFaucet.address,
      ethers.utils.parseEther('1000')
    );
    //transfer 1 eth to usdtFaucet
    await owner.sendTransaction({
      to: usdtFaucet.address,
      value: ethers.utils.parseEther('1'),
    });

    const computeAddressBalance = await TokenContract.balanceOf(
      computeFundCollectorAddress
    );
    expect(computeAddressBalance).to.equal(0);
    console.log('computed balance', computeAddressBalance);

    //开始归集资金
    //设置手续费账号

    console.log('gasFeeAccount address', gasFeeAccount.address);
    console.log('gasFeeAccount balance', await gasFeeAccount.getBalance());

    let totalCollectionUSDT = ethers.BigNumber.from(0);

    const collectionFundFunction = async () => {
      const tx = await TokenContract.connect(usdtFaucet).transfer(
        computeFundCollectorAddress,
        1000
      );
      await tx.wait();
      //检查 computeAddress 余额是否为1000
      const computeAddressBalanceBeforeCollect = await TokenContract.balanceOf(
        computeFundCollectorAddress
      );
      expect(computeAddressBalanceBeforeCollect).to.equal(1000);

      //开始归集资金
      const txCollection = await fundCollection
        .connect(gasFeeAccount)
        .createFundCollection(fundCollectorMacondoUSDTByteCode, salt);
      const txCollectionReceipt = await txCollection.wait();
      console.log('Collection gas used', txCollectionReceipt.gasUsed);

      //检查 computeAddress 余额是否为0
      const computeAddressBalanceAfterCollect = await TokenContract.balanceOf(
        computeFundCollectorAddress
      );
      expect(computeAddressBalanceAfterCollect).to.equal(0);
      totalCollectionUSDT = totalCollectionUSDT.add(1000);
    };

    await collectionFundFunction();
    await collectionFundFunction();
    await collectionFundFunction();
    await collectionFundFunction();
    await collectionFundFunction();

    //check hotWallet balance
    const hotWalletBalanceAfterCollect = await TokenContract.balanceOf(
      hotWalletAddress
    );
    expect(hotWalletBalanceAfterCollect).to.equal(totalCollectionUSDT);

    const receiveGasRefund = await fundCollection.provider.getBalance(
      hotWalletAddress
    );
    console.log('receive Gas Refund', receiveGasRefund);

    //check fundCollectionBalance after collection is zero
    const fundCollectionBalanceAfterCollect =
      await fundCollection.provider.getBalance(fundCollectionAddress);
    expect(fundCollectionBalanceAfterCollect).to.equal(0);
  });
});
