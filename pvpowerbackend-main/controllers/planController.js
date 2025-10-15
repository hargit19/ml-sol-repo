const Plan = require("../models/planModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllPlans = catchAsync(async (req, res, next) => {
  const plans = await Plan.find();

  res.status(200).json({
    status: "success",
    results: plans.length,
    data: {
      plans,
    },
  });
});

exports.getPlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return next(new AppError("No plan found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    plan,
  });
});

exports.createPlan = catchAsync(async (req, res, next) => {
  const newPlan = await Plan.create(req.body);

  res.status(201).json({
    status: "success",
    plan: newPlan,
  });
});

exports.updatePlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!plan) {
    return next(new AppError("No plan found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    plan,
  });
});

exports.deletePlan = catchAsync(async (req, res, next) => {
  const plan = await Plan.findByIdAndDelete(req.params.id);

  if (!plan) {
    return next(new AppError("No plan found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
