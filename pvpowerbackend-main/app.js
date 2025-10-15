const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");
const userRouter = require("./routes/userRoutes.js");
const planRouter = require("./routes/planRoutes.js");
const paymentRouter = require("./routes/paymentRoutes.js");
const fileRouter = require("./routes/fileRoutes.js");
const headerRouter = require("./routes/headerRoutes.js");
const dataRouter = require("./routes/dataRoutes.js");
const forecast = require("./MiscRoutes/forecast.js");
const calc = require("./MiscRoutes/Calc.js");
const sendData = require("./MiscRoutes/SendData.js");
const sidebar = require("./MiscRoutes/sidebar.js");


const app = express();

// 1) GLOBAL MIDDLEWARES
// Implement CORS
const corsOptions = {
  origin: [process.env.CLIENT_URL1, process.env.CLIENT_URL2, process.env.CLIENT_URL3],
  credentials: true,
};
app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Trust Proxy
// app.enable("trust proxy");

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 10 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: true, limit: "1000mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Schedule task to run every day at midnight

// 2) ROUTES
app.use("/api/files", fileRouter);
app.use("/api/users", userRouter);
app.use("/api/plans", planRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/header", headerRouter);
app.use("/api/data", dataRouter);

app.use("/api/api", sidebar);
app.use("/api/api/forecast", forecast);
app.use("/api/api/calc-state", calc);
app.use("/api/api/set-data", sendData); //saves user's uploaded data to mongodb


app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
