const mongoose = require("mongoose");

const EcoSchema = new mongoose.Schema({
  transporte: String,
  plastico: String,
  energia: String,
  score: Number,
  recomendaciones: [String],
  txHash: String,
}, { timestamps: true });

module.exports = mongoose.model("Eco", EcoSchema);