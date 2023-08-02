const Users = require("../models/users.js");
const bcrypt = require("bcrypt");

// Function to post a new user to the database
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = await req.body;
    // Create a new user document using the Users model
    const newUser = new Users({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    //Using bcrypt to hash the password before saving the use into the database
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    // Save the new user document to the database
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    // Handle any errors that occurred during the process
    console.log(error);
    res.status(500).json({ "Error creating user": error.message });
  }
};

const checkIfUserExists = async (req, res) => {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MINUTES = 5;
  try {
    const { email, password } = await req.body;
    const user = await Users.findOne({ email: email });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is temporarily locked out due to failed login attempts
    if (
      user.loginAttempts >= MAX_LOGIN_ATTEMPTS &&
      Date.now() - user.lockUntil < 0
    ) {
      const remainingTime = Math.ceil(
        (user.lockUntil - Date.now()) / 1000 / 60
      );
      console.log(`Account locked. Try again after ${remainingTime} minutes.`);
      return res.status(401).json({
        message: `Account locked. Try again after ${remainingTime} minutes.`,
      });
    }

    // Compare entered password with the stored hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Reset the failed login attempts
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();

      console.log("The user already exists");
      return res.status(200).json({ message: "The user already exists" });
    } else {
      // Increment the failed login attempts and set lockout if the threshold is reached
      user.loginAttempts++;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(
          Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
        ); // Lock for the specified duration
      }
      await user.save();

      console.log("The password is incorrect");
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("An error occurred while checking the user", error);
    return res.status(500).json({ "Internal server error": error.message });
  }
};

//function to GET all users
const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    console.log("Users successfully retrieved: ", users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Couldn't get users: ", error.message);
  }
};

module.exports = { createUser, getUsers, checkIfUserExists };
