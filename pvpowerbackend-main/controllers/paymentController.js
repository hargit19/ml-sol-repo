const catchAsync = require("../utils/catchAsync");
const Plan = require("../models/planModel");
const Payment = require("../models/paymentModel");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const razorpayInstance = require("../utils/razorpayInstance");

exports.getApiKeys = catchAsync(async (req, res, next) => {
  const keyId = process.env.RAZOR_PAY_KEY_ID;
  res.status(200).json({
    status: "success",
    keyId,
  });
});

exports.getPayment = catchAsync(async (req, res, next) => {
  // const userPayment = await Payment.findOne({ userId: req.params.id });
  const userPayment = await Payment.findOne({ userId: req.params.id }).populate(["userId", "currentPlanId"]);
  console.log(userPayment);

  if (!userPayment) {
    return next(new AppError("User payment not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      userPayment,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { plan_id } = req.body;
  console.log("plan_id", plan_id);
  
  const fetchedPlan = await Plan.findById(plan_id);
  console.log("fetchd plan", fetchedPlan);

  if (!fetchedPlan) {
    return next(new AppError("Plan not found", 404));
  }

  const response = await razorpayInstance.orders.create({
    amount: fetchedPlan.plan_price * 100,
    currency: "INR",
  });

  console.log("response", response);
  
  const userPayment = await Payment.findOne({ userId: req.user.id });

  if (!userPayment) {
    return next(new AppError("User payment not found", 404));
  }

  userPayment.tempOrderId = response.id;
  userPayment.tempPlanId = plan_id;

  await userPayment.save();

  res.status(200).json({
    status: "success",
    orderId: response.id,
    fetchedPlan,
  });
});

exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const userPayment = await Payment.findOne({ userId: req.user.id });

  if (!userPayment) {
    return next(new AppError("User payment not found", 404));
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_KEY_SECRET)
    .update(userPayment.tempOrderId + "|" + razorpay_payment_id, "utf8")
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError("Invalid signature", 400));
  }

  userPayment.payment.push({
    razorpay_payment_id,
    razorpay_signature,
    razorpay_order_id,
    createdDate: new Date(),
  });

  userPayment.currentPlanId = userPayment.tempPlanId;

  userPayment.tempPlanId = undefined;
  userPayment.tempOrderId = undefined;

  const fetchedPlan = await Plan.findById(userPayment.currentPlanId);

  const currentDate = new Date();

  if (userPayment.planExpiryDate && currentDate < userPayment.planExpiryDate) {
    userPayment.planExpiryDate = new Date(
      userPayment.planExpiryDate.getTime() + fetchedPlan.plan_duration * 24 * 60 * 60 * 1000
    );
  } else {
    userPayment.planStartDate = new Date();
    userPayment.planExpiryDate = new Date(Date.now() + fetchedPlan.plan_duration * 24 * 60 * 60 * 1000);
  }

  await userPayment.save();

  res.status(200).json({
    status: "success",
    message: "Payment verified",
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const userPayment = await Payment.findOne({ userId: req.body.userId });
  razorpayInstance.payments.refund(userPayment.payment[0].razorpay_payment_id);

  userPayment.currentPlanId = undefined;
  userPayment.planExpiryDate = new Date();

  await userPayment.save();

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
  });
});

exports.updatePayment = catchAsync(async (req, res, next) => {
  const userPayment = await Payment.findOne({ userId: req.body.userId });

  const fetchedPlan = await Plan.findOne({ plan_price: 0 });

  userPayment.currentPlanId = fetchedPlan._id;

  userPayment.planStartDate = new Date();

  userPayment.planExpiryDate = new Date(Date.now() + fetchedPlan.plan_duration * 24 * 60 * 60 * 1000);

  const updatedPayment = await userPayment.save();

  res.status(200).json({
    status: "success",
    message: "Payment updated successfully",
    updatedPayment,
  });
});

exports.getAllPayments = catchAsync(async (req, res, next) => {
  console.log("this function is calledd");
  const payments = await Payment.find().populate(["userId", "currentPlanId"]);
  console.log("payments from backend", payments);

  res.status(200).json({
    status: "success",
    results: payments.length,
    data: {
      payments,
    },
  });
});
