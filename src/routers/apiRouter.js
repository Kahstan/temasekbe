const express = require("express");
const apiRouter = express.Router();
// const dataSchema = require("../schemas/dataSchema");
const axios = require("axios");

// Example data
const exampleData = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  // Add more data as needed
];

// Get all items
apiRouter.get("/exchange-rates", async (req, res) => {
  const base = req.query.base;
  try {
    const res = await axios.get("https://api.coinbase.com/v2/exchange-rates");
    const rates = res.data.data.rates;
    console.log(rates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

module.exports = apiRouter;
