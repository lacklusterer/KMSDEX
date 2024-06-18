# Implementation

The DEX is reminiscent of uniswap in it's implementation, consisting of 3 smart contracts, An ERC-20 token, a  helper contract, and the exchange contract.

## Token
The ERC-20 token, KMS, short for "Keep My Stuff" uses openzeppelin's ERC-20 implementation, with function to disable minting to lock the supply. Being `Ownable`, the token is only minted to the owner and distributed as needed.

## The Helper
[Contract](./contracts/exchangehelper.sol) 
A separated helper contract was created to keep the exchange contract clean and simple. The helper contract contains functions to help with the trading process.
Calculations uses a multiplier of value 10^5 for more granularity and precision.

Function: `getAmountOut`
```solidity
function getAmountOut(
	uint _reserveIn,
	uint _reserveOut,
	uint _amountIn
) internal returns (uint amountOut)
```
For the above given inputs, an output amount of assets is returned, using the Constant Product Formula to determine the exchange rate and taking out a fee. This function is designed to be reusable by AMM implementations that use liquidity pools to facilitates trades of two assets. LPs rewards is handled separately.

Function: `checkSlippage`
```solidity
function checkSlippage(
	uint _reserveIn,
	uint _reserveOut,
	uint _amountIn,
	uint _amountOut,
	uint _maxSlippage
) internal returns (bool accept)
```
Slippage is a main concern for traders. For every trade, one may sets a maximum tolerance. This helper function calculate the slippage of an arbitrary trade for any liquidity pool of assets and decides if it's within acceptable range or not.

This helper function is an attempt to uphold the "low coupling" design pattern, for flexible usage and change of other exchange logics without the need to redeploy.

## The exchange
[Contract](./contracts/exchange.sol) 
The exchange contract handles the primary functionalities of the AMM Exchange. Including creation of liquidity pool, add liquidity, remove liquidity, swap functions and get reserves. It also handles LPs rewards by keeping a mapping of addresses to shares amount. 

### Some notable functions

`poolExist` modifier
```solidity
modifier poolExist() {
	require(eth_reserves > 0, "No liquidity pool");
	require(token_reserves > 0, "No liquidity pool");
	_;
}
```
Modifier to revert any function call if the liquidity pool is empty, preventing wasteful gas usage.

Function `ethToToken`
```solidity
function ethToToken(
	uint _amountETH
	) internal view poolExist returns (uint amountToken) {
		amountToken = _amountETH * (token_reserves / eth_reserves);
	}
```
For assisting liquidity changing functions, take in account the constant product to ensure added assets have the same ratio as the pool.
