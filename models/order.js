const mongoose = require("mongoose");
const order = mongoose.Schema({
  product: { type : Array },
  customerName: { type: String },
  amount: { type: Number },
  discount: { type: Number },
  priceTotal: { type: Number },
  priceTotalafterCal: { type: Number }
});

module.exports = mongoose.model("order", order);
