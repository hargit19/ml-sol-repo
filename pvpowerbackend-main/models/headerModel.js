// For File headers and settings
const mongoose = require("mongoose");

const headerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Header must belong to a user"],
  },
  isDateTimeSameColumn: {
    type: Boolean,
  },
  mode: {
    type: String,
  },
  dateFormat: {
    type: String,
  },
  dataStartRow: {
    type: Number,
  },
  columnHeaders: {
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    airTemp: {
      type: String,
    },
    windSpeed: {
      type: String,
    },
    RH: {
      type: String,
    },
    solarRadiation: {
      type: String,
    },
    passiveCloudCover: {
      type: String,
    },
    dewPtTemp: {
      type: String,
    },
    rainfall: {
      type: String,
    },
    pvPower: {
      type: String,
    },
  },
});

// isDateTimeSameColumn: false,
//   dateFormat: "",
//   mode: "",
//   columnHeaders: {
//     date: "",
//     time: "",
//     airTemp: "",
//     windSpeed: "",
//     RH: "",
//     solarRadiation: "",
//     passiveCloudCover: "",
//     dewPtTemp: "",
//     rainfall: "",
//     pvPower: "",
//   },
//   dataStartRow: 1,

const Header = mongoose.model("Header", headerSchema);

module.exports = Header;
