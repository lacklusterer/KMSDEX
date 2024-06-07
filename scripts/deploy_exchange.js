const hre = require("hardhat");
const fs = require("fs");

async function main() {
	const ExchangeContract = await hre.ethers.getContractFactory("TokenExchange");
	const exchangeContract = await ExchangeContract.deploy();
	await exchangeContract.deployed();

	const envFilePath = ".env";
	const newAddress = `EXCHANGE_ADDRESS=${exchangeContract.address}`;

	try {
		// Read the existing .env file
		let envContent = fs.readFileSync(envFilePath, "utf8");

		// Update the EXCHANGE_ADDRESS value
		const updatedEnvContent = envContent.replace(
			/EXCHANGE_ADDRESS=.*/g,
			newAddress
		);

		// Write the updated content back to the .env file
		fs.writeFileSync(envFilePath, updatedEnvContent);

		console.log(
			`Successfully wrote exchange address ${exchangeContract.address} to ${envFilePath}`
		);
	} catch (error) {
		console.log(`Failed to write to file`);
		console.log(`Manually input exchange address: ${exchangeContract.address}`);
	}
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
