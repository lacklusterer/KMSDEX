// =================== CS251 DEX Project =================== //
//        @author: Gordon Martinez-Piedra '23
// ========================================================= //

// Set up Ethers.js
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var defaultAccount;

const exchange_name = "Standexchange"; // TODO: fill in the name of your exchange

const token_name = "KeepMyStuff"; // TODO: replace with name of your token
const token_symbol = "KMS"; // TODO: replace with symbol for your token

// =============================================================================
//                          ABIs: Paste Your ABIs Here
// =============================================================================

// TODO: Paste your token contract address and ABI here:
const token_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const token_abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disable_mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const token_contract = new ethers.Contract(
  token_address,
  token_abi,
  provider.getSigner()
);

// TODO: Paste your exchange contract address and ABI here:
const exchange_address = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const exchange_abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountTokens",
        type: "uint256",
      },
    ],
    name: "createPool",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "exchange_name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSwapFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "removeAllLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountETH",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxSlippage",
        type: "uint256",
      },
    ],
    name: "swapETHForTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountTokens",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxSlippage",
        type: "uint256",
      },
    ],
    name: "swapTokensForETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract Token",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const exchange_contract = new ethers.Contract(
  exchange_address,
  exchange_abi,
  provider.getSigner()
);

// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the above

// make a global tracking pool state
var poolState;

/*** INIT ***/
async function init() {
  poolState = await getPoolState();
  console.log("starting init");
  if (poolState["token_liquidity"] === 0 && poolState["eth_liquidity"] === 0) {
    // Call mint twice to make sure mint can be called multiple times prior to disable_mint
    // total_supply is 10^5 which we represent as 10**5
    // Note a 10**5 off
    const total_supply = 100000;
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .mint(total_supply / 2);
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .mint(total_supply / 2);
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .disable_mint();
    await token_contract
      .connect(provider.getSigner(defaultAccount))
      .approve(exchange_address, total_supply);
    // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
    await exchange_contract
      .connect(provider.getSigner(defaultAccount))
      .createPool(5000, { value: ethers.utils.parseEther("5000") });
    console.log("init finished");

    // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
  }
}

async function getPoolState() {
  // read pool balance for each type of liquidity:
  let accounts = await provider.listAccounts();
  let poolReserves = await exchange_contract
    .connect(provider.getSigner(accounts[0]))
    .getReserves();
  // Convert WEI to ETH for UI
  let liquidity_eth = Number(ethers.utils.formatEther(poolReserves[0]));
  let liquidity_tokens = Number(poolReserves[1]);
  print;
  return {
    token_liquidity: liquidity_tokens,
    eth_liquidity: liquidity_eth,
    token_eth_rate: liquidity_tokens / liquidity_eth,
    eth_token_rate: liquidity_eth / liquidity_tokens,
  };
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100.
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function addLiquidity(amountEth, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  _maxSlippagePct = maxSlippagePct / 100;
  let accounts = await provider.listAccounts();
  let token_balance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .balanceOf(accounts[0]);
  let eth_balance = await provider.getBalance(accounts[0]);
  let token_amount = amountEth * poolState["token_eth_rate"];
  // Check if the user has enough tokens and eth
  if (token_balance < token_amount || eth_balance < amountEth) {
    console.log("Insufficient funds");
    return;
  }
  // Check if the user has approved the exchange to spend their tokens
  let allowance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .allowance(accounts[0], exchange_address);
  if (allowance < token_amount) {
    await token_contract
      .connect(provider.getSigner(accounts[0]))
      .approve(exchange_address, token_amount);
  }
  // Add liquidity
  let eth_amount = ethers.utils.parseEther(amountEth.toString());
  let token_amount_wei = ethers.utils.parseEther(token_amount.toString());
  let min_liquidity = 0;
  let deadline = Math.floor(Date.now() / 1000) + 60;
  await exchange_contract
    .connect(provider.getSigner(accounts[0]))
    .addLiquidity(token_amount_wei, min_liquidity, deadline, {
      value: eth_amount,
    });
}

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  _maxSlippagePct = maxSlippagePct / 100;
  let accounts = await provider.listAccounts();
  let eth_balance = await provider.getBalance(accounts[0]);
  let token_balance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .balanceOf(accounts[0]);
  let eth_amount = ethers.utils.parseEther(amountEth.toString());
  let liquidity = amountEth * poolState["eth_liquidity"];
  let min_eth = 0;
  let min_tokens = 0;
  let deadline = Math.floor(Date.now() / 1000) + 60;
  await exchange_contract
    .connect(provider.getSigner(accounts[0]))
    .removeLiquidity(liquidity, min_tokens, min_eth, deadline);
}

async function removeAllLiquidity(maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  _maxSlippagePct = maxSlippagePct / 100;
  let accounts = await provider.listAccounts();
  let eth_balance = await provider.getBalance(accounts[0]);
  let token_balance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .balanceOf(accounts[0]);
  let liquidity = poolState["eth_liquidity"];
  let min_eth = 0;
  let min_tokens = 0;
  let deadline = Math.floor(Date.now() / 1000) + 60;
  await exchange_contract
    .connect(provider.getSigner(accounts[0]))
    .removeAllLiquidity(liquidity, min_tokens, min_eth, deadline);
}

/*** SWAP ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  _maxSlippagePct = maxSlippagePct / 100;
  let accounts = await provider.listAccounts();
  let token_balance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .balanceOf(accounts[0]);
  let eth_balance = await provider.getBalance(accounts[0]);
  let token_amount = amountToken;
  let eth_amount = 0;
  // Check if the user has enough tokens
  if (token_balance < token_amount) {
    console.log("Insufficient funds");
    return;
  }
  // Check if the user has approved the exchange to spend their tokens
  let allowance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .allowance(accounts[0], exchange_address);
  if (allowance < token_amount) {
    await token_contract
      .connect(provider.getSigner(accounts[0]))
      .approve(exchange_address, token_amount);
  }
  // Swap tokens for eth
  let token_amount_wei = ethers.utils.parseEther(token_amount.toString());
  let min_eth = 0;
  let deadline = Math.floor(Date.now() / 1000) + 60;
  let eth_received = await exchange_contract
    .connect(provider.getSigner(accounts[0]))
    .swapTokensForETH(token_amount_wei, min_eth, deadline);
  console.log("ETH received: ", eth_received);
}

async function swapETHForTokens(amountEth, maxSlippagePct) {
  /** TODO: ADD YOUR CODE HERE **/
  _maxSlippagePct = maxSlippagePct / 100;
  let accounts = await provider.listAccounts();
  let eth_balance = await provider.getBalance(accounts[0]);
  let token_balance = await token_contract
    .connect(provider.getSigner(accounts[0]))
    .balanceOf(accounts[0]);
  let eth_amount = ethers.utils.parseEther(amountEth.toString());
  let token_amount = 0;
  // Check if the user has enough eth
  if (eth_balance < eth_amount) {
    console.log("Insufficient funds");
    return;
  }
  // Swap eth for tokens
  let min_tokens = 0;
  let deadline = Math.floor(Date.now() / 1000) + 60;
  let token_received = await exchange_contract
    .connect(provider.getSigner(accounts[0]))
    .swapETHForTokens(min_tokens, deadline, { value: eth_amount });
  console.log("Tokens received: ", token_received);
}

// =============================================================================
//                                      UI
// =============================================================================

// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response) => {
  defaultAccount = response[0];
  // Initialize the exchange
  init().then(() => {
    // fill in UI with current exchange rate:
    getPoolState().then((poolState) => {
      $("#eth-token-rate-display").html(
        "1 ETH = " + poolState["token_eth_rate"] + " " + token_symbol
      );
      $("#token-eth-rate-display").html(
        "1 " + token_symbol + " = " + poolState["eth_token_rate"] + " ETH"
      );

      $("#token-reserves").html(
        poolState["token_liquidity"] + " " + token_symbol
      );
      $("#eth-reserves").html(poolState["eth_liquidity"] + " ETH");
    });
  });
});

// Allows switching between accounts in 'My Account'
provider.listAccounts().then((response) => {
  var opts = response.map(function (a) {
    return (
      '<option value="' + a.toLowerCase() + '">' + a.toLowerCase() + "</option>"
    );
  });
  $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then(
    (response) => {
      window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then(
    (response) => {
      window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function () {
  console.log("Account: ", $("#myaccount").val());
  defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then(
    (response) => {
      window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then(
    (response) => {
      window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    }
  );
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function () {
  defaultAccount = $("#myaccount").val(); //sets the default account
  removeAllLiquidity($("#max-slippage-liquid").val()).then((response) => {
    window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
  });
});

$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);

// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a description of what you're printing, and then the object to print
function log(description, obj) {
  $("#log").html(
    $("#log").html() +
      description +
      ": " +
      JSON.stringify(obj, null, 2) +
      "\n\n"
  );
}

// =============================================================================
//                                SANITY CHECK
// =============================================================================
function check(name, swap_rate, condition) {
  if (condition) {
    console.log(name + ": SUCCESS");
    return swap_rate == 0 ? 6 : 10;
  } else {
    console.log(name + ": FAILED");
    return 0;
  }
}

const sanityCheck = async function () {
  var swap_fee = await exchange_contract
    .connect(provider.getSigner(defaultAccount))
    .getSwapFee();
  console.log("Beginning Sanity Check.");

  var accounts = await provider.listAccounts();
  defaultAccount = accounts[1];
  var score = 0;
  var start_state = await getPoolState();
  console.log(`Start state ${JSON.stringify(start_state)}`);
  var start_tokens = await token_contract
    .connect(provider.getSigner(defaultAccount))
    .balanceOf(defaultAccount);

  // No liquidity provider rewards implemented yet
  if (Number(swap_fee[0]) == 0) {
    await swapETHForTokens("100", "1");
    var state1 = await getPoolState();
    // TODO: remove this line
    console.log(state1);
    var expected_tokens_received = 100 * start_state.token_eth_rate;
    var user_tokens1 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Testing simple exchange of ETH to token",
      swap_fee[0],
      Math.abs(
        start_state.token_liquidity -
          expected_tokens_received -
          state1.token_liquidity
      ) < 5 &&
        state1.eth_liquidity - start_state.eth_liquidity === 100 &&
        Math.abs(
          Number(start_tokens) + expected_tokens_received - Number(user_tokens1)
        ) < 5
    );

    await swapTokensForETH("90", "1");
    var state2 = await getPoolState();
    // TODO: remove this line
    console.log(state2);
    var expected_eth_received = 90 * state1.eth_token_rate;
    var user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test simple exchange of token to ETH",
      swap_fee[0],
      state2.token_liquidity === state1.token_liquidity + 90 &&
        Math.abs(
          state1.eth_liquidity - expected_eth_received - state2.eth_liquidity
        ) < 5 &&
        Number(user_tokens2) === Number(user_tokens1) - 90
    );

    defaultAccount = accounts[0];
    var state2 = await getPoolState();
    user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);

    await addLiquidity("100", "1");
    var expected_tokens_added = 100 * state2.token_eth_rate;
    var state3 = await getPoolState();
    // TODO: remove this line
    console.log(state3);
    var user_tokens3 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test adding liquidity",
      swap_fee[0],
      state3.eth_liquidity === state2.eth_liquidity + 100 &&
        Math.abs(
          state3.token_liquidity -
            (state2.token_liquidity + expected_tokens_added)
        ) < 5 &&
        Math.abs(
          Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)
        ) < 5
    );

    await removeLiquidity("10", "1");
    var expected_tokens_removed = 10 * state3.token_eth_rate;
    var state4 = await getPoolState();
    console.log(state4);
    var user_tokens4 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing liquidity",
      swap_fee[0],
      state4.eth_liquidity === state3.eth_liquidity - 10 &&
        Math.abs(
          state4.token_liquidity -
            (state3.token_liquidity - expected_tokens_removed)
        ) < 5 &&
        Math.abs(
          Number(user_tokens4) -
            (Number(user_tokens3) + expected_tokens_removed)
        ) < 5
    );

    await removeAllLiquidity("1");
    expected_tokens_removed = 90 * state4.token_eth_rate;
    var state5 = await getPoolState();
    console.log(state5);
    var user_tokens5 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing all liquidity",
      swap_fee[0],
      state5.eth_liquidity - (state4.eth_liquidity - 90) < 5 &&
        Math.abs(
          state5.token_liquidity -
            (state4.token_liquidity - expected_tokens_removed)
        ) < 5 &&
        Math.abs(
          Number(user_tokens5) -
            (Number(user_tokens4) + expected_tokens_removed)
        ) < 5
    );
  }

  // LP provider rewards implemented
  else {
    var swap_fee = swap_fee[0] / swap_fee[1];
    console.log("swap fee: ", swap_fee);

    await swapETHForTokens("100", "1");
    var state1 = await getPoolState();
    var expected_tokens_received =
      100 * (1 - swap_fee) * start_state.token_eth_rate;
    var user_tokens1 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Testing simple exchange of ETH to token",
      swap_fee[0],
      Math.abs(
        start_state.token_liquidity -
          expected_tokens_received -
          state1.token_liquidity
      ) < 5 &&
        state1.eth_liquidity - start_state.eth_liquidity === 100 &&
        Math.abs(
          Number(start_tokens) + expected_tokens_received - Number(user_tokens1)
        ) < 5
    );

    await swapTokensForETH("90", "1");
    var state2 = await getPoolState();
    var expected_eth_received = 90 * (1 - swap_fee) * state1.eth_token_rate;
    var user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test simple exchange of token to ETH",
      swap_fee[0],
      state2.token_liquidity === state1.token_liquidity + 90 &&
        Math.abs(
          state1.eth_liquidity - expected_eth_received - state2.eth_liquidity
        ) < 5 &&
        Number(user_tokens2) === Number(user_tokens1) - 90
    );

    defaultAccount = accounts[0];
    var state2 = await getPoolState();
    user_tokens2 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);

    await addLiquidity("100", "1");
    var expected_tokens_added = 100 * state2.token_eth_rate;
    var state3 = await getPoolState();
    var user_tokens3 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test adding liquidity",
      swap_fee[0],
      state3.eth_liquidity === state2.eth_liquidity + 100 &&
        Math.abs(
          state3.token_liquidity -
            (state2.token_liquidity + expected_tokens_added)
        ) < 5 &&
        Math.abs(
          Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)
        ) < 5
    );

    // accumulate some lp rewards
    for (var i = 0; i < 20; i++) {
      await swapETHForTokens("100", "1");
      await swapTokensForETH("100", "1");
    }

    var state4 = await getPoolState();
    var user_tokens4 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    await removeLiquidity("50", "1");
    // set to 22 for a bit of leeway, could potentially reduce to 20
    var approx_eth_removed = 50 + (20 * 100 * swap_fee * 50) / 5100;
    var approx_tokens_removed =
      50 * state4.token_eth_rate + (20 * 100 * swap_fee * 50) / 5100;
    var state5 = await getPoolState();
    var user_tokens5 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing liquidity",
      swap_fee[0],
      Math.abs(
        state5.eth_liquidity - (state4.eth_liquidity - approx_eth_removed)
      ) < 10 &&
        Math.abs(
          state5.token_liquidity -
            (state4.token_liquidity - approx_tokens_removed)
        ) < 10 &&
        Number(user_tokens5) > Number(user_tokens4) + 45
    );

    await removeAllLiquidity("1");
    var approx_eth_removed = 50 + (20 * 100 * swap_fee * 50) / 5100;
    var approx_tokens_removed =
      50 * state3.token_eth_rate + (20 * 100 * swap_fee * 50) / 5100;
    var state6 = await getPoolState();
    var user_tokens6 = await token_contract
      .connect(provider.getSigner(defaultAccount))
      .balanceOf(defaultAccount);
    score += check(
      "Test removing all liquidity",
      swap_fee[0],
      Math.abs(
        state6.eth_liquidity - (state5.eth_liquidity - approx_eth_removed)
      ) < 10 &&
        Math.abs(
          state6.token_liquidity -
            (state5.token_liquidity - approx_tokens_removed)
        ) < 10 &&
        Number(user_tokens6) > Number(user_tokens5) + 45
    );
  }
  console.log("Final score: " + score + "/50");
};

// Sleep 3s to ensure init() finishes before sanityCheck() runs on first load.
// If you run into sanityCheck() errors due to init() not finishing, please extend the sleep time.

setTimeout(function () {
  sanityCheck();
}, 10000);
