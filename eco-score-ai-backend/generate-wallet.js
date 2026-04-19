const { Keypair } = require("@solana/web3.js");

const wallet = Keypair.generate();

console.log("PUBLIC:", wallet.publicKey.toString());
console.log("SECRET:", JSON.stringify(Array.from(wallet.secretKey)));