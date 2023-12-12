const mongoose = require("mongoose");
const { Schema } = mongoose;

const db = require("../config/db");

const user = new Schema({
  id: { type: Number, index: true },
  username: { type: String, unique: true, index: true },
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
});

const userModel = db.model("users", user);

module.exports = userModel;
