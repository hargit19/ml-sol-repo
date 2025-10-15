const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get("/get-file/:locationCode", fileController.getFile);

module.exports = router;
