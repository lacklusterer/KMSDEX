const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = require("hardhat");

let Token, token, TokenExchange, exchange, owner, addr1, addr2;
let token_reserves, eth_reserves;
let bigTokenReserves, bigETHReserves;

const multiplier = ethers.BigNumber.from(10 ** 5);
const swap_fee_numerator = ethers.BigNumber.from(3);
const swap_fee_denominator = ethers.BigNumber.from(100);

describe("TokenExchange", function () {
	// beforeEach resets the network, deploys contracts, creates liquidity pool
	beforeEach(async function () {
		await hre.network.provider.request({
			method: "hardhat_reset",
			params: [],
		});

		[owner, addr1, addr2] = await hre.ethers.getSigners();

		// Deploy the Token contract
		Token = await hre.ethers.getContractFactory("Token");
		token = await Token.deploy();

		// Deploy the TokenExchange contract
		TokenExchange = await hre.ethers.getContractFactory("TokenExchange");
		exchange = await TokenExchange.deploy();

		// Mint tokens to the owner
		token_reserves = ethers.utils.parseUnits("5000", 18);
		await token.mint(token_reserves);

		// Approve the exchange contract to spend owner's tokens
		await token.approve(exchange.address, token_reserves);

		// Create the liquidity pool
		eth_reserves = ethers.utils.parseUnits("5000", "ether");
		await exchange.createPool(token_reserves, { value: eth_reserves });

		// Mapped to BigNumber for calculations
		[bigETHReserves, bigTokenReserves] = [eth_reserves, token_reserves].map(
			ethers.BigNumber.from
		);
		// printLiquidity(exchange);
	});

	describe("Liquidity functionalities", function () {
		describe("Normal", function () {
			it("Should create liquidity pool with correct reserves", async function () {
				const [currentTokenReserves, currentETHReserves] =
					await exchange.getReserves();
				expect(currentTokenReserves).to.equal(token_reserves);
				expect(currentETHReserves).to.equal(eth_reserves);
				expect(currentTokenReserves).to.equal(
					await token.balanceOf(exchange.address)
				);
				expect(currentETHReserves).to.equal(
					await hre.ethers.provider.getBalance(exchange.address)
				);
			});

			it("Should add the correct amount of liquidity", async function () {
				const ethAmount = ethers.utils.parseEther("1.5");
				const tokenAmount = ethToToken(
					ethAmount,
					bigETHReserves,
					bigTokenReserves
				);
				await token.mint(tokenAmount);
				await token.approve(exchange.address, tokenAmount);
				await exchange.addLiquidity({ value: ethAmount });

				expect(bigTokenReserves.add(tokenAmount)).to.equal(
					await token.balanceOf(exchange.address)
				);

				const ethrAfter = bigETHReserves.add(ethAmount);
				expect(ethrAfter).to.equal(
					await hre.ethers.provider.getBalance(exchange.address)
				);
			});

			it("Should remove the correct amount of liquidity", async function () {
				// TODO: Implement this
			});

			it("Should allow removal of all liquidity", async function () {
				// TODO: Implement this
			});
		});

		describe("Specials", function () {
			it("Should revert if trying to create a liquidity pool with insufficient resource.", async function () {
				// TODO: Implement this
			});

			it("Should revert if not enough asset to add", async function () {
				// TODO:Implement this
			});

			it("Should revert if trying to remove more liquidity shares", async function () {
				// TODO: Implement this
			});
		});
	});

	describe("Swap Tokens for ETH", function () {
		describe("Normal", function () {
			it("Should swap tokens for ETH with correct exchange rate", async function () {
				const tokenAmount = ethers.utils.parseUnits("1", 18);

				await giveTokens(addr1, tokenAmount);

				const max_slippage = ethers.BigNumber.from(
					ethers.utils.parseUnits("0.1", 3)
				);
				// Max slippage = 1%

				const balanceBeforeTrade = await hre.ethers.provider.getBalance(
					addr1.address
				);
				const tx = await exchange
					.connect(addr1)
					.swapTokensForETH(tokenAmount, max_slippage);

				const receipt = await tx.wait();
				const gasUsed = receipt.gasUsed;
				const gasPrice = tx.gasPrice;
				const gasFee = gasUsed.mul(gasPrice);
				// console.log("Gas fee: " + ethers.utils.formatEther(gasFee));

				const expectedETH = getAmountOut(
					bigTokenReserves,
					bigETHReserves,
					tokenAmount
				);
				// console.log("Expected ETH: " + ethers.utils.formatEther(expectedETH));
				//
				const balanceAfterTrade = await hre.ethers.provider.getBalance(
					addr1.address
				);

				// console.log(
				// 	"Balance before trade: " + ethers.utils.formatEther(balanceBeforeTrade)
				// );
				// console.log(
				// 	"Balance after trade: " + ethers.utils.formatEther(balanceAfterTrade)
				// );
				expect(balanceBeforeTrade.sub(gasFee).add(expectedETH)).to.equal(
					balanceAfterTrade
				);
			});

			it("Should revert if slippage too large", async function () {
				const tokenAmount = ethers.utils.parseUnits("1", 18);

				await giveTokens(addr1, tokenAmount);

				const ethAmount = getAmountOut(
					bigTokenReserves,
					bigETHReserves,
					tokenAmount
				);
				const slippage = calculateSlippage(
					bigTokenReserves,
					bigETHReserves,
					tokenAmount,
					ethAmount
				);

				const max_slippage = ethers.BigNumber.from(
					ethers.utils.parseUnits("0.038", 3)
				);

				const tx = exchange
					.connect(addr1)
					.swapTokensForETH(tokenAmount, max_slippage);

				await expect(slippage).to.be.greaterThan(max_slippage);
				await expect(tx).to.be.revertedWith("Slippage too large");
			});

			it("Should revert if don't have enough tokens", async function () {
				const tokenAmount = ethers.utils.parseUnits("1", 18);

				const max_slippage = ethers.BigNumber.from(
					ethers.utils.parseUnits("2", 23)
				);

				const tx = exchange
					.connect(addr1)
					.swapTokensForETH(tokenAmount, max_slippage);

				await expect(tx).to.be.revertedWith("Not enough tokens");
			});
		});

		describe("Special", function () {
			it("Should reject if max_slippage is negative", async function () {
				const tokenAmount = ethers.utils.parseUnits("1", 18);

				await giveTokens(addr1, tokenAmount);

				const max_slippage = ethers.BigNumber.from(
					ethers.utils.parseUnits("-1", 23)
				);

				await expect(
					exchange.connect(addr1).swapTokensForETH(tokenAmount, max_slippage)
				).to.be.rejectedWith(Error);
			});

			it("Should revert if not enough ETH in pool to pay", async function () {
				// TODO: Implement this
			});
		});
	});
	describe("Swap ETH for tokens", function () {
		describe("Normal", function () {
			it("Should swap ETH for tokens with correct exchange rate", async function () {
				const ethIn = ethers.utils.parseUnits("1", 18);
				const max_slippage = ethers.BigNumber.from(
					ethers.utils.parseUnits("2", 23)
				);

				const tokensBeforeTrade = await token.balanceOf(addr1.address);

				const tx = await exchange
					.connect(addr1)
					.swapETHForTokens(max_slippage, { value: ethIn });

				const tokensAfterTrade = await token.balanceOf(addr1.address);
				// console.log(
				// 	"Balance after swap: " + ethers.utils.formatUnits(tokensAfterTrade, 18)
				// );

				const expectedAmountTokens = getAmountOut(
					bigETHReserves,
					bigTokenReserves,
					ethIn
				);
				// console.log(
				// 	"Expected tokens to receive: " +
				// 		ethers.utils.formatUnits(expectedAmountTokens, 18)
				// );

				expect(tokensAfterTrade).to.equals(expectedAmountTokens);
			});

			it("Should revert if amount ETH sent is 0", async function () {
				await expect(
					exchange.connect(addr1).swapETHForTokens(0, { value: 0 })
				).to.be.revertedWith("Please swap more than 0 ETH");
			});

			it("Should revert if slippage too large", async function () {
				const ethIn = ethers.utils.parseUnits("1", 18);
				const max_slippage = ethers.BigNumber.from(
					ethers.utils.parseUnits("0.038", 3)
				);

				const numerator = multiplier.mul(ethIn.add(bigETHReserves));
				const denominator = bigTokenReserves;
				const exchange_rate = numerator.div(denominator);

				await expect(
					exchange.connect(addr1).swapETHForTokens(max_slippage, {
						value: ethIn,
					})
				).to.be.revertedWith("Slippage too large");
			});
		});

		describe("Special", function () {
			it("Should revert if not enough ETH in pool to pay", async function () {
				// TODO: Implement this
			});
		});
	});
});

/*---------------------- Helper functions ----------------------*/
async function giveTokens(addr, amount) {
	await token.mint(amount);
	await token.approve(addr.address, amount);
	await token.transfer(addr.address, amount);
	await token.connect(addr).approve(exchange.address, amount);
}

function getAmountOut(reserveIn, reserveOut, amountIn) {
	return swap_fee_denominator
		.sub(swap_fee_numerator)
		.mul(amountIn)
		.mul(reserveOut)
		.div(reserveIn.add(amountIn).mul(swap_fee_denominator));
}

async function getLiquidity(exchange) {
	const [currentTokenReserves, currentETHReserves] =
		await exchange.getReserves();
	return [currentTokenReserves, currentETHReserves];
}

async function sendETH(from, to, amount) {
	console.log(`Sending ${amount} ETH...`);
	const sendingValue = ethers.utils.parseEther(amount);
	const gasLimit = 200000;
	const gasPrice = ethers.utils.parseUnits("20", "gwei");
	const tx = await from.sendTransaction({
		to: to.address,
		value: sendingValue,
		gasLimit: gasLimit,
		gasPrice: gasPrice,
	});
	return tx;
}

function calculateSlippage(_reserveIn, _reserveOut, _amountIn, _amountOut) {
	const currentRate = _reserveIn.mul(multiplier).div(_reserveOut);

	const afterTradeRate = _reserveIn
		.add(_amountIn)
		.mul(multiplier)
		.div(_reserveOut.sub(_amountOut));

	const slippage = afterTradeRate
		.sub(currentRate)
		.mul(multiplier)
		.div(currentRate);
	//
	// console.log(
	// 	"Trade's slippage is " + ethers.utils.formatUnits(slippage, "3") + "%"
	// );
	// console.log("Raw slippage: " + slippage);
	// console.log(ethers.utils.parseUnits("0.039", 3));
	//
	return slippage;
}

function ethToToken(_amountETH, er, tr) {
	return _amountETH.mul(tr.div(er));
}
