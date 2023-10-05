const Emails = require("../models/emails.js");
// const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    const msg = {
      to: process.env.EMAIL,
      from: process.env.EMAIL,
      subject: "New Email From EasyPick",
      text: `You've received a new email from ${firstName} ${lastName}.\nSender email: ${email}.\n\nMessage:\n${message}`,
      html: `
    <p>You've received a new email from ${firstName} ${lastName}.</p>
    <p>Sender email: ${email}.</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent");
      res.status(200).json(savedEmail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteEmails = async (req, res) => {
  try {
    const _id = req.params.id;
    await Emails.findByIdAndDelete(_id);
    res.status(200).json({ message: "Email deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json("Couldn't delete email: ", error.message);
  }
};

module.exports = {
  getEmails,
  postEmails,
  deleteEmails,
};
