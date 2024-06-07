# AMM DEX with ZK

A decentralised exchange similar to uniswap, with option to swap with zero-knowledge

## What is zero-knowledge-ed?

Assuming you're familiar with zk already, we used Zokrates to let traders swap
in ETH and withdraw tokens later. All the calculation is still performed as if
the tokens have left the DEX.
Such tokens will enters a "waiting room". Only someone who has the zk-snark
proof that locks the token will be able to withdraw this asset.

## Implementation

Traders who want to use zk features can use our tools, provided [here](./zk_app)

Using run.sh script, user can generate a sha256 digest from 4 128-bit numbers
and a proof, used to prove the knowledge of the pre-image of the digest.
User use the digest to send fund, and can use the proof of pre-image knowledge
to withdraw.

Call `zkSwapETHForTokens` function and provide an sha256 digest, which
will be mapped to the amount of tokens equivalent to the ETH being sent.
The tool will generates a `proof.json` file, which, when used as parameter for
`zkWithdraw` along with the sha256, will approve and sends the caller the
tokens.

## Development

### Install node packages

```sh
npm i
```

> [!WARNING] BEFORE DEPLOY:
> Update token and exchange address in exchange smart contract

### Set these variable in your .env file:

- PRIVATE_KEY=""  //private key of deployer
- TOKEN_ADDRESS=""  //automatically set when run deploy script
- EXCHANGE_ADDRESS=""  //automatically set when run deploy script
- TOKEN_ABI_PATH="./artifacts/contracts/token.sol/Token.json"
- EXCHANGE_ABI_PATH="./artifacts/contracts/exchange.sol/exchange.json"

### Referer
- [Instruction](https://cs251.stanford.edu/hw/proj4.pdf)
- [Lecture](https://cs251.stanford.edu/lectures/lecture10.pdf)
- [Uniswap v3](https://docs.uniswap.org/concepts/overview)
