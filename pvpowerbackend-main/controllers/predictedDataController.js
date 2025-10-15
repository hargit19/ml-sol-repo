const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const ExcelJS = require("exceljs");
const stream = require("stream"); // Add this line

function addModelData(worksheet, modelName, data) {
  // Add headers to the worksheet for the specific model
  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Time", key: "time", width: 15 },
    { header: `${modelName} PredictedPV`, key: "PredictedPV", width: 15 },
  ];
  // Add data rows to the worksheet for the specific model
  data.forEach((dataItem) => {
    dataItem[modelName].forEach((item) => {
      worksheet.addRow({
        date: item.date,
        time: item.time,
        PredictedPV: item.PredictedPV,
      });
    });
  });
}

exports.getLastPredictedData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const predictedData = user.PredictedData;

  const lastForecast = predictedData.slice(-1);

  res.status(200).json({
    status: "success",
    data: {
      predictedData: lastForecast[0],
    },
  });
});

exports.getAllData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const predictedData = user.PredictedData;

  res.status(200).json({
    status: "success",
    data: {
      predictedData,
    },
  });
});

exports.deleteData = catchAsync(async (req, res, next) => {
  const dataId = req.params.dataId;
  const user = await User.findById(req.user.id);
  const predictedData = user.PredictedData;

  const updatedPredictedData = predictedData.filter((data) => data._id.toString() !== dataId);

  user.PredictedData = updatedPredictedData;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      predictedData: updatedPredictedData,
    },
  });
});

exports.generateDataId = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const { forecastDate } = req.body;

  let forecastId = null;

  user.PredictedData = user.PredictedData.map((data) => {
    if (data.date.getTime() === new Date(forecastDate).getTime()) {
      data.quick = [];
      data.premium = [];
      forecastId = data._id;
      return data;
    }
    return data;
  });

  if (!forecastId) {
    const temp = {
      date: new Date(forecastDate),
      quick: [],
      premium: [],
    };
    user.PredictedData.push(temp);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      predictedDataId: forecastId ? forecastId : user.PredictedData[user.PredictedData.length - 1]._id,
    },
  });
});

exports.getDownloadedExcel = catchAsync(async (req, res, next) => {
  const { date } = req.query;
  const user = await User.findById(req.user.id);
  const predictedData = user.PredictedData;

  if (predictedData.length === 0) {
    return res.status(404).send("Data not found for the specified date and time");
  }

  const filteredData = predictedData.filter((data) => data.date.getTime() === new Date(date).getTime());

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();

  // Call the function for each model you want to include
  addModelData(workbook.addWorksheet("QuickModelData"), "quick", filteredData);
  addModelData(workbook.addWorksheet("PremiumModelData"), "premium", filteredData);
  // ... Add more models as needed ...

  // Set the response headers for Excel file download
  const streamBuffers = new stream.PassThrough();

  // Pipe the workbook data to the stream
  workbook.xlsx
    .write(streamBuffers)
    .then(() => {
      console.log("Workbook data has been written to stream.");

      // Set the appropriate response headers for downloading the file
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename=${req.user.username}_predicted_data.xlsx`);

      // Pipe the stream to the response object to send the file
      streamBuffers.pipe(res, { end: true }); // Ensure the stream ends
      console.log("Excel file has been sent to the client.");
    })
    .catch((error) => {
      console.log("Error generating Excel file:", error);
      res.status(500).send("Error generating Excel file");
    });
});

exports.getPenalties = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      penalties: user.penalties,
    },
  });
});

exports.savePenalties = catchAsync(async (req, res, next) => {
  const { date, penaltyCost } = req.body;
  const user = await User.findById(req.user.id);

  const temp = {
    date: new Date(date),
    penaltyCost,
  };

  const penalties = user.penalties || [];

  // update if same date data exist
  let isUpdated = false;
  penalties.forEach((penalty) => {
    if (penalty.date.getTime() === new Date(date).getTime()) {
      penalty.penaltyCost = penaltyCost;
      isUpdated = true;
    }
  });

  if (!isUpdated) {
    penalties.push(temp);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      penalties: user.penalties,
    },
  });
});

exports.getValidatedData = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(user);


  res.status(200).json({
    status: "success",
    data: {
      validationDataHistory: user.PredictedData,
    },
  });
});

exports.saveActualData = catchAsync(async (req, res, next) => {
  const { actualData } = req.body;
  const user = await User.findById(req.user.id);

  const newArr = [];

  const [YYYY, MM, DD] = actualData[0].date.split(" ")[0].split("-");
  const date = `${MM}/${DD}/${YYYY}`;

  actualData.forEach((data) => {
    // extract time from data.date and store it in time as HH:MM
    const time = data.date.split(" ")[1].slice(0, 5);

    // store date as MM/DD/YYYY from YYYY-MM-DD

    newArr.push({
      date,
      time,
      ActualPV: data.solarRadiation,
    });
  });

  user.PredictedData = user.PredictedData.map((data) => {
    // check if date is same as actual data not time in ms
    const A = new Date(data.date);
    const B = new Date(newArr[0].date);
    B.setHours(0, 0, 0, 0);

    if (A.getTime() === B.getTime()) {
      data.actual = newArr;
    }
    return data;
  });

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      predictedData: user.PredictedData,
    },
  });
});
