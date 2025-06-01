// backend/src/services/userService.js
const { User } = require("../models");        // adaptă după cum exportezi modelul
const bcrypt = require("bcrypt");

async function findUserByEmail(email) {
  return await User.findOne({ where: { email } });
}

function compareHash(plainPwd, hash) {
  return bcrypt.compareSync(plainPwd, hash);
}

module.exports = { findUserByEmail, compareHash };
