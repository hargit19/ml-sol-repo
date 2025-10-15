const express = require("express");
const router = express.Router();
const predictedDataController = require("../controllers/predictedDataController");
const authController = require("../controllers/authController");

router.use(authController.protect);

router.get("/get-predicted-data", predictedDataController.getLastPredictedData);
router.get("/get-all-predicted-data", predictedDataController.getAllData);
router.delete("/delete-predicted-data/:dataId", predictedDataController.deleteData);
router.post("/generate-data-id", predictedDataController.generateDataId);
router.get("/download-predicted-data", predictedDataController.getDownloadedExcel);

router.get("/get-validated-data", predictedDataController.getValidatedData);
router.post("/save-actual-data", predictedDataController.saveActualData);

router.get("/get-penalties", predictedDataController.getPenalties);
router.post("/save-penalties", predictedDataController.savePenalties);

module.exports = router;
