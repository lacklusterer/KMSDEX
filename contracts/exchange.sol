// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./token.sol";
import "hardhat/console.sol";

contract TokenExchange is Ownable {
	string public exchange_name = "KMS EX";

	address tokenAddr; // TODO: paste token contract address here
	Token public token = Token(tokenAddr);

	// Liquidity pool for the exchange
	uint private token_reserves = 0;
	uint private eth_reserves = 0;

	// Fee Pools
	uint private token_fee_reserves = 0;
	uint private eth_fee_reserves = 0;

	// Liquidity pool shares
	mapping(address => uint) private lps;

	// For Extra Credit only: to loop through the keys of the lps mapping
	address[] private lp_providers;

	// Total Pool Shares
	uint private total_shares = 0;

	// liquidity rewards
	uint private swap_fee_numerator = 3;
	uint private swap_fee_denominator = 100;

	// Constant: x * y = k
	uint private k;

	uint private multiplier = 10 ** 5;

	constructor() {}

	// Function createPool: Initializes a liquidity pool between your Token and ETH.
	// ETH will be sent to pool in this transaction as msg.value
	// amountTokens specifies the amount of tokens to transfer from the liquidity provider.
	// Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
	function createPool(uint amountTokens) external payable onlyOwner {
		// This function is already implemented for you; no changes needed.

		// require pool does not yet exist:
		require(token_reserves == 0, "Token reserves was not 0");
		require(eth_reserves == 0, "ETH reserves was not 0.");

		// require nonzero values were sent
		require(msg.value > 0, "Need eth to create pool.");
		uint tokenSupply = token.balanceOf(msg.sender);
		require(
			amountTokens <= tokenSupply,
			"Not have enough tokens to create the pool"
		);
		require(amountTokens > 0, "Need tokens to create pool.");

		token.transferFrom(msg.sender, address(this), amountTokens);
		token_reserves = token.balanceOf(address(this));
		eth_reserves = msg.value;
		k = token_reserves * eth_reserves;

		// Pool shares set to a large value to minimize round-off errors
		total_shares = 10 ** 5;
		// Pool creator has some low amount of shares to allow autograder to run
		lps[msg.sender] = 100;
	}

	// For use for ExtraCredit ONLY
	// Function removeLP: removes a liquidity provider from the list.
	// This function also removes the gap left over from simply running "delete".
	function removeLP(uint index) private {
		require(
			index < lp_providers.length,
			"specified index is larger than the number of lps"
		);
		lp_providers[index] = lp_providers[lp_providers.length - 1];
		lp_providers.pop();
	}

	// Function getSwapFee: Returns the current swap fee ratio to the client.
	function getSwapFee() public view returns (uint, uint) {
		return (swap_fee_numerator, swap_fee_denominator);
	}

	// Function getReserves
	function getReserves() public view returns (uint, uint) {
		return (eth_reserves, token_reserves);
	}

	function ethToToken(uint _amountETH) internal view returns (uint) {
		return (_amountETH * token_reserves) / eth_reserves;
	}

	/* ========================= Liquidity Provider Functions =========================  */

	function addLiquidity() external payable {
		// NOTE: rudiment function
		require(msg.value > 0, "Cannot add nothing to the pool :/");

		uint tokenSupply = token.balanceOf(msg.sender);
		uint tokenAmount = ethToToken(msg.value);

		require(tokenAmount <= tokenSupply, "Not enough token");

		token.transferFrom(msg.sender, address(this), tokenAmount);

		token_reserves += tokenAmount;
		eth_reserves += msg.value;
		k = eth_reserves * token_reserves;

		uint newShares = (msg.value * total_shares) / eth_reserves;
		lps[msg.sender] = newShares;
		total_shares += newShares;
	}

	// Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
	// You can change the inputs, or the scope of your function, as needed.
	function removeLiquidity(uint amountETH) public payable {
		// NOTE: rudiment

		uint sharesRemove = (amountETH / eth_reserves) * total_shares;

		require(sharesRemove < total_shares);
		require(sharesRemove <= lps[msg.sender]);

		uint amountToken = ethToToken(amountETH);

		eth_reserves -= amountETH;
		token_reserves -= amountToken;
		k = eth_reserves * token_reserves;

		token.transferFrom(address(this), msg.sender, amountToken);
		payable(msg.sender).transfer(amountETH);

		total_shares -= sharesRemove;
		lps[msg.sender] -= sharesRemove;
	}

	// Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
	// You can change the inputs, or the scope of your function, as needed.
	function removeAllLiquidity() external payable {
		uint ethAmount = eth_reserves * (lps[msg.sender] / total_shares);
		uint tokenAmount = ethToToken(ethAmount);

		payable(msg.sender).transfer(ethAmount);
		token.transferFrom(address(this), msg.sender, tokenAmount);

		total_shares -= lps[msg.sender];
		// TODO: remove this lp instead of setting shares to 0
		lps[msg.sender] = 0;
	}

	/***  Define additional functions for liquidity fees here as needed ***/

	/* ========================= Swap Functions =========================  */

	// Function swapTokensForETH: Swaps your token with ETH
	// You can change the inputs, or the scope of your function, as needed.
	function swapTokensForETH(uint amountTokens) external payable {
		/******* TODO: Implement this function *******/
	}

	// Function swapETHForTokens: Swaps ETH for your tokens
	// ETH is sent to contract as msg.value
	// You can change the inputs, or the scope of your function, as needed.
	function swapETHForTokens() external payable {
		/******* TODO: Implement this function *******/
	}
}
