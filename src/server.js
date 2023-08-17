const express = require("express");
const apiRouter = require("./routers/apiRouter"); // Correct path to apiRouter
const app = express();
const port = 5001;

// Middleware
app.use(express.json());

// Use the API router
app.use("/api", apiRouter); // Use the apiRouter

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
