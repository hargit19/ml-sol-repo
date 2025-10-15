const catchAsync = require("../utils/catchAsync");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const { finished } = require("stream/promises");
const AppError = require("../utils/appError");

const folderPath = "../Data";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date;
}

exports.getFile = catchAsync(async (req, res, next) => {
  const historyFileName = `results_${req.params.locationCode}+history_.csv`;
  
  const forecastFileName = `results_${req.params.locationCode}+nextday_.csv`;
 
  const historyFilePath = path.join(__dirname, folderPath, historyFileName);
  console.log("historyFilePath", historyFilePath);
  const forecastFilePath = path.join(__dirname, folderPath, forecastFileName);
  console.log("forecastFilePath", forecastFilePath);

  const results = [];

  if (!fs.existsSync(historyFilePath) || !fs.existsSync(forecastFilePath)) {
    return next(new AppError("File not found", 404));
  }

  const historyStream = fs
    .createReadStream(historyFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data));

  await finished(historyStream);

  const forecastStream = fs
    .createReadStream(forecastFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("error", (error) => {
      console.log(error);
    });

  await finished(forecastStream);

  const date = results.map((result) => formatDate(result.date));
  const Actual = results.map((result) => result.actual);
  const RandomForest = results.map((result) => result.RF);
  const LSTM = results.map((result) => result.LSTM);
  const OurModel = results.map((result) => result.Our_Model);

  res.status(200).json({
    status: "success",
    data: {
      date,
      Actual,
      RandomForest,
      LSTM,
      OurModel,
    },
  });
});
