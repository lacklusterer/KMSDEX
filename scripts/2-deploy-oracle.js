const hre = require("hardhat");

let account, oracle;
const exchangeAddress = process.env.EXCHANGE_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	oracle = await deployContract("PriceOracle", exchangeAddress);
}

async function deployContract(contractName, arg) {
	const Contract = await hre.ethers.getContractFactory(contractName);
	console.log(`Deploying ${contractName} contract...`);
	const contract = await Contract.deploy(arg);
	await contract.deployed();
	console.log(`${contractName} deployed to: ` + contract.address);
	return contract;
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
