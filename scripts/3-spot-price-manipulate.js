const hre = require("hardhat");

let account, exchange, token;

const exchangeaccess = process.env.EXCHANGE_ADDRESS;
const tokenaccess = process.env.TOKEN_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[account, account2] = await hre.ethers.getSigners();

	const exchangeFactory = await hre.ethers.getContractFactory("TokenExchange");
	exchange = exchangeFactory.attach(exchangeaccess);
	const tokenFactory = await hre.ethers.getContractFactory("Token");
	token = tokenFactory.attach(tokenaccess);

	const tokenAmount = ethers.utils.parseUnits("100000", 18);

	await giveTokens(account2, tokenAmount);

	const max_slippage = ethers.BigNumber.from(ethers.utils.parseUnits("2", 23));

	console.log("Big swap...");
	const tx = await exchange
		.connect(account2)
		.swapTokensForETH(tokenAmount, max_slippage);
}

async function giveTokens(acc, amount) {
	await token.mint(amount);
	await token.approve(acc.address, amount);
	await token.transfer(acc.address, amount);
	await token.connect(acc).approve(exchange.address, amount);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
