import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe('SampleOGAllowList', () => {
  let contract: Contract;
  let macondoNFT: Contract;

  beforeEach(async () => {
    const MacondoNFT = await ethers.getContractFactory('MacondoTableNFT');
    macondoNFT = await upgrades.deployProxy(MacondoNFT);
    await macondoNFT.deployed();

    const SampleOGAllowList = await ethers.getContractFactory(
      'SampleOGAllowList'
    );
    contract = await SampleOGAllowList.deploy(macondoNFT.address);
    await contract.deployed();
  });

  it('should preSale', async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const uri =
      'https://ipfs.filebase.io/ipfs/QmeNbXJvrXS8MwSV6zMoQQFey46dM4WqDR5NLnC5Qi24GU';

    //send og to addr1
    await macondoNFT.safeMint(addr1.address, uri);

    await expect(contract.preSale()).to.revertedWith('OG Allow List: Not OG');
    await contract.connect(addr1).preSale();

    await contract.balanceOf(addr1.address).then((balance: string) => {
      expect(balance).to.equal('1');
    });

    await expect(contract.connect(addr1).preSale()).to.revertedWith(
      'Address has already been used.'
    );
  });
});
