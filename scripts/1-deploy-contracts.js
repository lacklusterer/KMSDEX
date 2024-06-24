const hre = require("hardhat");

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	// Deploy the Token contract
	const Token = await hre.ethers.getContractFactory("Token");
	const token = await Token.deploy();

	// Deploy the TokenExchange contract
	const TokenExchange = await hre.ethers.getContractFactory("TokenExchange");
	const exchange = await TokenExchange.deploy();

	// Mint tokens to the owner
	token_reserves = ethers.utils.parseUnits("5000", 18);
	await token.mint(token_reserves);

	// Approve the exchange contract to spend owner's tokens
	await token.approve(exchange.address, token_reserves);

	// Create the liquidity pool
	eth_reserves = ethers.utils.parseUnits("5000", "ether");
	await exchange.createPool(token_reserves, { value: eth_reserves });
	const [currentTokenReserves, currentETHReserves] =
		await exchange.getReserves();

	console.log("Current ETH Reserves: " + currentETHReserves);
	console.log("Current Token Reserves: " + currentTokenReserves);
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
