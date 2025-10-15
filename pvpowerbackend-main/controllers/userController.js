const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Email = require("../utils/email");

const filterObj = (obj, ...notAllowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!notAllowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

function removeUnUpdatedFields(obj, user) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (obj[el] !== user[el]) newObj[el] = obj[el];
  });
  return newObj;
}

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates. Please use /updateMyPassword.", 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name");

  // filter things that are not getting updated
  const newFilteredBody = removeUnUpdatedFields(filteredBody, req.user);

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, newFilteredBody, {
    new: true,
    runValidators: true,
  });

  console.log("updatedUser", updatedUser);

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.sendQueryMail = catchAsync(async (req, res, next) => {
  const { name, email, subject, query } = req.body;

  const user = { name, email, query };
  // 2) Send it to the user
  await new Email(user, subject).sendQuery();

  res.status(200).json({
    status: "success",
    message: "Query sent successfully!",
  });
});

exports.getSavedLocations = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: "success",
    data: {
      lat: user.defaultMapPointer.lat,
      long: user.defaultMapPointer.long,
    },
  });
});

exports.saveLocation = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    defaultMapPointer: { lat: req.body.lat, long: req.body.long },
  });

  res.status(200).json({
    status: "success",
    data: {
      lat: user.defaultMapPointer.lat,
      long: user.defaultMapPointer.long,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    active: false,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    active: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
