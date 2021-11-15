var express = require("express");
var router = express.Router();
const productModel = require("../models/product");
const verifyToken = require("../lib/jwt.decode");
const userModel = require("../models/user");
const orderModel = require("../models/order");
const mongoose = require("mongoose");

router.post("/order", verifyToken, async function (req, res, next) {
  try {
    let status = true;
    const customername = req.auth.firstname;
    const { product, discount } = req.body;
    let amount = 0;
    let totalPrice = 0;
    let newproduct = [];
    for (let index = 0; index < product.length; index++) {
      const element = product[index];
      let temp = await productModel.findOne({
        productName: element.productName,
      });
      totalPrice = totalPrice + element.amount * temp.price;
      amount = amount + element.amount;
      if (temp.amount < element.amount) {
        status = false;
        break;
      }
      newproduct.push({
        _id: temp._id,
        productName: temp.productName,
        amount: temp.amount,
        amountreq: element.amount,
      });

      // console.log(amount);
      // console.log(element.productName);
      // console.log(newproduct[index]);
      // console.log(newproduct[index]);
      // Object.assign(newproductobj, newproduct[index]);
      // Object.assign(newproductobj, {amountreq: element.amount });
      // console.log(newproduct[index])
    }
    if (!status) {
      return res.status(400).send({
        msg: "can't create order",
        success: false,
      });
    }
    console.log(amount);
    console.log(newproduct);
    console.log(totalPrice);
    //const priceaftercal = product.price - product.price * (discount / 100);
    let newOrder = new orderModel({
      product: newproduct,
      customerName: customername,
      amount: amount,
      discount: discount,
      priceTotal: totalPrice,
      priceTotalafterCal: totalPrice - totalPrice * (discount / 100),
    });
    let order = await newOrder.save();
    for (let index = 0; index < newproduct.length; index++) {
      console.log(newproduct[index]);
      console.log(newproduct[index].amount);
      console.log(newproduct[index].amount - product[index].amount);
      await productModel.updateOne(
        {
          productName: newproduct[index].productName,
        },
        {
          $set: {
            amount: newproduct[index].amount - product[index].amount,
          },
        }
      );
    }
    console.log(order);
    // await productModel.updateOne(
    //   {
    //     productName: productName,
    //   }, // เงื่อนไขในการ Update
    //   {
    //     $set: {
    //       amount: product.amount - amount,
    //     },
    //   } // ค่าที่จะ Update
    // );
    return res.status(200).send({
      order,
      msg: "create success",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({
      msg: "create fail " + err,
      success: false,
    });
  }
});

router.get("/order", verifyToken, async function (req, res, next) {
  try {
    let order = await orderModel.find();
    return res.status(200).send({
      data: order,
      msg: "read success",
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      data: error,
      msg: "read fail",
      success: false,
    });
  }
});

router.get(
  "/order/:productName/:customerName",
  verifyToken,
  async function (req, res, next) {
    try {
      const productName = req.params.productName;
      const customerName = req.params.customerName;
      let order = await orderModel.find({
        "product.productName": productName,
        customerName: customerName,
      });
      console.log(order[0].product);
      return res.status(200).send({
        data: order,
        msg: "read success",
        success: true,
      });
    } catch (error) {
      return res.status(400).send({
        data: error,
        msg: "read fail",
        success: false,
      });
    }
  }
);

router.get("/order/:id", verifyToken, async function (req, res, next) {
  try {
    const id = req.params.id;
    let order = await orderModel.findById(id);
    console.log(order.product);
    return res.status(200).send({
      data: order,
      msg: "read success",
      success: true,
    });
  } catch (error) {
    return res.status(400).send({
      data: error,
      msg: "read fail",
      success: false,
    });
  }
});

router.delete("/order", verifyToken, async function (req, res, next) {
  try {
    const id  = req.body.id;
    console.log(id)
    let order = await orderModel.findById(id);
    console.log(order);
    let productlist = order.product;
    for (let index = 0; index < productlist.length; index++) {
      const element = productlist[index];
      console.log(element);
      let product = await productModel.findOne({
        productName: element.productName,
      });
      console.log(product);
      console.log(product.amount);
      console.log(element.amountreq);

      await productModel.updateOne({
        productName: element.productName
      },{
        $set: { 
          amount: product.amount + element.amountreq
        },
      })
    }
    await orderModel.deleteOne({
      _id: id,
    });
    return res.status(200).send({
      msg: "delete success",
      success: true,
    });
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      msg: "delete fail " + err,
      success: false,
    });
  }
});

module.exports = router;
