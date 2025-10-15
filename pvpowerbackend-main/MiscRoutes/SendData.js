//this file saves the user uploaded data to mongodb for now

const express = require("express");
const User = require("../models/userModel");
const sendData = express.Router();

sendData.post("/", async (req, res) => {
  const { data, _id } = req.body;
  try {
    const user = await User.findById(_id);

    const date = new Date();
    user.data.push({ date, data: [...data] });
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

sendData.get("/", async (req, res) => {
  const _id = "64785a3317dca4bcad7dd274";
  try {
    const user = await User.findById(_id);
    const data = user.data[3].data;
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

sendData.post("/clear", async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findById(_id);
    user.data = [];
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = sendData;
