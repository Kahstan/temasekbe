const express = require("express");
const apiRouter = express.Router();
// const dataSchema = require("../schemas/dataSchema");
const axios = require("axios");

const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:27017/exchangeRatesDB";

// Get all items
apiRouter.get("/rates", async (req, res) => {
  const base = req.query.base;

  try {
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
  } catch (error) {
    console.log("failed to fetch exchange rates", error);
    res.status(500).json({ error: "Failed to fetch exchange Rates" });
  }
});

// filtering fiat rates
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

// historical rates
apiRouter.get("/historical-rates", async (req, res) => {
  const baseCurrency = req.query.base_currency.toUpperCase();
  const targetCurrency = req.query.target_currency.toUpperCase();
  const start = parseInt(req.query.start);
  // const end = req.query.end ? parseInt(req.query.end) : Date.now();

  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log("historicalRatesAPI triggered");
    const db = client.db("exchangeRatesDB");
    const collection = db.collection("rates");

    const query = {
      "timestamp.start": { $gte: start },
    };

    const results = await collection.find(query).toArray();

    const formattedResults = results.map((item) => ({
      timestamp: item.timestamp.start,
      value:
        parseFloat(item.rates.rates[targetCurrency]) *
        parseFloat(item.rates.rates[baseCurrency]),
    }));

    // console.log(results, baseCurrency, targetCurrency);
    res.json({ formattedResults });
  } catch (error) {
    res
      .status(500)
      .json({ error: "failed to fetch from historical exchange rates" });
  }
});

module.exports = apiRouter;
