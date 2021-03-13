//
// Add package imports and setup here
//
// 1. Import ContractKit
const web3Lib = require('web3');
const contractKit = require('@celo/contractkit');
// 2. Init a new kit, connected to the alfajores testnet
const web3 = new web3Lib('https://alfajores-forno.celo-testnet.org');
const kit = contractKit.newKitFromWeb3(web3);
//
// Read Accounts
//



async function readAccount(){
    // 3. Get the token contract wrappers
    let goldtoken = await kit.contracts.getGoldToken();
    let stabletoken = await kit.contracts.getStableToken();
    // 4. Address to look up
    let anAddress = '0x4270a34185e2f38262a80e1c4f04d193109d7ad6';

    // 5. Get Get token balances
    let celoBalance = await goldtoken.balanceOf(anAddress);
    let cUSDBalance = await stabletoken.balanceOf(anAddress);
    // Print balances
    console.log(`${anAddress} CELO balance: ${celoBalance.toString()}`);
    console.log(`${anAddress} cUSD balance: ${cUSDBalance.toString()}`);
}

//
// Create an Account
//

// 6. Import the getAccount function
const getAccount = require('./getAccount').getAccount;

async function createAccount(){
    // 7. Get your account
    let account = await getAccount();
    // 8. Get the token contract wrappers
    let goldtoken = await kit.contracts.getGoldToken();
    let stabletoken = await kit.contracts.getStableToken();  
    // 9. Get your token balances
    let celoBalance = await goldtoken.balanceOf(account.address);
    let cUSDBalance = await stabletoken.balanceOf(account.address);
    // Print your account info

    console.log(`Your account address: ${account.address}`);
    console.log(`Your account CELO balance: ${celoBalance.toString()}`);
    console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`);
}

//
// Send CELO
//

async function send(){
    // 10. Get your account
    let account = await getAccount();
    // 11. Add your account to ContractKit to sign transactions
    kit.connection.addAccount(account.privateKey);
    // 12. Specify recipient Address
    let anAddress = '0x4270a34185e2f38262a80e1c4f04d193109d7ad6';
    // 13. Specify an amount to send
    let amount = 100000;
    // 14. Get the token contract wrappers
    let goldtoken = await kit.contracts.getGoldToken();
    let stabletoken = await kit.contracts.getStableToken();
    // 15. Transfer CELO and cUSD from your account to anAddress
    let celotx = await goldtoken.transfer(anAddress, amount).send({from: account.address});
    let cUSDtx = await stabletoken.transfer(anAddress, amount).send({from: account.address, feeCurrency: stabletoken.address});
    // 16. Wait for the transactions to be processed
    let celoReceipt = await celotx.waitReceipt()
    let cUSDReceipt = await cUSDtx.waitReceipt()
    // 17. Print receipts
    console.log('CELO Transaction receipt: %o', celoReceipt);
    console.log('cUSD Transaction receipt: %o', cUSDReceipt);
    // 18. Get your new balances
    let celoBalance = await goldtoken.balanceOf(account.address);
    let cUSDBalance = await stabletoken.balanceOf(account.address);
    // 19. Print new balances
    console.log(`Your new account CELO balance: ${celoBalance.toString()}`);
    console.log(`Your new account cUSD balance: ${cUSDBalance.toString()}`);
}

readAccount()
createAccount()
send()
