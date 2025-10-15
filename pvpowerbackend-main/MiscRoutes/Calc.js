require("dotenv").config();
const express = require("express");
const authController = require("../controllers/authController");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.use(authController.protect);

router.get(
  "/close-calc",
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    user.isCalcDone = null;
    await user.save();
    res.sendStatus(200);
  })
);

router.post(
  "/",
  catchAsync(async (req, res) => {
    const isCalcDone = req.body.isCalcDone;
    const user = await User.findById(req.user.id);
    user.isCalcDone = isCalcDone;
    await user.save();
    res.status(200).send(user.isCalcDone);
  })
);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).send(user.isCalcDone);
  })
);

module.exports = router;
