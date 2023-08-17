const express = require("express");
const router = express.Router();
// const dataSchema = require("../schemas/dataSchema");
const axios = require("axios");

router.get("/historical-rates", async (req, res) => {
  const baseCurrency = req.params.base_currency;
  const targetCurrency = req.params.target_currency;
  const start = parseInt(req.query.start);
  const end = parseInt(req.query.end);
});

module.exports = router;
