const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { resetModelRunsJob } = require('./utils/scheduledTasks.js');

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  // Make sure to stop the job before exiting
  resetModelRunsJob.stop();
  process.exit(1);
});

dotenv.config();
const app = require("./app");

const [baseUri, queryParams] = process.env.URI.split("?");
const connectionString = `${baseUri}${process.env.MONGO_DB_NAME}?${queryParams}`.replace(
  "<password>",
  process.env.MONGO_DB_PASSWORD
);

mongoose.set("strictQuery", false);
mongoose.connect(connectionString).then(() => console.log("Connected to Mongo database!"));

resetModelRunsJob.start();
console.log('Scheduled job for resetting modelRuns is active');

const port = process.env.PORT || 5002;
const server = app.listen(port, () => {
  console.log(`App listening on port: ${port}!`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  // Stop the scheduled job before closing
  resetModelRunsJob.stop();
  server.close(() => {
    process.exit(1);
  });
});

// Add handler for graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  resetModelRunsJob.stop();
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

// Add handler for Ctrl+C (SIGINT)
process.on('SIGINT', () => {
  console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
  resetModelRunsJob.stop();
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});