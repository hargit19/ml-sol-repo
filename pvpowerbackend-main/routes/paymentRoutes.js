const express = require("express");
const paymentController = require("../controllers/paymentController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get("/get-payment/:id", paymentController.getPayment);
router.post("/update-payment", paymentController.updatePayment);
router.use(authController.protect);
router.use(authController.restrictAccess);

router.get("/get-api-keys", paymentController.getApiKeys);

router.post("/create-order", paymentController.createOrder);
router.post("/verify-payment", paymentController.verifyPayment);

router.post("/cancel-order", paymentController.cancelOrder);

router.use(authController.restrictTo("admin"));

router.get("/get-all-payments", paymentController.getAllPayments);

module.exports = router;
