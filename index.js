const express = require("express");
const otpgen = require("otp-generator");
const nodemailer = require("nodemailer");

const app = express();
const port = 4600;

//~NodeMailer Config
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rakeshibm909@gmail.com",
    pass: "huda qfjy geeu tqqe",
  },
});

//? Function to generate OTP
function generateOTP() {
  return otpgen.generate(5, {
    length: 4,
    specialChars: false,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
  });
}
let OTP = generateOTP();

//^ Function to send OTP via email
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

//TODO Route to send OTP via email
app.get("/sendmail", async (req, res) => {
  const recipient = "venomboy039@gmail.com"; // Change recipient as needed
  const success = await sendOTPByEmail(OTP, recipient);

  
  if (success) {
    res.send("OTP sent successfully!");
  
      
  } else {
    res.status(500).send("Failed to send OTP.");
  }
});

app.get('/:otp',(req,res)=>{
  const oneTimePass=+req.params.otp
  if (oneTimePass==OTP) {
    res.status(200).send('OTP Verified successfully')
  } else {
    res.status(401).send('Wrong Otp')
  }
})

// Start the server
app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
