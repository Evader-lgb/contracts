import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe('MacondoTableNFTFreeMintWithSign', function () {
  let macondoTableNFT: Contract;
  let contract: Contract;

  beforeEach(async function () {
    const MacondoTableNFT = await ethers.getContractFactory('MacondoTableNFT');
    macondoTableNFT = await upgrades.deployProxy(MacondoTableNFT);
    await macondoTableNFT.deployed();

    const MacondoTableNFTFreeMintWithSign = await ethers.getContractFactory(
      'MacondoTableNFTFreeMintWithSign'
    );

    contract = await upgrades.deployProxy(MacondoTableNFTFreeMintWithSign, [
      macondoTableNFT.address,
    ]);
    await contract.deployed();

    //grant role : MINTER_ROLE
    await macondoTableNFT.grantRole(
      await macondoTableNFT.MINTER_ROLE(),
      contract.address
    );
  });

  it('MacondoTableNFTFreeMintWithSign:Deploy Test', async function () {
    const address = contract.address;
    expect(ethers.utils.isAddress(address)).to.be.any;
  });

  describe('MacondoTableNFTFreeMintWithSign:Free Mint Test', function () {
    it('should success', async function () {
      const address = contract.address;
      expect(ethers.utils.isAddress(address)).to.be.any;

      const [owner, addr1, addr2, addr3] = await ethers.getSigners();

      const to = addr1.address;
      const tokenId = 1;
      const uri = 'abc';

      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [to, tokenId]
      );

      const contractMessageHash = await contract.getMessageHash(to, tokenId);
      expect(messageHash).to.equal(contractMessageHash);

      const messageBytes = ethers.utils.arrayify(messageHash);
      const signature = await owner.signMessage(messageBytes);

      const recover = await contract.recoverSigner(messageHash, signature);
      expect(recover.toString()).to.equal(owner.address);

      await expect(contract.freeMint(to, tokenId, uri, signature))
        .emit(contract, 'FreeMint')
        .withArgs(to, tokenId);

      const ownerOf = await macondoTableNFT.ownerOf(tokenId);
      expect(ownerOf).to.equal(to);
    });

    it('should fail: wrong signature', async function () {
      const address = contract.address;
      expect(ethers.utils.isAddress(address)).to.be.any;

      const [owner, addr1, addr2, addr3] = await ethers.getSigners();

      const to = addr1.address;
      const tokenId = 1;
      const uri = 'abc';

      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [to, tokenId]
      );

      const contractMessageHash = await contract.getMessageHash(to, tokenId);
      expect(messageHash).to.equal(contractMessageHash);

      const messageBytes = ethers.utils.arrayify(messageHash);
      const signature = await addr2.signMessage(messageBytes);

      await expect(
        contract.freeMint(to, tokenId, uri, signature)
      ).to.be.revertedWith(
        'ErrorSigner("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC")'
      );
    });

    it('should fail: already minted', async function () {
      const address = contract.address;
      expect(ethers.utils.isAddress(address)).to.be.any;

      const [owner, addr1, addr2, addr3] = await ethers.getSigners();

      const to = addr1.address;
      const tokenId = 1;
      const uri = 'abc';

      const messageHash = ethers.utils.solidityKeccak256(
        ['address', 'uint256'],
        [to, tokenId]
      );

      const contractMessageHash = await contract.getMessageHash(to, tokenId);
      expect(messageHash).to.equal(contractMessageHash);

      const messageBytes = ethers.utils.arrayify(messageHash);
      const signature = await owner.signMessage(messageBytes);

      await expect(contract.freeMint(to, tokenId, uri, signature))
        .emit(contract, 'FreeMint')
        .withArgs(to, tokenId);

      await expect(
        contract.freeMint(to, tokenId, uri, signature)
      ).to.be.revertedWith(
        'ErrorSignatureUsed("0xb564785a3911c37f4343f13d4a3baa3bb67654749c138c117531748a128f9b142be7a92a610aeab09500dee3c63a532c9d41650397066c4c3b13a4a1bab2285d1b")'
      );
    });
  });
});
