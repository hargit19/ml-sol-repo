const TwilioSDK = require("twilio");
const twilioClient = TwilioSDK(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSms(verificationCode, user) {
  // const numberWithCountryCode = "+91" + user.phone; // Assuming user.phone is an Indian phone number
  await twilioClient.messages.create({
    body: `Hi ${user.name}! your verification code is ${verificationCode}`,
    from: process.env.TWILIO_NO,
    to: process.env.TWILIO_VERIFIED_NO,
  });
}

module.exports = sendSms;
