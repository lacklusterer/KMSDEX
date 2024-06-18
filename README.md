# Cryptocurrency Decentralized Exchange Report

## I. What is this?

Report of my attempt on creating a decentralized cryptocurrency exchange, based on Stanford University's CS251 proj4.

This project is worked on intermittently over the course of a month, starting from May 21st, 2024. It will cover how AMM work, the design, implementation, as well as limitations. Most importantly, it will be a refection of what I have learned, challenges I faced, and what I can do better in the future.

## II. The Decentralized Exchange

An **Exchange** facilitates the trading of one asset to another in order to mitigate risk, preserve value, achieve liquidity, without the need for commodity of equivalent value.

Traditionally, this is handled by a *centralized* entity, which acts as intermediary between buyers and sellers, and charges fees for the service. Such centralization, though might have been the historical way that we do things, comes with some issues, namely:

- **Trust and Censorship**: Acting as the governing entity, CEX can make unilateral decisions, seize funds, refuse to do business. Users have no means to ensure the CEX operates correctly or fairly. On the other hand, CEX uses trust and the vast resource at its disposal to maintain its user-base.
- **Transparency and Security**: Users rely on the CEX to facilitate transactions, limiting their autonomy and control as well as access to information. While convenient, this is also a single-point-of-failure, held at stake of the centralized governance.

A **Decentralized Exchange (DEX)**, enabled by blockchain technology, on the other hand, facilitates tradings directly between market participants, operating on the principles of *programmability*, *transparency*, *permissionless*, and *non-custodial* asset management.

## III. Automated Market Maker
**Automated Market Maker** (AMM), is a type of decentralized exchange that relies on algorithm to price assets and facilitate trades, living directly on the blockchain, it fully leverages all of web3's merits: an accessible, efficient and easy to bootstrap.

Main participants:
- Liquidity providers (LPs) deposit assets into an liquidity pool on-chain to earn interest based on their ownership proportion.
- Traders calls the AMM contract to swap assets, taking advantage of the volatility of one asset and the stability of another to make profit.

### 1. Exchange rate
For a liquidity pool of 2 assets that has (`x` units of **X**) and (`y` units of **Y**), a reasonable goal would be to maintain the balance of these assets in value. Otherwise, it wouldn't be much of a decentralized exchange and more of a decentralized pot-luck.

- Alice wants to sell an amount of **X**, `dx` for some `dy` in return. The pool state is updated to maintain the price balance. For this trade, the **marginal price** is defined as `p = -dy/dx`, the exchange rate at the moment.

- The marginal price, can be used to estimate the value of assets in the pool, X in terms of Y: `px = y`

- Plugging into definition for the following differential equation:

$$
-\frac{dy}{dx} = \frac{y}{x}
$$

- Solving the differential equation, we have an unique solution: $x \cdot y = k$ , for $k \in \mathbb{R}$

Indeed, by maintaining this constant product, the AMM can ensure that the price of the assets in the pool is balanced. This is known as the **Constant Product Market Maker**.

![imagefromslide](./res/constprodmm.png)
