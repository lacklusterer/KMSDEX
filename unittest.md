# Testing
To validate the correctness of implementation, I used hardhat with chai and mocha library to create [unit tests](./test/test-script.js).
```bash
  TokenExchange
    Liquidity functionalities
      Normal
        ✔ Should create liquidity pool with correct reserves
        ✔ Should add the correct amount of liquidity
        ✔ Should remove the correct amount of liquidity
        ✔ Should allow removal of all liquidity
      Specials
        ✔ Should revert if trying to create a liquidity pool with insufficient resource.
        ✔ Should revert if not enough asset to add
        ✔ Should revert if trying to remove more liquidity shares
    Swap Tokens for ETH
      Normal
        ✔ Should swap tokens for ETH with correct exchange rate (40ms)
        ✔ Should revert if slippage too large (57ms)
        ✔ Should revert if don't have enough tokens
      Special
        ✔ Should reject if max_slippage is negative
        ✔ Should revert if not enough ETH in pool to pay
    Swap ETH for tokens
      Normal
        ✔ Should swap ETH for tokens with correct exchange rate
        ✔ Should revert if amount ETH sent is 0
        ✔ Should revert if slippage too large
      Special
        ✔ Should revert if not enough ETH in pool to pay


  16 passing (3s)
```

Basic test cases to ensure that the DEX function correctly were implemented, with console log (commented out) for a more detailed view. Calculations were done off-chain with javascript and library bignumber.js to validate against on-chain calculations.
