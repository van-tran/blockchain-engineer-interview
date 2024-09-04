require("@nomicfoundation/hardhat-toolbox");
require('hardhat-exposed');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  exposed: {
    exclude: ['Excluded.sol'],
    initializers: true,
  },
};


