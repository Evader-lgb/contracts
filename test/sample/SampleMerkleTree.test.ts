import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import MerkleTree from 'merkletreejs';
describe('SampleMerkleTree', () => {
  let contract: Contract;

  it('should verify', async () => {
    const SampleMerkleTree = await ethers.getContractFactory(
      'SampleMerkleTree'
    );

    //build merkle tree
    const leaves = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) =>
      ethers.utils.toUtf8Bytes(x)
    );
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, {
      hashLeaves: true,
      sortPairs: true,
    });

    const root = tree.getHexRoot();
    //获取叶子节点的Hash
    const leaf = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('a'));
    const proof = tree.getHexProof(leaf);

    console.log(tree.toString());
    expect(tree.verify(proof, leaf, root)).to.equal(true);

    contract = await SampleMerkleTree.deploy(root);
    await contract.deployed();
    console.log(`root: ${root}, \nleaf: ${leaf}, \nproof: ${proof}`);
    expect(await contract.verify(proof, leaf)).to.equal(true);
  });
});
