const nodemailer = require("nodemailer");
const env = require ('dotenv')
async function sendEmail(subject, text, recipient) {
  try {
    // Create a transporter using your email service's SMTP settings
//     const subject = "Test Email";
// const text = "This is a test email sent from Node.js using nodemailer.";
// const recipient = "vedant2000joshi@gmail.com";

const transporter = nodemailer.createTransport({
    	host: "smtp.gmail.com",
    	port: 587,
    	secure: false,
    	auth: {
    		user: process.env.EMAIL_ID,
    		pass: process.env.EMAIL_PASSWORD,
    	},
    });

    // Define the email options 
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: recipient,
      subject: subject,
      text: text
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return "Email Sent"
  } catch (error) {
    console.error("Error sending email:", error);
    return "Error In Sending Mail"
  }
}

// Usage


// sendEmail(emailSubject, emailText, recipientEmail);

module.exports={sendEmail}