const mongoose = require("mongoose");
const product = mongoose.Schema({
  productName: { type: String },
  price: { type: Number },
  amount: { type: Number },
  img: { type: String },
  unit_price: { type: String }
});

module.exports = mongoose.model("product", product);
