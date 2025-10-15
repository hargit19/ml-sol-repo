const Header = require("../models/headerModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getHeader = catchAsync(async (req, res, next) => {
  const header = await Header.findOne({ userId: req.user._id });
  console.log(header);
  if (!header) {
    return next(new AppError("No header found for this user", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      header,
    },
  });
});

exports.createHeader = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const newHeader = await Header.create({ ...req.body, userId });
  console.log(`new header :  ${newHeader}`);

  res.status(201).json({
    status: "success",
    data: {
      header: newHeader,
    },
  });
});

exports.updateHeader = catchAsync(async (req, res, next) => {
  const header = await Header.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!header) {
    return next(new AppError("No header found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      header,
    },
  });
});
