require("@nomicfoundation/hardhat-toolbox");
require('hardhat-exposed');
require('dotenv').config(); // Add this line



/**
 * This is a hardhat task to print the list of accounts on the local
 * avalanche chain
 *
 * Prints out an array of Hex addresses
 */
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners()
  accounts.forEach((account) => {
    console.log(account.address)
  })
})

/**
 * This is a hardhat task to print the list of accounts on the local
 * avalanche chain as well as their balances
 *
 * Prints out an array of strings containing the address Hex and balance in Wei
 */
task(
    'balances',
    'Prints the list of AVAX account balances',
    async (args, hre) => {
      const accounts = await hre.ethers.getSigners()
      for (const account of accounts) {
        const balance = await hre.ethers.provider.getBalance(account.address)
        console.log(`${account.address} has balance ${balance.toString()}`)
      }
    }
)


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  exposed: {
    exclude: ['Excluded.sol'],
    initializers: true,
  },
  networks: {
    local: {
      url: 'http://127.0.0.1:9650/ext/bc/LIFEnetwork/rpc',
      chainId: 9999,
      gasPrice: 225000000000,
      accounts: process.env.PRIVATE_KEYS.split(',')
    }
  }
};
