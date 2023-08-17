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

  const cryptoResponse = await axios.get(
    "https://api.coinbase.com/v2/exchange-rates?currency=BTC"
  );
  const cryptoRates = cryptoResponse.data.data.rates;
  //   console.log(response.data.data.rates);
  //   res.json(response.data.data.rates);
  const filteredRates =
    base === "fiat" ? filterFiat(rates) : filterCrypto(cryptoRates);
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
      DOGE: parseFloat((rates.DOGE * (rates.USD / rates.SGD)).toFixed(2)),
      ETH: parseFloat((rates.ETH * (rates.USD / rates.SGD)).toPrecision(2)),
    },
    EUR: {
      BTC: parseFloat((rates.BTC * (rates.USD / rates.EUR)).toPrecision(2)),
      DOGE: parseFloat((rates.DOGE * (rates.USD / rates.EUR)).toFixed(2)),
      ETH: parseFloat((rates.ETH * (rates.USD / rates.EUR)).toPrecision(2)),
    },
  };
};

const filterCrypto = (rates) => {
  return {
    BTC: {
      USD: parseFloat(rates.USD).toFixed(2),
      SGD: parseFloat(rates.SGD).toFixed(2),
      EUR: parseFloat(rates.EUR).toFixed(2),
    },
    DOGE: {
      USD: parseFloat(rates.USD / rates.DOGE).toPrecision(2),
      SGD: parseFloat(rates.SGD / rates.DOGE).toPrecision(2),
      EUR: parseFloat(rates.EUR / rates.DOGE).toPrecision(2),
    },
    ETH: {
      USD: parseFloat(rates.USD / rates.ETH).toFixed(2),
      SGD: parseFloat(rates.SGD / rates.ETH).toFixed(2),
      EUR: parseFloat(rates.EUR / rates.ETH).toFixed(2),
    },
  };
};

module.exports = apiRouter;
