const dotenv = require("dotenv").config();

const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user; // attach user data to the request
    next();
  });
};

module.exports = authenticateJWT;
