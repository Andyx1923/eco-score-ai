const Eco = require("../models/eco.model");
const { calcularEcoScore } = require("../services/score.service");
const { generarRecomendaciones } = require("../services/ai.service");
const { registrarEnSolana } = require("../services/solana.service");

const evaluate = async (req, res) => {
  try {
    const data = req.body;

    if (!data.transporte || !data.plastico || !data.energia) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const score = calcularEcoScore(data);

   let recomendaciones;
    try {
      const promiseIA = generarRecomendaciones(data, score);
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout de IA")), 6000) // ⏳ Subimos a 6 segundos
      );

      recomendaciones = await Promise.race([promiseIA, timeout]);
    } catch (e) {
      console.log("🤖 IA falló o tardó demasiado, usando fallback dinámico");
      // El fallback ya se maneja en ai.service.js, pero por seguridad:
      recomendaciones = [
        "Optimiza tu transporte diario",
        "Evita plásticos de un solo uso",
        "Apaga luces que no necesites"
      ];
    }

    // 🔥 Solana con timeout para no bloquear la respuesta
    let txHash = null;
    try {
      const promiseSolana = registrarEnSolana();
      const timeoutSolana = new Promise((resolve) =>
        setTimeout(() => resolve(null), 2500)
      );
      txHash = await Promise.race([promiseSolana, timeoutSolana]);
      if (!txHash) {
        console.log("⏱️ Solana tardó demasiado o falló, respondiendo sin txHash");
      }
    } catch (e) {
      console.log("⛔ Solana falló:", e);
      txHash = null;
    }

    // 💾 guardado en Mongo (no bloquea respuesta)
    Eco.create({ ...data, score, recomendaciones, txHash }).catch(() => {});

    // 🚀 respuesta final
    res.json({
      score,
      recomendaciones,
      txHash
    });

  } catch (error) {
    console.error("Error en evaluate:", error);
    res.status(500).json({ error: "Error en evaluación" });
  }
};

const getStats = async (req, res) => {
  try {
    const total = await Eco.countDocuments();

    if (total === 0) {
      return res.json({
        promedioScore: 0,
        totalUsuarios: 0,
        transporte: { auto: 0, bus: 0, bicicleta: 0 },
        plastico: { alto: 0, medio: 0 },
        mensaje: "Aún no hay datos suficientes.",
        pais: "Ecuador"
      });
    }

    // 📊 PROMEDIO
    const avg = await Eco.aggregate([
      { $group: { _id: null, promedio: { $avg: "$score" } } }
    ]);

    const promedioScore = Math.round(avg[0].promedio);

    // 🚗 TRANSPORTE (AQUÍ ESTÁ LA CLAVE)
    const auto = await Eco.countDocuments({ transporte: "auto" });
    const bus = await Eco.countDocuments({ transporte: "bus" });
    const bicicleta = await Eco.countDocuments({ transporte: "bicicleta" });

    // 🧴 PLÁSTICO
    const plasticoAlto = await Eco.countDocuments({ plastico: "alto" });
    const plasticoMedio = await Eco.countDocuments({ plastico: "medio" });
const plasticoBajo = await Eco.countDocuments({ plastico: "bajo" });
    const porcentajePlastico = Math.round((plasticoAlto / total) * 100);

    // 🧠 MENSAJE
    let mensaje = "";

    if (porcentajePlastico > 50) {
      mensaje = "⚠️ Alto uso de plástico detectado en estudiantes de UTMACH.";
    } else if (promedioScore > 70) {
      mensaje = "🌱 Buen nivel ambiental en la comunidad.";
    } else {
      mensaje = "🚨 Se recomienda mejorar hábitos ambientales.";
    }

    // 🚀 RESPUESTA CORRECTA PARA CHARTS
    res.json({
      promedioScore,
      totalUsuarios: total,
      mensaje,
      pais: "Ecuador",

      transporte: {
        auto,
        bus,
        bicicleta
      },

      plastico: {
        alto: plasticoAlto,
        medio: plasticoMedio,
        bajo: plasticoBajo
      }
    });

  } catch (error) {
    console.error("Error stats:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};

module.exports = {
  evaluate,
  getStats
};