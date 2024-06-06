require("dotenv").config();
const { Web3 } = require("web3");
const hre = require("hardhat");
const fs = require("fs");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const ABI_JSON_PATH = process.env.ABI_JSON_PATH;
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

const web3Provider = new Web3.providers.HttpProvider(hre.network.config.url);
const web3 = new Web3(web3Provider);
const contractABI = JSON.parse(fs.readFileSync(ABI_JSON_PATH)).abi;

const KMSToken = new web3.eth.Contract(contractABI, TOKEN_ADDRESS);

async function main() {
  try {
    const account = await web3.eth.accounts.privateKeyToAccount(
      OWNER_PRIVATE_KEY
    ).address;
    // await mint(account, 1);
    await getBalance(account);
  } catch (error) {
    console.error("Error in script execution:", error);
    process.exit(1);
  }
}

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

main().catch((error) => {
  console.error("Error in script execution:", error);
  process.exit(1);
});
