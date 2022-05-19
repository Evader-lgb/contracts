# Macondo contracts

Update With npm

```shell
npm install --package-lock-only
```

## 合约自动化测试

Running Test Locally (Recommend)

```shell
npx hardhat test
```

Running Test On Polygon Testnet

```shell
npx hardhat test --network mumbai 
```

## 合约部署

### 部署合约到测试网络 or 正式网络

```shell
npx hardhat run --network mumbai scripts/HelloWorld-deploy.js  
```

### 记录合约部署后的地址

```shell
HelloWorld deployed to:0x3F0528D040f31ace17a0c733469145928b9C88a4 
```

记录其中的 `0x3F0528D040f31ace17a0c733469145928b9C88a4` 到任意你喜欢的地方,方便 `game-service-contract` 服务调用.

### 编译合约ABI

```shell
npx hardhat export-abi
```

生成合约到对应的目录结构

```bash
contracts/
├── abi/
│   └── contracts/
│       ├── Helloworld.sol/
│       │   └── Helloworld.json
│       └── OtherXXX.sol/
│           └── OtherXXX.json
└── ...
```

## Hardhat Tools Help

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

npx hardhat export-abi
```


