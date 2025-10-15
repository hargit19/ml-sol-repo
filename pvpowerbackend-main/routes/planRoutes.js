const express = require("express");
const router = express.Router();
const planController = require("./../controllers/planController");
const authController = require("./../controllers/authController");

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.get("/get-all-plans", planController.getAllPlans);

// Protect all routes after this middleware
// router.use(authController.restrictTo("admin"));

router.get("/get-plan/:id", planController.getPlan);
router.post("/create-plan", planController.createPlan);
router.patch("/update-plan/:id", planController.updatePlan);
router.delete("/delete-plan/:id", planController.deletePlan);

module.exports = router;
