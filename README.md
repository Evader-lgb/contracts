# Macondo contracts

Update With npm

```shell
npm install --package-lock-only
```

Deploy Polygon Testnet

```shell
npx hardhat run --network mumbai scripts/deploy-Greeter.js  
```

Running Test

```shell
npx hardhat test
```

Running Test On Polygon Testnet

```shell
npx hardhat test --network mumbai 
```

# Hardhat Tools Help

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```


