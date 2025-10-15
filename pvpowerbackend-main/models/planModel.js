const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  plan_displayName: { type: String, required: true, unique: true },
  plan_price: { type: Number, required: true },
  plan_duration: { type: Number, required: true }, // in days
  plan_run_limit_per_day: { type: Number, required: true },
  plan_description: { type: String, required: true },
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
