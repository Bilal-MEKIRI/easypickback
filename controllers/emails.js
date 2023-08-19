const Emails = require("../models/emails.js");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const getEmails = async (req, res) => {
  try {
    const emails = await Emails.find();
    console.log(emails);
    res.status(200).json(emails);
  } catch (error) {
    console.error(error);
    res.status(500).json("Couldn't get emails: ", error.message);
  }
};

const postEmails = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { firstName, lastName, email, message } = req.body;
    const newEmail = new Emails({
      firstName: firstName,
      lastName: lastName,
      email: email,
      message: message,
    });
    const savedEmail = await newEmail.save();

    // Create a transporter using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send an email notification
    const mailOptions = {
      from: process.env.EMAIL, // Replace with the recipient's email
      to: process.env.EMAIL, // Replace with your email
      subject: "New Email From EasyPick",
      html: `
    <p>You've received a new email from ${firstName} ${lastName}.</p>
    <p>Sender email: ${email}.</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json(savedEmail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmails,
  postEmails,
};
