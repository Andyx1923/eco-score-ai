const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generarRecomendaciones = async (data, score) => {
  try {
    console.log("➡️ Enviando a Gemini...");

    // Prompt súper estricto para evitar viñetas y formato Markdown
    const prompt = `
Actúa como un experto ambiental.
Perfil del usuario:
- Transporte: ${data.transporte}
- Uso de plástico: ${data.plastico}
- Energía: ${data.energia}
- Score Ambiental: ${score}/100

Genera exactamente 3 recomendaciones personalizadas y accionables para este usuario.
Reglas estrictas:
1. Cada recomendación debe tener máximo 8 palabras.
2. NO uses viñetas, guiones, números, ni emojis.
3. Separa cada recomendación únicamente con un salto de línea.`;

    // Cambiamos a 1.5-flash que es más rápido y estable en el tier gratuito
    const response = await ai.models.generateContent({
      model: "gemini-3-flash",
      contents: prompt
    });

    const text = response.text;
    console.log("✅ Gemini respondió correctamente");

    // Limpiamos la respuesta de cualquier símbolo extraño que la IA intente meter
    return text
      .split("\n")
      .map(t => t.replace(/^[\*\-\d\.\s]+/, "").trim()) // Limpia asteriscos o números iniciales
      .filter(t => t !== "")
      .slice(0, 3);

  } catch (error) {
    console.error("❌ Error Gemini:", error.message);
    // Fallback dinámico según el puntaje si la IA falla
    if (score > 70) {
      return ["Sigue prefiriendo la bicicleta", "Mantén el consumo bajo", "Inspira a otros estudiantes"];
    }
    return ["Reduce el uso de plástico", "Usa transporte sostenible", "Optimiza el consumo energético"];
  }
};

module.exports = { generarRecomendaciones };