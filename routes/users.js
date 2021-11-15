var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require('../lib/jwt.decode');
const mongoose = require("mongoose");
/* GET users listing. */
router.post("/user", async function (req, res, next) {
  try {
    let { username, password, firstname, lastname, email } = req.body;
    let hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username: username,
      password: hashPassword,
      firstname: firstname,
      lastname: lastname,
      email: email,
    });
    let user = await newUser.save();
    return res.status(200).send({
      data: user,
      msg: "create success",
      success: true,
    });
  } catch (error) {
    console.log(error)
    return res.status(400).send({
      msg: "create fail" + error,
      success: false,
    });
  }
});

router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    let user = await userModel.findOne({
      username: username,
    });
    if (!user) {
      console.log('username invalid');
      return res.status(400).send({
        msg: "login fail",
        success: false,
      });
    }
    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      console.log('password invalid');
      return res.status(400).send({
        msg: "login fail",
        success: false,
      });
    }

    let token = await jwt.sign({
      firstname: user.firstname,
      lastname: user.lastname,
      username: username
    }, process.env.JWT_KEY)
    // คำสั่งที่ใช้ในการสร้าง token คือ jwt.sign
    // ช่องแรกคือข้อมูลที่ใช้ในการเข้ารหัส, ช่อง 2 คือ รหัสลับที่ใช้ในการถอดรหัสข้อมูล

    return res.status(200).json({
      msg: "login success",
      success: true,
      token: token,
    });
  } catch (error) {
    return res.status(400).send({
      msg: "login fail",
      success: false,
    });
  }
});

router.get("/user", verifyToken,  async function (req, res, next) {
  try {
    let user = await userModel.find();
    return res.status(200).send({
      data: user,
      msg: "get success",
      success: true,
      authdecode: req.auth
    });
  } catch (error) {
    return res.status(400).send({
      msg: "get fail",
      success: false,
    });
  }
});

router.put("/user", async function (req, res, next) {
  try {
    const id = req.body._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        msg: "id invalid",
        success: false,
      });
    }

    await userModel.updateOne(
      {
        _id: id,
      }, // เงื่อนไขในการ Update
      {
        $set: {
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email
        },
      } // ค่าที่จะ Update
    );
    let user = await userModel.findById(id);
    return res.status(200).send({
      data: user,
      msg: "update success",
      success: true,
    });
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      msg: "update fail" + err,
      success: false,
    });
  }
});

module.exports = router;
