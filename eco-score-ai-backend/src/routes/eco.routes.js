const express = require("express");
const router = express.Router();
const { evaluate, getStats } = require("../controllers/eco.controller");
router.get("/stats", getStats);
router.post("/evaluate", evaluate);

module.exports = router;