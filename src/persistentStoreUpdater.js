const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:27017/exchangeRatesDB";

const updateExchangeRate = async (rates) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("exchangeRatesDB");
    const collection = db.collection("rates");
    console.log("DB connected");
    await collection.updateOne(
      { _id: "latest" },
      { $set: rates },
      { upsert: true }
    );
  } finally {
    client.close();
  }
};

setInterval(async () => {
  try {
    const response = await axios.get(
      "https://api.coinbase.com/v2/exchange-rates"
    );
    const rates = response.data.data.rates;
    await updateExchangeRate(rates);
  } catch (error) {
    console.error("Failed to update exchange rate in the DB");
  }
}, 600000);
// insert new data every 10 mins
