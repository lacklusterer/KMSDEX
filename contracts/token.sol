// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Your token contract
contract Token is Ownable, ERC20 {
	string private constant _symbol = "KMS";
	string private constant _name = "KeepMyStuff";

	bool private mint_enabled = true;

	constructor() ERC20(_name, _symbol) {}

	// Function mint: Create more of your tokens.
	// You can change the inputs, or the scope of your function, as needed.
	// Do not remove the onlyOwner modifier!
	function mint(uint amount) public onlyOwner {
		require(mint_enabled, "Minting disabled");
		_mint(msg.sender, amount);
	}

	// Function disable_mint: Disable future minting of your token.
	// You can change the inputs, or the scope of your function, as needed.
	// Do not remove the onlyOwner modifier!
	function disable_mint() public onlyOwner {
		require(mint_enabled, "Minting already disabled");
		mint_enabled = false;
	}
}
