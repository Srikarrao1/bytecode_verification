require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      { 
        version: "0.8.27", 
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Local Hardhat node
    },
    gtc: {
      url: process.env.RPC_URL, // Correct URL format
      accounts: process.env.PVT_KEY ? [process.env.PVT_KEY] : [], // Read private key from environment
    },
  },
  paths: {
    artifacts: './artifacts',
    sources: './contracts',
    cache: './cache',
    tests: './test',
  },
};