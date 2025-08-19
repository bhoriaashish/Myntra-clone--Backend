const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel')
const {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  testController,
} = require("../controller/authController");




// REGISTER route
router.post("/register",registerController)
// LOGIN  route
router.post("/login",loginController)
//FORGOT PASSWORD route
router.post("/forgot-password", forgotPasswordController);
//Reset PASSWORD
router.post("/reset-password",resetPasswordController)
//TEST CONTROLLER
router.get("/test",testController)

module.exports = router