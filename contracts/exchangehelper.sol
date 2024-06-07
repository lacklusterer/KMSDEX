// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.0;

contract ExchangeHelper {
	uint private swap_fee_numerator = 3;
	uint private swap_fee_denominator = 100;
	
	uint private multiplier = 10 ** 5;

    // Function getSwapFee: Returns the current swap fee ratio to the client.
    function getSwapFee() internal view returns (uint, uint) {
        return (swap_fee_numerator, swap_fee_denominator);
    }

	function getAmountOut(
		uint _reserveIn,
		uint _reserveOut,
		uint _amountIn
	) internal view returns (uint amountOut) {
		uint amountInDeducted = (multiplier * _amountIn * swap_fee_numerator) /
			swap_fee_denominator;
		uint outNumberator = _reserveOut * amountInDeducted;
		uint outDenominator = _reserveIn * multiplier + amountInDeducted;

		amountOut = outNumberator / outDenominator;
	}

	// Function checkSlippage: return a boolean: exchange rate slippage is acceptable or not
	function checkSlippage(
		uint _reserveIn,
		uint _reserveOut,
		uint _amountIn,
		uint _amountOut,
		uint _maxSlippage
	) internal view returns (bool accept) {
		uint currentRate = (_reserveIn * multiplier) / _reserveOut;
		uint afterTradeRate = ((_reserveIn + _amountIn) * multiplier) /
			(_reserveOut - _amountOut);
		uint slippage = ((afterTradeRate - currentRate) * 100) / currentRate;
		accept = (slippage <= _maxSlippage);
	}
}
