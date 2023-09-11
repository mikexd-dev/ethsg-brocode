require('dotenv').config()

const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKey = process.env.PRIVATE_KEY;
const mnemonic = process.env.MNEMONIC;

module.exports = {
  networks: {
    development: {
      provider: () =>
        new HDWalletProvider(privateKey, `http://127.0.0.1:8545`),
      network_id: "*", // Any network (default: none)
    },
    mainnet: {
      provider: () => new HDWalletProvider(privateKey, `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMYAPI_KEY}`),
      network_id: 1,
      gas: 3000000,
      gasPrice: 100000000000,
      confirmations: 0,   // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,  // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: true
    },
    rinkeby: {
      provider: () => new HDWalletProvider(privateKey, `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMYAPI_KEY}`),
      network_id: 4,
      gas: 8000000,
      gasPrice: 20000000000,
      confirmations: 0,   // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,  // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: true
    },
    sepolia: {
      provider: () => new HDWalletProvider(privateKey, `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMYAPI_KEY}`),
      network_id: 11155111,
      gas: 1500000,
      gasPrice: 2500000011,
      confirmations: 0,   // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50,  // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: true
    },
    polytest: {
      provider: () => new HDWalletProvider(privateKey, `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMYAPI_KEY}`),
      network_id: "80001",
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
    },
    avalanchetest: {
      provider: () => new HDWalletProvider(privateKey, `https://api.avax-test.network/ext/bc/C/rpc`),
      network_id: 43113,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
      gasPrice: 225000000000,
    },
    avalancheProd: {
      provider: () => new HDWalletProvider(privateKey, `https://api.avax.network/ext/bc/C/rpc`),
      network_id: 43114,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
      gasPrice: 225000000000,
    },
    bsctest: {
      provider: () => new HDWalletProvider(privateKey, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
      gasPrice: 20000000000,
    },
    lineatest: {
      provider: () => new HDWalletProvider(privateKey, `https://linea-goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 59140,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
      gasPrice: 20000000000,
    },
    lineaprod: {
      provider: () => new HDWalletProvider(privateKey, `https://linea-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`),
      network_id: 59144,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
      gasPrice: 20000000000,
    },
    polymainnet: {
      provider: () => new HDWalletProvider(privateKey, `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMYAPI_KEY}`),
      network_id: 137,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false,
      gas: 3000000,
      gasPrice: 250000000000
    },
    polyzktest: {
      provider: () => new HDWalletProvider(privateKey, `https://polygonzkevm-testnet.g.alchemy.com/v2/a6tzP5-uI3Oigg_czM3MS-jOZheEqMJh`),
      network_id: 1442,
      confirmations: 0, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 50, // # of blocks before a deployment times out  (minimum/default: 50)
      websockets: false
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.19", // Fetch exact version from solc-bin (default: truffle's version)
      docker: false, // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: "",
      },
    },
  },
  plugins: ["truffle-plugin-verify"],
  api_keys: {
    bscscan: process.env.BSCSCAN_API,
    etherscan: process.env.ETHERSCAN_API,
    polygonscan: process.env.POLYSCAN_API,
    snowtrace: process.env.AVALANCHE_API,
    zkevm_polygonscan: process.env.POLYSCAN_ZK_API,
  },
};