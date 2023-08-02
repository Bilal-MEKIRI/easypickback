const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  checkIfUserExists,
} = require("../controllers/users.js");

router.post("/users", createUser);
router.get("/users", getUsers);
router.post("/users/check", checkIfUserExists);

module.exports = router;
