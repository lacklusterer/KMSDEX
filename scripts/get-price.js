const hre = require("hardhat");

let account, oracle;

const oracleAddress = process.env.ORACLE_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	const oracleFactory = await hre.ethers.getContractFactory("PriceOracle");
	oracle = oracleFactory.attach(oracleAddress);

	const price = await oracle.getPrice();

	console.log("Current price: ", ethers.formatUnits(price, 5), " what");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
