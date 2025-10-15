const nodemailer = require("nodemailer");
const pug = require("pug");

module.exports = class Email {
  // Constructor Review
  constructor(user, url, verificationCode) {
    // Potential Improvements and Validation
    if (!user || !user.email) {
      throw new Error('Invalid user object: Email is required');
    }

    this.to = user.email;
    // Name parsing can be more robust
    this.firstName = user.name ? user.name.split(" ")[0] : 'User';
    this.url = url || ''; // Prevent undefined
    this.verificationCode = verificationCode || '';
    this.from = "ML-sol <dependencies.mlsol@gmail.com>"; // Proper from format
    this.query = user.query || '';
  }

  // Transport Method Review
  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail', // Recommended for Gmail
      auth: {
        user: "dependencies.mlsol@gmail.com",
        pass: process.env.MY_EMAIL_PASSWORD || "gtfpyoqhqjtpqqwi" // Use environment variable
      },
      // Improved TLS settings
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    });
  }

  // Send Method with Comprehensive Error Handling
  async send(template, subject) {
    // Validate inputs
    if (!template) {
      throw new Error('Email template is required');
    }
    if (!subject) {
      throw new Error('Email subject is required');
    }

    try {
      // Robust path resolution
      const templatePath = `${__dirname}/../views/email/${template}.pug`;
      
      // Render HTML based on pug template
      const html = pug.renderFile(templatePath, {
        firstName: this.firstName,
        url: this.url,
        verificationCode: this.verificationCode,
        subject,
        query: this.query,
      });

      // Comprehensive email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        // Optional: add replyTo or other headers if needed
        // replyTo: 'another-email@example.com'
      };

      // Send email with timeout and retry logic
      const info = await this.newTransport().sendMail(mailOptions);
      
      console.log(`Email sent successfully:
        - To: ${this.to}
        - Template: ${template}
        - Message ID: ${info.messageId}
      `);

      return info;
    } catch (error) {
      // Detailed error logging
      console.error(`Email Sending Error:
        - Template: ${template}
        - Recipient: ${this.to}
        - Error Code: ${error.code}
        - Error Message: ${error.message}
        - Full Error: ${JSON.stringify(error, null, 2)}
      `);

      // Rethrow or handle specific error types
      if (error.code === 'EAUTH') {
        throw new Error('Authentication failed. Check your app password and 2FA settings.');
      }

      throw error;
    }
  }

  // Specific Email Methods
  async sendWelcome() {
    return this.send("welcome", "Welcome to ML-Sol! Good to see you");
  }

  async sendPasswordReset() {
    return this.send("passwordReset", "Your password reset token (valid for only 10 minutes)");
  }

  async sendVerificationEmail() {
    return this.send("welcome", "Your code for email verification (valid for only 10 minutes)");
  }

  async sendQuery() {
    return this.send("query", "Your query has been received!");
  }
};