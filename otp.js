const express = require("express");
const otpgen = require("otp-generator");
const nodemailer = require("nodemailer");
require('dotenv').config()

const app = express();
const port = 4600;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rakeshibm909@gmail.com",
    pass: process.env.emailPass,
  },
});

// Object to store OTP and its creation time
const otpData = {};

// Function to generate OTP
function generateOTP() {
  return otpgen.generate(5, {
    length: 4,
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
}
let recipient = "";//"venomboy039@gmail.com"; // Change recipient as needed

// Function to send OTP via email
async function sendOTPByEmail(OTP, recipient) {
  try {
    const mail = {
      from: "rakeshibm909@gmail.com",
      to: recipient,
      subject: "Your OTP",
      text: "Your OTP is: " + OTP,
    };

    const info = await transporter.sendMail(mail);
    console.log("Mail sent:", info.response);
    return true;
  } catch (error) {
    console.error("Error sending mail:", error);
    return false;
  }
}

// Function to destroy OTP after 3 minutes
function destroyOTP(recipient) {
  setTimeout(() => {
    delete otpData[recipient];
    console.log(`OTP for ${recipient} destroyed.`);
  }, 2 * 60 * 1000); // 2 minutes in milliseconds
}

// Route to send OTP via email
app.get("/sendmail/:mail", async (req, res) => {
  recipient=req.params.mail;
  // Generate new OTP
  const OTP = generateOTP();

  // Save OTP and its creation time
  otpData[recipient] = {
    otp: OTP,
    timestamp: Date.now(),
  };

  // Send OTP via email
  const success = await sendOTPByEmail(OTP, recipient);

  if (success) {
    // Destroy OTP after 3 minutes
    destroyOTP(recipient);
    res.send(`${recipient} OTP sent successfully! It will expire in 2 minutes.`);
  } else {
    res.status(500).send("Failed to send OTP.");
  }
});

app.get('/:otp',(req,res)=>{
    const enteredOTP = +req.params.otp; // Convert the parameter to a number
    const storedOTP = otpData[recipient] ? otpData[recipient].otp : null; // Retrieve the stored OTP from the data store

    if (enteredOTP == storedOTP) {
        console.log(storedOTP)
        // If the entered OTP matches the stored OTP
        res.status(200).send('OTP Verified successfully');
    } else {
        // If the entered OTP does not match the stored OTP
        res.status(401).send('Wrong OTP');
    }
});


// Start the server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
