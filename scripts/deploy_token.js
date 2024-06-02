const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const TokenContract = await hre.ethers.getContractFactory("Token");
  const tokenContract = await TokenContract.deploy();
  await tokenContract.deployed();

  const envFilePath = "./.env";
  const newAddress = `TOKEN_ADDRESS=${tokenContract.address}`;

  try {
    // Read the existing .env file
    let envContent = fs.readFileSync(envFilePath, "utf8");

    // Update the TOKEN_ADDRESS value
    const updatedEnvContent = envContent.replace(
      /TOKEN_ADDRESS=.*/g,
      newAddress
    );

    // Write the updated content back to the .env file
    fs.writeFileSync(envFilePath, updatedEnvContent);

    console.log(
      `Successfully wrote token address ${tokenContract.address} to ${envFilePath}`
    );
  } catch (error) {
    console.log(`Failed to write to file`);
    console.log(`Manually input token address: ${tokenContract.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
