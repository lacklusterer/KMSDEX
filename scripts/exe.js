require("dotenv").config();
const { Web3 } = require("web3");
const hre = require("hardhat");
const fs = require("fs");
// const { time } = require("@nomicfoundation/hardhat-network-helpers");

const token_address = process.env.TOKEN_ADDRESS;
const exchange_address = process.env.EXCHANGE_ADDRESS;
const pkey = process.env.PRIVATE_KEY;

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
		await getReserve();
		// End
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

async function getBalance(account) {
	const balance = await KMSToken.methods.balanceOf(account).call();
	console.log(`The balance of account ${account} is ${balance} tokens.`);
	return balance;
}

async function getReserve() {
	const [ethReserve, tokenReserve] = await KMSToken.methods.getReserve().call();
	console.log(
		`The ETH reserve is ${ethReserve} and the token reserve is ${tokenReserve}`
	);
}

async function callZkWithdraw(zkKey) {
	try {
		const account = web3.eth.accounts.privateKeyToAccount(pkey).address;

		// Read the proof from the JSON file
		const proofData = JSON.parse(fs.readFileSync("../zk_app/proof.json"));
		const { proof, inputs } = proofData;

		const txData = KMSExchange.methods
			.zkWithdraw(
				{
					a: proof.a,
					b: proof.b,
					c: proof.c,
				},
				inputs,
				zkKey
			)
			.encodeABI();

		const tx = {
			from: account,
			to: exchange_address,
			gas: 2000000, // Adjust the gas limit as needed
			data: txData,
		};

		const signedTx = await web3.eth.accounts.signTransaction(tx, pkey);
		const receipt = await web3.eth.sendSignedTransaction(
			signedTx.rawTransaction
		);
		console.log(
			"zkWithdraw Transaction successful with hash:",
			receipt.transactionHash
		);
	} catch (error) {
		console.error("Error in zkWithdraw execution:", error);
		throw error;
	}
}

main().catch((error) => {
	console.error("Error in script execution:", error);
	process.exit(1);
});
