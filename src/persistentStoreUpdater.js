const axios = require("axios");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/exchangeRatesDB";

const updateExchangeRate = async (rates, start, end) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("exchangeRatesDB");
    const collection = db.collection("rates");
    console.log("DB connected");

    const insertData = {
      rates: rates,
      timestamp: {
        start: start,
        end: end,
      },
      currency: rates.currency,
    };

    await collection.insertOne(insertData);
  } finally {
    client.close();
  }
};

setInterval(async () => {
  try {
    const response = await axios.get(
      "https://api.coinbase.com/v2/exchange-rates"
    );
    const rates = response.data.data;
    const timestamp = response.data.data.timestamp;
    console.log(rates);
    const start = Date.now();
    const end = Date.now();

    await updateExchangeRate(rates, start, end);
    console.log("Exchange rates updated successfully.");
  } catch (error) {
    console.error("Failed to update exchange rate in the DB:", error);
  }
}, 600000); // Update every 10 minutes (600000 milliseconds)
