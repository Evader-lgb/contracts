const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contract HelloWorld", function () {
    it("测试HelloWorld", async function () {

        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const helloworld = await HelloWorld.deploy("I'm tester!");
        await helloworld.deployed();

        expect(await helloworld.sayHello()).to.equal("HelloWorld!");

        expect(await helloworld.saySomething()).to.equal("I'm tester!");

        const setSaySomethingTx = await helloworld.setSaySomething("i'm a new guy!");

        //wait until the transaction is mined
        await setSaySomethingTx.wait();

        expect(await helloworld.saySomething()).to.equal("i'm a new guy!");

    })
})