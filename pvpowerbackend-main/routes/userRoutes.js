const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Authentication routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get("/islogin", authController.isLoggedIn);

// Send query mail
router.post("/sendQuery", userController.sendQueryMail);

// Protect all routes after this middleware
router.use(authController.protect);

// SMS and Email Verification
router.get("/sendVerificationEmail", authController.sendVerificationEmail);
router.post("/verifyEmail", authController.verifyEmail);

router.get("/sendVerificationSMS", authController.sendVerificationSMS);
router.post("/verifySMS", authController.verifySMS);

// Restrict all routes after this middleware to verified users only
router.patch("/updateMe", userController.updateMe);
router.patch("/updateMyPassword", authController.updatePassword);

router.use(authController.restrictAccess);

router.get("/get-location", userController.getSavedLocations);
router.patch("/save-location", userController.saveLocation);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin"));

router.get("/get-all-users", userController.getAllUsers);
router.patch("/block-user/:id", userController.blockUser);
router.patch("/unblock-user/:id", userController.unblockUser);

module.exports = router;
