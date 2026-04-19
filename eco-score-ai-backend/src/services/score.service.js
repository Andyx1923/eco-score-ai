const calcularEcoScore = (data) => {
  let score = 100;

  if (data.transporte === "auto") score -= 20;
  if (data.transporte === "bus") score -= 10;
  if (data.transporte === "bicicleta") score += 10;

  if (data.plastico === "alto") score -= 20;
  if (data.plastico === "medio") score -= 10;
  if (data.plastico === "bajo") score += 5;

  if (data.energia === "alto") score -= 20;
  if (data.energia === "medio") score -= 10;
  if (data.plastico === "bajo") score += 5;

  return Math.max(0, Math.min(100, score));
};

module.exports = { calcularEcoScore };