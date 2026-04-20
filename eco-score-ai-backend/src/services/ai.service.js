// ai.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarRecomendaciones = async (data, score) => {
  try {
    console.log("➡️ Enviando a Gemini...");

    // Usar el modelo correcto
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Actúa como experto ambiental.
Perfil: Transporte: ${data.transporte}, Plástico: ${data.plastico}, Energía: ${data.energia}, Score: ${score}/100.
Genera exactamente 3 recomendaciones de máximo 8 palabras cada una.
Sin viñetas, sin números, solo texto separado por saltos de línea.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini respondió correctamente");

    return text
      .split("\n")
      .map(t => t.replace(/^[\*\-\d\.\s]+/, "").trim())
      .filter(t => t !== "")
      .slice(0, 3);

  } catch (error) {
    console.error("❌ Error Gemini:", error.message);
    return ["Reduce el uso de plástico", "Usa transporte sostenible", "Optimiza el consumo energético"];
  }
};
