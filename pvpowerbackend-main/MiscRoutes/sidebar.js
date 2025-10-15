const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/validate/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const data = await User.findById(userId);
    res.status(200).send(data.PredictedData[data.PredictedData.length - 1]);
  } catch (error) {
    console.log(error);
  }
}); //ok for now

router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await User.findById(userId);
    res.status(200).send(history.PredictedData);
  } catch (error) {
    console.log(error);
  }
}); //ok for now

router.delete("/delete/:userId", async (req, res) => {
  const { userId } = req.params;
  const { data } = req.query;
  try {
    const deleteData = await User.findById(userId);
    deleteData.PredictedData = deleteData.PredictedData.filter((elem) => elem._id.toString() !== data);
    await deleteData.save();
    res.status(200).send(deleteData.PredictedData);
  } catch (error) {
    console.log(error);
  }
}); //ok for now

module.exports = router;
