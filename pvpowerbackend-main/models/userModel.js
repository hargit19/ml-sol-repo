const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  username: {
    type: String,
    required: [true, "Please provide your username"],
    unique: true,
  },
  address: String,
  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    unique: true,
    validate: [validator.isMobilePhone, "Please provide a valid phone number"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: { type: String },
  passwordResetExpires: {
    type: Date,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  verifiedPhone: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  emailVerificationCode: { type: String },
  emailVerificationCodeExpires: { type: Date },
  smsVerificationCode: { type: String },
  smsVerificationCodeExpires: { type: Date },
  modelRuns: {
    type: Number,
    default: 0,
  },
  defaultMapPointer: {
    type: {
      lat: { type: Number },
      long: { type: Number },
    },
    default: { lat: 28.7041, long: 77.1025 },
  },
  PredictedData: [
    {
      date: {
        type: Date,
      },
      quick: [
        {
          date: { type: String },
          time: { type: String },
          PredictedPV: { type: Number },
        },
      ],
      premium: [
        {
          date: { type: String },
          time: { type: String },
          PredictedPV: { type: Number },
        },
      ],
      actual: [
        {
          date: { type: String },
          time: { type: String },
          ActualPV: { type: Number },
        },
      ],
    },
  ],
  penalties: [
    {
      date: { type: Date },
      penaltyCost: [
        { state: { type: String }, quickPenaltySum: { type: Number }, premiumPenaltySum: { type: Number } },
      ],
    },
  ],
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }

  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.email) {
    update.verifiedEmail = false;
  }
  if (update.phone) {
    update.verifiedPhone = false;
  }
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createEmailVerificationCode = function () {
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  this.emailVerificationCode = crypto.createHash("sha256").update(verificationCode).digest("hex");
  this.emailVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  return verificationCode;
};

userSchema.methods.createSmsVerificationCode = function () {
  const verificationCode = crypto.randomInt(100000, 999999).toString();

  this.smsVerificationCode = crypto.createHash("sha256").update(verificationCode).digest("hex");
  this.smsVerificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  return verificationCode;
};

userSchema.methods.correctCode = function (candidateCode, userCode) {
  const hashedVerificationCode = crypto.createHash("sha256").update(candidateCode).digest("hex");
  return hashedVerificationCode === userCode;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
