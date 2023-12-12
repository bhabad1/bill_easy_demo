const mongoose = require("mongoose");
const dbPath = "mongodb://localhost:27017/bill_easy_demo";

mongoose.connect(dbPath, { serverSelectionTimeoutMS: 5000 });
const db = mongoose.connection;
mongoose.connection.on("connected", () => {
  console.log("database is successfully connected");
});

module.exports = db;
