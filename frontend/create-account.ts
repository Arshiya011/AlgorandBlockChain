import algosdk from "algosdk";

const account = algosdk.generateAccount();

console.log("\n=== X402 TESTNET ACCOUNT ===");
console.log("Address:");
console.log(account.addr.toString());

console.log("\n25-word mnemonic:");
console.log(algosdk.secretKeyToMnemonic(account.sk));

console.log("\nKEEP THIS MNEMONIC PRIVATE!");