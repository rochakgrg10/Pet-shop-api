const jwt = require("jsonwebtoken");
const { BUYER, ADMIN } = require("../constant/role");

function checkAuthentication(req, res, next) {
  console.log("Checked authorization");
  res.json("authorized");
  next();
}

module.exports = checkAuthentication;
