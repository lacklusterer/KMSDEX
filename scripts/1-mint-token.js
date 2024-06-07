require("dotenv").config();
const { Web3 } = require("web3");
const hre = require("hardhat");
const fs = require("fs");
// const { time } = require("@nomicfoundation/hardhat-network-helpers");

const token_address = process.env.TOKEN_ADDRESS;
const exchange_address = process.env.EXCHANGE_ADDRESS;
const pkey = process.env.OWNER_PRIVATE_KEY;

const web3Provider = new Web3.providers.HttpProvider(hre.network.config.url);
const web3 = new Web3(web3Provider);
const token_abi = JSON.parse(fs.readFileSync(process.env.TOKEN_ABI_PATH)).abi;
const exchange_abi = JSON.parse(
	fs.readFileSync(process.env.EXCHANGE_ABI_PATH)
).abi;

const KMSToken = new web3.eth.Contract(token_abi, token_address);
const KMSExchange = new web3.eth.Contract(exchange_abi, exchange_address);

async function main() {
	try {
		const account = await web3.eth.accounts.privateKeyToAccount(pkey).address;
		// NOTE: Call functions here
		await mint(account, 1000000000000);
		// NOTE: End
	} catch (error) {
		console.error("Error in script execution:", error);
		process.exit(1);
	}
}

// NOTE: Functions
async function mint(owner, amount) {
	console.log(`Minting ${amount} tokens`);
	await KMSToken.methods.mint(amount).send({ from: owner });
	console.log("Done");
}

main().catch((error) => {
	console.error("Error in script execution:", error);
	process.exit(1);
});
