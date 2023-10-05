const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const {
  getEmails,
  postEmails,
  deleteEmails,
} = require("../controllers/emails.js");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

router.get("/emails", getEmails);
router.delete("/emails/:id", deleteEmails);
router.post(
  "/emails",
  [
    body("firstName").trim().escape(),
    body("lastName").trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("message").trim().escape(),
  ],
  limiter,
  postEmails
);

module.exports = router;
