require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// const PRIVATE_KEY_0 = process.env.PRIVATE_KEY_0;

/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
module.exports = {
	solidity: "0.8.0",
	network: {
		localhost: {
			url: "http://127.0.0.1:8545",
			// account: PRIVATE_KEY_0,
		},
	},
};
