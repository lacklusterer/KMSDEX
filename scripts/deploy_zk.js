const hre = require("hardhat");
const fs = require("fs");

async function main() {
	const VerifierContract = await hre.ethers.getContractFactory("Verifier");
	const verifierContract = await VerifierContract.deploy();
	await verifierContract.deployed();

	const envFilePath = ".env";
	const newAddress = `VERIFIER_ADDRESS=${verifierContract.address}`;

	try {
		// Read the existing .env file
		let envContent = fs.readFileSync(envFilePath, "utf8");

		// Update the verifier_ADDRESS value
		const updatedEnvContent = envContent.replace(
			/VERIFIER_ADDRESS=.*/g,
			newAddress
		);

		// Write the updated content back to the .env file
		fs.writeFileSync(envFilePath, updatedEnvContent);

		console.log(
			`Successfully wrote verifier address ${verifierContract.address} to ${envFilePath}`
		);
	} catch (error) {
		console.log(`Failed to write to file`);
		console.log(`Manually input verifier address: ${verifierContract.address}`);
	}
}

main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
