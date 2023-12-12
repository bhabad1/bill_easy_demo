const mongoose = require("mongoose");
const { Schema } = mongoose;
const db = require("../config/db");

const order = new Schema({
  id: { type: Number, unique: true, index: true },
  userId: { type: Number },
  totalAmount: { type: Number },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
});

const orderModel = db.model("orders", order);

module.exports = orderModel;
