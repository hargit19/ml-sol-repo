const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Payment must belong to a user"],
    unique: true,
  },
  currentPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    default: undefined,
  },
  planStartDate: { type: Date, default: new Date() },
  planExpiryDate: { type: Date, default: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  payment: [
    {
      razorpay_payment_id: { type: String, default: undefined },
      razorpay_signature: { type: String, default: undefined },
      razorpay_order_id: { type: String, default: undefined },
      createdDate: { type: Date, default: undefined },
    },
  ],
  tempPlanId: { type: String, default: undefined },
  tempOrderId: { type: String, default: undefined },
});

// paymentSchema.pre("save", async function (next) {
//   if (this.isModified("payment")) {
//     return next();
//   }
//   next();
// });

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
