const express = require("express");
const apiRouter = express.Router();
// const dataSchema = require("../schemas/dataSchema");
const axios = require("axios");

// Example data
// const exampleData = [
//   { id: 1, name: "Item 1" },
//   { id: 2, name: "Item 2" },
//   // Add more data as needed
// ];

// Get all items
apiRouter.get("/rates", async (req, res) => {
  const base = req.query.base;

  const response = await axios.get(
    "https://api.coinbase.com/v2/exchange-rates"
  );
  const rates = response.data.data.rates;
  //   console.log(response.data.data.rates);
  //   res.json(response.data.data.rates);
  const filteredRates =
    base === "fiat" ? filterFiat(rates) : filterCrypto(rates);
  console.log(filteredRates);
  res.json(filteredRates);
});

const filterFiat = (rates) => {
  return {
    USD: {
      BTC: rates.BTC * rates.USD,
      DOGE: rates.DOGE * rates.USD,
      ETH: rates.ETH * rates.USD,
    },
    SGD: {
      BTC: parseFloat((rates.BTC * (rates.USD / rates.SGD)).toPrecision(2)), // do this
      DOGE: rates.DOGE * (rates.USD / rates.SGD),
      ETH: rates.ETH * (rates.USD / rates.SGD),
    },
    EUR: {
      BTC: rates.BTC * (rates.USD / rates.EUR),
      DOGE: rates.DOGE * (rates.USD / rates.EUR),
      ETH: rates.ETH * (rates.USD / rates.EUR),
    },
  };
};

const filterCrypto = (rates) => {
  return {
    USD: rates.USD,
    SGD: rates.SGD,
    EUR: rates.EUR,
  };
};

module.exports = apiRouter;
