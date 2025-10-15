const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");
const sendSms = require("../utils/sms");
const Payment = require("../models/paymentModel");
const Plan = require("../models/planModel");
const Header = require("../models/headerModel");

function signToken(id) {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    address: req.body.address,
  });
  console.log(newUser);

  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser, url).sendWelcome();

  const free_plan = await Plan.findOne({ plan_price: 0 });

  await Payment.create({ userId: newUser._id, currentPlanId: free_plan._id });
  // await Payment.create({ userId: newUser.id});
  await Header.create({ userId: newUser._id });

  //  if(newUser.verifiedEmail && newUser.verifiedPhone) {
  //   // 1) Create token
  // createSendToken(newUser, 201, res);
// }

createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

// Logout function
exports.logout = catchAsync(async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password! Please log in again.", 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1) verify token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.SECRET);
    console.log("decoded", decoded);

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("The user belonging to this token does no longer exist.", 401));
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("User recently changed password! Please log in again.", 401));
    }

    console.log("i am here above");

    // THERE IS A LOGGED IN USER
    res.status(200).json({ status: "success", data: { user: currentUser, message: "Valid user logged in" } });
  } else {
    console.log("i am here below");
    res.status(200).json({ status: "success", data: { user: null, message: "No logged in user" } });
  }
});

exports.restrictAccess = catchAsync(async (req, res, next) => {
  if (!req.user.verifiedEmail || !req.user.verifiedPhone) {
    return next(new AppError("Please verify your email and phone number to access this feature", 403));
  }
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
};

exports.sendVerificationEmail = catchAsync(async (req, res, next) => {
  const forceSend = req.query.forceSend === "true" ? true : false;
  if (req.user.verifiedEmail) {
    return next(new AppError("Email is already verified", 400));
  }

  if (!forceSend && req.user.emailVerificationCode && req.user.emailVerificationCodeExpires > Date.now()) {
    return next(new AppError("Verification code has already been sent.", 400));
  }

  // 1) Create token
  const verificationCode = req.user.createEmailVerificationCode();
  await req.user.save({ validateBeforeSave: false });

  // 2) Send it to user's email
  await new Email(req.user, undefined, verificationCode).sendVerificationEmail(verificationCode);

  res.status(200).json({
    status: "success",
    message: "Verification code sent to email!",
    data: {
      phone: req.user.phone,
      verifiedPhone: req.user.verifiedPhone,
    },
  });
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Check if verification code still exists
  if (!req.user.emailVerificationCode || req.user.emailVerificationCodeExpires < Date.now()) {
    return next(new AppError("Verification code has expired.", 400));
  }
  // 2) Compare the verification codes
  if (!req.user.correctCode(req.body.emailVerificationCode, req.user.emailVerificationCode)) {
    return next(new AppError("Invalid verification code.", 400));
  }
  req.user.verifiedEmail = true;
  req.user.emailVerificationCode = undefined;
  req.user.emailVerificationCodeExpires = undefined;
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email verified successfully!",
    data: {
      phone: req.user.phone,
      verifiedPhone: req.user.verifiedPhone,
    },
  });
});

exports.sendVerificationSMS = catchAsync(async (req, res, next) => {
  const forceSend = req.query.forceSend === "true" ? true : false;
  if (req.user.verifiedPhone) {
    return next(new AppError("Phone is already verified", 400));
  }

  if (!forceSend && req.user.smsVerificationCode && req.user.smsVerificationCodeExpires > Date.now()) {
    return next(new AppError("Verification code has already been sent.", 400));
  }
  // 1) Create token
  const verificationCode = req.user.createSmsVerificationCode();
  await req.user.save({ validateBeforeSave: false });

  // 2) Send sms to user's phone
  await sendSms(verificationCode, req.user);

  res.status(200).json({
    status: "success",
    message: "Verification code sent to phone number",
  });
});

exports.verifySMS = catchAsync(async (req, res, next) => {
  // 1) Check if verification code still exists
  if (!req.user.smsVerificationCode || req.user.smsVerificationCodeExpires < Date.now()) {
    return next(new AppError("Verification code has expired.", 400));
  }
  // 2) Compare the verification codes
  if (!req.user.correctCode(req.body.smsVerificationCode, req.user.smsVerificationCode)) {
    return next(new AppError("Invalid verification code.", 400));
  }
  req.user.verifiedPhone = true;
  req.user.smsVerificationCode = undefined;
  req.user.smsVerificationCodeExpires = undefined;
  await req.user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Phone number verified successfully!",
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();
  } catch (err) {
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email. Try again later!"), 500);
  }

  res.status(200).json({
    status: "success",
    message: "Password reset link sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({ passwordResetToken: hashedToken });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (user.passwordResetExpires < Date.now()) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Token has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user -> Done in userModel
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
