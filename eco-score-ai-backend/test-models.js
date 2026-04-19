const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
  try {
    const models = await genAI.listModels();

    console.log("MODELOS DISPONIBLES:");
    models.forEach(m => {
      console.log("-", m.name, "| methods:", m.supportedGenerationMethods);
    });

  } catch (e) {
    console.error("Error listando modelos:", e.message);
  }
})();