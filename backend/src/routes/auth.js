const express = require("express");
const jwt = require("jsonwebtoken");
const { findUserByEmail, compareHash } = require("../services/userService");
const router = express.Router();

// RUTA PUBLICĂ: LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !compareHash(password, user.passwordHash)) {
    return res.status(401).json({ msg: "Email sau parolă invalidă." });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
  res.json({ user, token });
});

module.exports = router;
