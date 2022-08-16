# Macondo contracts

## 如何进行开发

### 开发原则

#### TDD(测试驱动开发)

开发流程需要严格遵循测试驱动开发原则,先写测试用例,再写功能实现.

#### 代码提交,需要测试用例全部通过

#### 增量设计

### 实际工程开发

#### Update With npm

```shell
git clone https://github.com/W3-Macondo/contracts.git
cd contracts
npm install --package-lock-only
```

工程结构如下

```shell
contracts/
├── contracts          ---合约源代码目录，主要存放 *.sol  /
│   ├── HelloWorld.sol
│   └── ...
├── scripts            ---js脚本目录，主要存放部署脚本。/
│   ├── HelloWorld-deploy.js
│   └── ...
├── test               ---合约单元测试目录/
│   ├── HelloWorld-test.js
│   └── ...
├── hardhat.config.js  ---hardhat配置文件
├── package.json
├── .env               ---环境变量文件（需要自己手动建立）
└── ...
```

### env 文件说明

```env
#ALCHEMY API地址
ALCHEMY_API_URL=https://xxx/v2/xxx
#ALCHEMY DAPP Key
ALCHEMY_API_KEY="xxx"
#部署合约使用的私钥
PRIVATE_KEY="3xxx"
```

## 自动化测试

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

## 部署

### 部署合约到测试网络 or 正式网络

```shell
npx hardhat run scripts/HelloWorld-deploy.ts --network mumbai
```

### 记录合约部署后的地址

```shell
HelloWorld deployed to:0x3F0528D040f31ace17a0c733469145928b9C88a4
```

记录其中的 `0x3F0528D040f31ace17a0c733469145928b9C88a4` 到任意你喜欢的地方,方便 `game-service-contract` 服务调用.

### 编译合约 ABI

```shell
npm run compile
```

生成合约到对应的目录结构

```bash
contracts/
├── abi/
│   └── contracts/
│       ├── HelloWorld.sol/
│       │   ├── HelloWorld.json  ---abi 描述文件
│       │   └── HelloWorld.ts    ---abi Typescript文件
│       └── OtherXXX.sol/
│           ├── OtherXXX.json
│           └── OtherXXX.ts
└── ...
```

拷贝`abi/`目录下的文件到对应的工程里面使用

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
