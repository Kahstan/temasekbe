const express = require("express");
const exchangeRateAPI = require("./routers/exchangeRateAPI");

const app = express();
const port = 5001;
const connectDB = require("./db/db");
const uri = "mongodb://localhost:27017/exchangeRatesDB";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB(uri);

require("./persistentStoreUpdater");

// #task 1
app.use("/api", exchangeRateAPI);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
