const express = require("express");
const router = express.Router();
const headerController = require("../controllers/headerController");
const authController = require("../controllers/authController");

router.use(authController.protect);
router.get("/get-header", headerController.getHeader);
router.post("/create-header", headerController.createHeader);
router.put("/update-header/:id", headerController.updateHeader);

module.exports = router;
