const cron = require('node-cron');
const User = require('../models/userModel');// Adjust the path to where your User model is located

// Schedule a task to run at midnight every day
// The cron expression '0 0 * * *' means:
// - 0 minutes
// - 0 hours (midnight)
// - any day of the month
// - any month
// - any day of the week
const resetModelRunsJob = cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running scheduled job: Resetting modelRuns for all users');
    
    // Update all users, setting modelRuns back to 0
    const result = await User.updateMany({}, { modelRuns: 0 });
    
    console.log(`Reset modelRuns for ${result.modifiedCount} users`);
  } catch (error) {
    console.error('Error resetting modelRuns:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC" // Adjust to your preferred timezone
});

// Export the job so you can start/stop it elsewhere in your application if needed
module.exports = {
  resetModelRunsJob
};