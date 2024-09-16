const jwt = require("jsonwebtoken");

function generateAccessToken({ uid }) {
  return jwt.sign({ uid: uid }, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = { generateAccessToken };
