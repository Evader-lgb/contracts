import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

const { ALCHEMY_API_MAINNET_URL, PRIVATE_KEY } = process.env;
describe('TokenTransfer', function () {
  let macondoUSDT: Contract;
  let macondoUSDTAddress: string;
  beforeEach(async function () {
    const MacondoUSDT = await ethers.getContractFactory('MacondoUSDT');
    macondoUSDT = await MacondoUSDT.deploy();
    const macondoUSDTDeploy = await macondoUSDT.deployed();
    macondoUSDTAddress = macondoUSDTDeploy.address;
  });

  it('TokenTransfer Test', async function () {
    const TokenTransfer = await ethers.getContractFactory('TokenTransfer');
    const tokenTransfer = await TokenTransfer.deploy(macondoUSDTAddress);
    const address = await (await tokenTransfer.deployed()).address;
    console.log(`address: ${address}`);
    const balanceBefore = await tokenTransfer.getContractBalance();
    expect(balanceBefore).to.equal('0');

    const USDTContract = await ethers.getContractAt(
      'MacondoUSDT',
      macondoUSDTAddress
    );

    const [owner, addr1] = await ethers.getSigners();
    const signer = new ethers.Wallet(PRIVATE_KEY as string, owner.provider);
    //transfer signer gas fee
    await owner.sendTransaction({
      to: signer.address,
      value: ethers.utils.parseEther('5'),
    });
    //transfer signer 5 usdt
    await macondoUSDT.transfer(signer.address, ethers.utils.parseEther('5'));

    await USDTContract.connect(signer).approve(
      tokenTransfer.address,
      ethers.utils.parseEther('1')
    );

    await expect(
      tokenTransfer.connect(signer).deposit(ethers.utils.parseEther('1'))
    )
      .to.emit(tokenTransfer, 'tokenChangedEvent')
      .withArgs(ethers.utils.parseEther('1'));
    const balanceAfter = await tokenTransfer.getContractBalance();

    console.log('balanceAfter', balanceAfter);
    expect(balanceAfter).to.equal(ethers.utils.parseEther('1'));

    // check counter
    const counter = await tokenTransfer.counter();
    console.log('counter', counter);
  });

  it('TokenTransfer Transfer USDT Test', async function () {
    const TokenTransfer = await ethers.getContractFactory('TokenTransfer');
    const tokenTransfer = await TokenTransfer.deploy(macondoUSDTAddress);
    const address = await (await tokenTransfer.deployed()).address;
    //before transfer into contract balance
    const balanceBeforeTransferIntoContract =
      await tokenTransfer.getContractBalance();
    console.log(
      'before transfer into contract balance:',
      balanceBeforeTransferIntoContract
    );
    expect(balanceBeforeTransferIntoContract).to.equal('0');

    const USDTContract = await ethers.getContractAt(
      'MacondoUSDT',
      macondoUSDTAddress
    );

    const [owner, addr1] = await ethers.getSigners();
    const signer = new ethers.Wallet(PRIVATE_KEY as string, owner.provider);
    //transfer signer gas fee
    await owner.sendTransaction({
      to: signer.address,
      value: ethers.utils.parseEther('5'),
    });
    //transfer signer 5 usdt
    await macondoUSDT.transfer(signer.address, ethers.utils.parseEther('5'));

    //provider on transfer event
    const filter = {
      address: macondoUSDTAddress,
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        ethers.utils.id('Transfer(address,address,uint256)'),
      ],
    };
    signer.provider.on(filter, (result) => {
      console.log('result', result);
    });

    //before transfer
    const balanceBefore = await USDTContract.balanceOf(signer.address);
    console.log('before transfer:', balanceBefore);
    const result = await USDTContract.connect(signer).transfer(
      tokenTransfer.address,
      '100'
    );
    result.wait();

    const balanceAfter = await USDTContract.balanceOf(signer.address);
    console.log('after transfer:', balanceAfter);

    //after transfer into contract balance
    const balanceAfterTransferIntoContract =
      await tokenTransfer.getContractBalance();
    console.log(
      'after transfer into contract balance:',
      balanceAfterTransferIntoContract
    );
    expect(balanceAfterTransferIntoContract).to.equal('100');
  });
});
