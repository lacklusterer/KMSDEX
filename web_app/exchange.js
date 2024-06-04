require("dotenv").config();

const hre = require("hardhat");
const fs = require("fs");

// const provider = new ethers.providers.JsonRpcProvider(hre.network.config.url);
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

var defaultAccount;

const exchange_name = 'Standex';

const token_name = 'KeepMyStuff';
const token_symbol = 'KMS';

const token_address = process.env.TOKEN_ADDRESS;
const token_abi = JSON.parse(fs.readFileSync(process.env.TOKEN_ABI_PATH)).abi;
const token_contract = new ethers.Contract(token_address, token_abi, provider.getSigner());

const exchange_address = process.env.EXCHANGE_ADDRESS;
const exchange_abi = JSON.parse(fs.readFileSync(process.env.EXCHANGE_ABI_PATH)).abi;
const exchange_contract = new ethers.Contract(exchange_address, exchange_abi, provider.getSigner());

// NOTE: In production account will be provided by user
// const USER_PRIVATE_KEY = process.env.USER_PRIVATE_KEY;

// Multiplier to assist with exchange rate issues
const exchange_rate_multiplier = 10**5;

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
    if (poolState['token_liquidity'] === 0
            && poolState['eth_liquidity'] === 0) {

      // Call mint twice to make sure mint can be called mutliple times prior to disable_mint
      // total_supply is 10^5 which we represent as 10**5
      const total_supply = 100000;
      await token_contract.connect(provider.getSigner(defaultAccount)).mint(total_supply / 2);
		  await token_contract.connect(provider.getSigner(defaultAccount)).mint(total_supply / 2);
		  await token_contract.connect(provider.getSigner(defaultAccount)).disable_mint();
      await token_contract.connect(provider.getSigner(defaultAccount)).approve(exchange_address, total_supply);

      // initialize pool with equal amounts of ETH and tokens, so exchange rate begins as 1:1
      await exchange_contract.connect(provider.getSigner(defaultAccount)).createPool(5000, {value: ethers.utils.parseEther("5000")});
      console.log("init finished");

       // All accounts start with 0 of your tokens. Thus, be sure to swap before adding liquidity.
    }
}

async function getPoolState() {
    // read pool balance for each type of liquidity:
    let liquidity_tokens = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(exchange_address);
    let liquidity_wei = await provider.getBalance(exchange_address);

    // Convert WEI to ETH for UI
    let liquidity_eth = ethers.utils.formatEther(liquidity_wei);

    return {
        token_liquidity: Number(liquidity_tokens),
        eth_liquidity: Math.round(Number(liquidity_eth)),
        token_eth_rate: Number(liquidity_tokens) / Number(liquidity_eth),
        eth_token_rate: Number(liquidity_eth) / Number(liquidity_tokens)
    };
}

// Note: All these arguments will be strings - convert to relevant types
// Note: maxSlippagePct will be passed in as an string out of 100. 
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function addLiquidity() {
    // [min_exchange_rate, max_exchange_rate] = await getExchangeRates(maxSlippagePct);
 
    await exchange_contract.connect(provider.getSigner(defaultAccount)).addLiquidity( {value: ethers.utils.parseEther(amountEth)});
    console.log("added liquidity");
}

/*** REMOVE LIQUIDITY ***/
async function removeLiquidity(amountEth) {

    await exchange_contract.connect(provider.getSigner(defaultAccount)).removeLiquidity(
      ethers.utils.parseEther(amountEth));
    console.log("removed liquidity");
}

/*** REMOVE ALL LIQUIDITY ***/
async function removeAllLiquidity() {

    amount = await exchange_contract.connect(provider.getSigner(defaultAccount)).removeAllLiquidity();
    console.log("removed all liquidity");
}

/*** GET THE MIN AND MAX EXCHANGE RATE FOR SLIPPAGE PERCENTAGE ***/
async function getExchangeRates(maxSlippagePct){
    reserves = await exchange_contract.connect(provider.getSigner(defaultAccount)).getLiquidity();
    current_exchange_rate = Math.round((exchange_rate_multiplier * reserves[0]) / Number(ethers.utils.formatEther(reserves[1])));
    change_exchange_rate = Math.round((exchange_rate_multiplier * reserves[0] * Number(maxSlippagePct)) / (Number(ethers.utils.formatEther(reserves[1])) * 100));
    min_exchange_rate = current_exchange_rate - change_exchange_rate;
    max_exchange_rate = current_exchange_rate + change_exchange_rate;
    return [min_exchange_rate, max_exchange_rate];
}

/*** SWAP TOKEN FOR ETH ***/
async function swapTokensForETH(amountToken, maxSlippagePct) {
    reserves = await exchange_contract.connect(provider.getSigner(defaultAccount)).getLiquidity();
    max_exchange_rate = Math.round(((Number(maxSlippagePct) * exchange_rate_multiplier * (reserves[0] + Number(amountToken))) / 
    (Number(ethers.utils.formatEther(reserves[1])) * 100)) + (exchange_rate_multiplier * (reserves[0] + Number(amountToken))) / 
    Number(ethers.utils.formatEther(reserves[1])));

    balance = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
    await token_contract.connect(provider.getSigner(defaultAccount)).approve(exchange_address, balance);
    await exchange_contract.connect(provider.getSigner(defaultAccount)).swapTokensForETH(
      amountToken, max_exchange_rate);
    console.log("swapped KMS for ETH");
}

/*** SWAP ETH FOR TOKEN ***/
async function swapETHForTokens(amountEth, maxSlippagePct) {
    reserves = await exchange_contract.connect(provider.getSigner(defaultAccount)).getLiquidity();
    max_exchange_rate = Math.round((Number(maxSlippagePct) * (exchange_rate_multiplier * (Number(ethers.utils.formatEther(reserves[1])) 
    + Number(amountEth))) / (reserves[0] * 100)) + ((exchange_rate_multiplier * (Number(ethers.utils.formatEther(reserves[1])) 
    + Number(amountEth))) / reserves[0]));

    await exchange_contract.connect(provider.getSigner(defaultAccount)).swapETHForTokens(
      max_exchange_rate, {value: ethers.utils.parseEther(amountEth)});
    console.log("swapped ETH for KMS");
}

// =============================================================================
//                                      UI
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.
provider.listAccounts().then((response)=> {
    defaultAccount = response[0];
    // Initialize the exchange
    init().then(() => {
        // fill in UI with current exchange rate:
        getPoolState().then((poolState) => {
            $("#eth-token-rate-display").html("1 ETH = " + poolState['token_eth_rate'] + " " + token_symbol);
            $("#token-eth-rate-display").html("1 " + token_symbol + " = " + poolState['eth_token_rate'] + " ETH");

            $("#token-reserves").html(poolState['token_liquidity'] + " " + token_symbol);
            $("#eth-reserves").html(poolState['eth_liquidity'] + " ETH");
        });
    });
});

// Allows switching between accounts in 'My Account'
provider.listAccounts().then((response)=>{
    var opts = response.map(function (a) { return '<option value="'+
            a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
    $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#swap-eth").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  swapETHForTokens($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#swap-token").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  swapTokensForETH($("#amt-to-swap").val(), $("#max-slippage-swap").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'addLiquidity' function when you click the button
$("#add-liquidity").click(function() {
    console.log("Account: ", $("#myaccount").val());
    defaultAccount = $("#myaccount").val(); //sets the default account
  addLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeLiquidity' function when you click the button
$("#remove-liquidity").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  removeLiquidity($("#amt-eth").val(), $("#max-slippage-liquid").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'removeAllLiquidity' function when you click the button
$("#remove-all-liquidity").click(function() {
    defaultAccount = $("#myaccount").val(); //sets the default account
  removeAllLiquidity($("#max-slippage-liquid").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

$("#swap-eth").html("Swap ETH for " + token_symbol);

$("#swap-token").html("Swap " + token_symbol + " for ETH");

$("#title").html(exchange_name);


// This is a log function, provided if you want to display things to the page instead of the JavaScript console
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}


// =============================================================================
//                                SANITY CHECK
// =============================================================================
function check(name, swap_rate, condition) {
	if (condition) {
		console.log(name + ": SUCCESS");
		return (swap_rate == 0 ? 6 : 10);
	} else {
		console.log(name + ": FAILED");
		return 0;
	}
}

const sanityCheck = async function() {
    var swap_fee = await exchange_contract.connect(provider.getSigner(defaultAccount)).getSwapFee();
    console.log("Beginning Sanity Check.");

    var accounts = await provider.listAccounts();
    defaultAccount = accounts[1];
    var score = 0;
    var start_state = await getPoolState();
    console.log(`Start state ${start_state}`)
    var start_tokens = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);

    // No liquidity provider rewards implemented yet
    if (Number(swap_fee[0]) == 0) {
        await swapETHForTokens("100", "1");
        var state1 = await getPoolState();
        var expected_tokens_received = 100 * start_state.token_eth_rate;
        var user_tokens1 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Testing simple exchange of ETH to token", swap_fee[0],
          Math.abs((start_state.token_liquidity - expected_tokens_received) - state1.token_liquidity) < 5 &&
          (state1.eth_liquidity - start_state.eth_liquidity) === 100 &&
          Math.abs(Number(start_tokens) + expected_tokens_received - Number(user_tokens1)) < 5);
        
        await swapTokensForETH("90", "1");
        var state2 = await getPoolState();
        var expected_eth_received = 90 * state1.eth_token_rate;
        var user_tokens2 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test simple exchange of token to ETH", swap_fee[0], 
          state2.token_liquidity === (state1.token_liquidity + 90) && 
          Math.abs((state1.eth_liquidity - expected_eth_received) - state2.eth_liquidity) < 5 &&
          Number(user_tokens2) === (Number(user_tokens1) - 90));
        
        defaultAccount = accounts[0];
        var state2 = await getPoolState();
        user_tokens2 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);

        await addLiquidity("100", "1");
        var expected_tokens_added = 100 * state2.token_eth_rate;
        var state3 = await getPoolState();
        var user_tokens3 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test adding liquidity", swap_fee[0], 
          state3.eth_liquidity === (state2.eth_liquidity + 100) &&
          Math.abs(state3.token_liquidity - (state2.token_liquidity + expected_tokens_added)) < 5 &&
          Math.abs(Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)) < 5);
        
        await removeLiquidity("10", "1");
        var expected_tokens_removed = 10 * state3.token_eth_rate;
        var state4 = await getPoolState();
        var user_tokens4 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test removing liquidity", swap_fee[0], 
          state4.eth_liquidity === (state3.eth_liquidity - 10) &&
          Math.abs(state4.token_liquidity - (state3.token_liquidity - expected_tokens_removed)) < 5 &&
          Math.abs(Number(user_tokens4) - (Number(user_tokens3) + expected_tokens_removed)) < 5);

        await removeAllLiquidity("1");
        expected_tokens_removed = 90 * state4.token_eth_rate;
        var state5 = await getPoolState();
        var user_tokens5 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test removing all liquidity", swap_fee[0], 
          state5.eth_liquidity - (state4.eth_liquidity - 90) < 5 && 
          Math.abs(state5.token_liquidity - (state4.token_liquidity - expected_tokens_removed)) < 5 &&
          Math.abs(Number(user_tokens5) - (Number(user_tokens4) + expected_tokens_removed)) < 5); 
    }

    // LP provider rewards implemented
    else {
        var swap_fee = swap_fee[0] / swap_fee[1];
        console.log("swap fee: ", swap_fee);

        await swapETHForTokens("100", "1");
        var state1 = await getPoolState();
        var expected_tokens_received = 100 * (1 - swap_fee) * start_state.token_eth_rate;
        var user_tokens1 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Testing simple exchange of ETH to token", swap_fee[0], 
          Math.abs((start_state.token_liquidity - expected_tokens_received) - state1.token_liquidity) < 5 &&
          (state1.eth_liquidity - start_state.eth_liquidity) === 100 &&
          Math.abs(Number(start_tokens) + expected_tokens_received - Number(user_tokens1)) < 5);
        
        await swapTokensForETH("90", "1");
        var state2 = await getPoolState();
        var expected_eth_received = 90 * (1 - swap_fee) * state1.eth_token_rate;
        var user_tokens2 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test simple exchange of token to ETH", swap_fee[0], 
          state2.token_liquidity === (state1.token_liquidity + 90) && 
          Math.abs((state1.eth_liquidity - expected_eth_received) - state2.eth_liquidity) < 5 &&
          Number(user_tokens2) === (Number(user_tokens1) - 90));

        defaultAccount = accounts[0];
        var state2 = await getPoolState();
        user_tokens2 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        
        await addLiquidity("100", "1");
        var expected_tokens_added = 100 * state2.token_eth_rate;
        var state3 = await getPoolState();
        var user_tokens3 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test adding liquidity", swap_fee[0], 
          state3.eth_liquidity === (state2.eth_liquidity + 100) &&
          Math.abs(state3.token_liquidity - (state2.token_liquidity + expected_tokens_added)) < 5 &&
          Math.abs(Number(user_tokens3) - (Number(user_tokens2) - expected_tokens_added)) < 5);
        

        // accumulate some lp rewards
        for (var i = 0; i < 20; i++) {
          await swapETHForTokens("100", "1");
          await swapTokensForETH("100", "1");
        }

        var state4 = await getPoolState();
        var user_tokens4 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        await removeLiquidity("10", "1");
        // set to 22 for a bit of leeway, could potentially reduce to 20 
        var expected_tokens_removed = (10 + 22 * 100 * swap_fee) * state3.token_eth_rate;
        var state5 = await getPoolState();
        var user_tokens5 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test removing liquidity", swap_fee[0], 
          state5.eth_liquidity === (state4.eth_liquidity - 10) &&
          Math.abs(state5.token_liquidity - (state4.token_liquidity - expected_tokens_removed)) < expected_tokens_removed * 1.2 &&
          Math.abs(Number(user_tokens5) - (Number(user_tokens4) + expected_tokens_removed)) < expected_tokens_removed * 1.2);

        await removeAllLiquidity("1");
        expected_tokens_removed = (90 +  22 * 100 * swap_fee) * state5.token_eth_rate;
        var state6 = await getPoolState();
        var user_tokens6 = await token_contract.connect(provider.getSigner(defaultAccount)).balanceOf(defaultAccount);
        score += check("Test removing all liquidity", swap_fee[0], 
          Math.abs(state6.eth_liquidity - (state5.eth_liquidity - 90)) < 5 && 
          Math.abs(state6.token_liquidity - (state5.token_liquidity - expected_tokens_removed)) < expected_tokens_removed * 1.2 &&
          Number(user_tokens6) > Number(user_tokens5)); 
    }
    console.log("Final score: " + score + "/50");

}

// Sleep 10s to ensure init() finishes before sanityCheck() runs on first load.
// If you run into sanityCheck() errors due to init() not finishing, please extend the sleep time.

/*setTimeout(function () {
  sanityCheck();
}, 10000)*/
