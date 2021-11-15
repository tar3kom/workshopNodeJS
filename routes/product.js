var express = require("express");
var router = express.Router();
const productModel = require("../models/product");
const mongoose = require("mongoose");

router.post("/product", async function (req, res, next) {
  try {
    const { productName, price, amount, img, unit_price } = req.body;
    let newProduct = new productModel({
      productName: productName,
      price: price,
      amount: amount,
      img: img,
      unit_price: unit_price,
    });
    let product = await newProduct.save();
    return res.status(200).send({
      data: product,
      msg: "create success",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "create fail",
      success: false,
    });
  }
});

router.get("/product", async function (req, res, next) {
  try {
    let product = await productModel.find({});
    return res.status(200).send({
      data: product,
      msg: "read success",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "read fail",
      success: false,
    });
  }
});

router.get("/product/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    let product = await productModel.findById(id);
    return res.status(200).send({
      data: product,
      msg: "read success",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "read fail",
      success: false,
    });
  }
});

router.get("/product/byname/:name", async function (req, res, next) {
  try {
    const name = req.params.name;
    console.log(name);
    let product = await productModel.find({
      productName: new RegExp(name, "i"),
    });
    return res.status(200).send({
      data: product,
      msg: "read success",
      success: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      msg: "read failed " + error,
      success: true,
    });
  }
});

router.put("/product", async function (req, res, next) {
  try {
    const id = req.body.id;
    const price = req.body.price;
    const productName = req.body.productName;
    const amount = req.body.amount;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        msg: "id invalid",
        success: false,
      });
    }
    await productModel.updateOne(
      {
        _id: id,
      }, // เงื่อนไขในการ Update
      {
        $set: {
          productName: productName,
          price: price,
          amount: amount,
        },
      } // ค่าที่จะ Update
    );
    let product = await productModel.findById(id);
    return res.status(200).send({
      data: product,
      msg: "update success",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "update fail",
      success: false,
    });
  }
});

router.delete("/product", async function (req, res, next) {
  try {
    let id = req.body.id;
    await productModel.deleteOne({
      _id: id,
    });
    let product = await productModel.find();
    return res.status(200).send({
      data: product,
      msg: "delete success",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "delete fail",
      success: false,
    });
  }
});

module.exports = router;
