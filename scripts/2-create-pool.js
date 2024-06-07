require("dotenv").config();
const { Web3 } = require("web3");
const hre = require("hardhat");
const fs = require("fs");

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

const createPool = async (amountTokens, ethAmount) => {
	const account = web3.eth.accounts.privateKeyToAccount(pkey);
	web3.eth.accounts.wallet.add(account);
	web3.eth.defaultAccount = account.address;

	const data = KMSExchange.methods.createPool(amountTokens).encodeABI();

	const tx = {
		from: account.address,
		to: exchange_address,
		gas: await KMSExchange.methods
			.createPool(amountTokens)
			.estimateGas({ from: account.address, value: ethAmount }),
		data: data,
		value: ethAmount, // Amount of ETH to send with the transaction
	};

	const signedTx = await web3.eth.accounts.signTransaction(tx, pkey);

	web3.eth
		.sendSignedTransaction(signedTx.rawTransaction)
		.on("receipt", (receipt) => {
			console.log("Transaction successful with hash:", receipt.transactionHash);
		})
		.on("error", (error) => {
			console.error("Error sending transaction:", error);
		});
};

const amountTokens = web3.utils.toWei("5000", "ether"); // Amount of tokens to send
const ethAmount = web3.utils.toWei("5000", "ether"); // Amount of ETH to send

await createPool(amountTokens, ethAmount);
