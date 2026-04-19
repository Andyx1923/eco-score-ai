const {
  Connection,
  Keypair,
  SystemProgram,
  sendAndConfirmTransaction,
  Transaction
} = require("@solana/web3.js");

// 🌐 conexión a devnet
const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);

// 🔐 TU WALLET FIJA (REEMPLAZA CON TU SECRET)
const secret = Uint8Array.from([89,239,66,60,46,86,180,161,100,138,143,150,114,37,67,53,198,113,193,3,231,11,116,158,131,205,174,103,234,177,212,165,125,56,238,112,87,80,97,190,142,127,71,14,37,60,16,2,57,237,140,88,131,135,251,217,9,223,200,34,20,150,151,119]);

const wallet = Keypair.fromSecretKey(secret);

const registrarEnSolana = async () => {
  try {
    // 👤 wallet destino (puede ser nueva cada vez)
    const to = Keypair.generate();

    console.log("🪪 Wallet usada:", wallet.publicKey.toString());

    // 💸 crear transacción
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: to.publicKey,
        lamports: 1000, // cantidad mínima
      })
    );

    // 🚀 enviar a blockchain
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet]
    );

    console.log("🌐 TX REAL enviada:", signature);

    return signature;

  } catch (error) {
    console.error("❌ Error Solana REAL:", error);
    return null;
  }
};

module.exports = { registrarEnSolana };