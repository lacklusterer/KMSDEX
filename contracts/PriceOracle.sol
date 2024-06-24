// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IExchange {
	function getReserves() external view returns (uint, uint);
}

contract PriceOracle {
	IExchange public exchange;

	constructor(address _exchangeAddress) {
		exchange = IExchange(_exchangeAddress);
	}

	function getPrice() external view returns (uint price) {
		(uint ethReserves, uint tokenReserves) = exchange.getReserves();
		price = ((ethReserves * (10 ** 18)) / tokenReserves);
	}

	function getInversePrice() external view returns (uint) {
		(uint ethReserves, uint tokenReserves) = exchange.getReserves();
		return ((tokenReserves * (10 ** 18)) / ethReserves);
	}
}
