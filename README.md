# Macondo contracts

## contract addresses

### mainnet bsc

coming soon!！

### bsc testnet

- `MacondoBFB`: `0x849Ac2eAF42C7239A1f807f250928Eac23376C63`
  - [bscscan](https://testnet.bscscan.com/address/0x849Ac2eAF42C7239A1f807f250928Eac23376C63)
- `MacondoMCD`: `0xC3a787C2B1AB52e18bA5387a13c5B6551A89f006`
  - [bscscan](https://testnet.bscscan.com/address/0xC3a787C2B1AB52e18bA5387a13c5B6551A89f006)
- `MacondoUSDT`:`0x97310efB7831A90d9C33e2ddC2E22dF6ef3e9dcA`
  - [bscscan](https://testnet.bscscan.com/address/0x97310efB7831A90d9C33e2ddC2E22dF6ef3e9dcA)
- `MacondoUSDTFaucet`: `0x83Ade0d3b2B198Ea9674A045D900f750aE568Be6`
  - [bscscan](https://testnet.bscscan.com/address/0x83Ade0d3b2B198Ea9674A045D900f750aE568Be6)
- `MacondoTableNFT`:`0x1A516d0E324575Fd6BdD2E54FB9cFcB6C8F3e7A4`
  - [bscscan](https://testnet.bscscan.com/address/0x1A516d0E324575Fd6BdD2E54FB9cFcB6C8F3e7A4)
- `MacondoTableNFTMinterBlindBox`:`0x3eae3657402FE9516093Ef6c7a3773c028BA5354`
  - [bscscan](https://testnet.bscscan.com/address/0x3eae3657402FE9516093Ef6c7a3773c028BA5354)
- `MacondoPokerPass`:`0xc26AcBB08E7c30375748ad0D4462fD140d9BCDBc`
  - [bscscan](https://testnet.bscscan.com/address/0xc26AcBB08E7c30375748ad0D4462fD140d9BCDBc)
- `MacondoPokerPassMinterBlindBox`:`0x6c2f1e09B427fe3486cC1dc447D02fdB72A16D76`
  - [bscscan](https://testnet.bscscan.com/address/0x6c2f1e09B427fe3486cC1dc447D02fdB72A16D76)
- `AccountBurn`:`0xA001e11eccae7926E68937A473C7a58DdE8B08F5`
  - [bscscan](https://testnet.bscscan.com/address/0xA001e11eccae7926E68937A473C7a58DdE8B08F5)
- `PokerValidator`:`0x3d7Ea2034ca2d25B71EF55380e309d7b5884b2d3`
  - [bscscan](https://testnet.bscscan.com/address/0x3d7Ea2034ca2d25B71EF55380e309d7b5884b2d3)
- `TokenCollection`:`0x8023cCfaF67a34628e6e3093B3557E6184782289`
  - [bscscan](https://testnet.bscscan.com/address/0x8023cCfaF67a34628e6e3093B3557E6184782289)
- `RandomOracleConsumer`:`0x27e69a1acd722A0aA02F4bf611Ea797bFC4Ba3Ee`
  - [bscscan](https://testnet.bscscan.com/address/0x27e69a1acd722A0aA02F4bf611Ea797bFC4Ba3Ee)

## how to develop and test

### Principle of development

#### TDD(Test-Driven Development)

The development process must strictly follow the principle of test-driven development, write test cases first, and then write the function implementation.

#### Code submission requires all test cases to pass

#### Incremental design

### Actual engineering development

#### Update With npm

```shell
git clone https://github.com/W3-Macondo/contracts.git
cd contracts
npm install --package-lock-only
```

The project structure is as follows

```shell
contracts/
├── contracts          --- Contract source code directory, mainly store *.sol contract files
│   ├── HelloWorld.sol
│   └── ...
├── scripts            --- js script directory, mainly store deployment scripts.
│   ├── HelloWorld-deploy.js
│   └── ...
├── test               --- Contract unit test directory
│   ├── HelloWorld-test.js
│   └── ...
├── hardhat.config.js  --- hardhat configuration file
├── package.json
├── .env               --- Environment variable file (need to be created manually)
└── ...
```

## - Automated testing

Running Test Locally (Recommend)

```shell
npx hardhat test
```

```shell
npx hardhat test --grep one
```

Running Test On Polygon Testnet

```shell
npx hardhat test --network mumbai
```

## Deployment

### Deploy contract to testnet or mainnet

```shell
npx hardhat run scripts/HelloWorld-deploy.ts --network mumbai
```

```shell
npx hardhat run --network bsc_testnet scripts/HelloWorld-deploy.ts
npx hardhat run --network bsc_testnet filePath
```

### Record the address of the contract after deployment

```shell
HelloWorld deployed to:0x3F0528D040f31ace17a0c733469145928b9C88a4
```

Record `0x3F0528D040f31ace17a0c733469145928b9C88a4` to any place you like, which is convenient for the `game-service-contract` service to call.

### Compile contract ABI

```shell
npm run compile
```

#### Generate contracts to the corresponding directory structure

````shell

```bash
contracts/
├── abi/
│   └── contracts/
│       ├── HelloWorld.sol/
│       │   ├── HelloWorld.json  ---abi description file
│       │   └── HelloWorld.ts    ---abi Typescript file
│       └── OtherXXX.sol/
│           ├── OtherXXX.json
│           └── OtherXXX.ts
└── ...
````

Copy the files in the `abi/` directory to the corresponding project for use

About the `abi/` directory, you can also use the `npm run compile` command to generate the `abi/` directory, and then copy the files in the `abi/` directory to the corresponding project for use.
