const jwt = require("jsonwebtoken");

// JWT Config
const jwtSecret = process.env.JWT || require("../config/keys").jwt;

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // Check for token
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // add user from token
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid." });
  }
}

module.exports = auth;
