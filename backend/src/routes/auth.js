// backend/src/routes/auth.js

const router = require('express').Router();
const User   = require('../models/User');
const bcrypt = require('bcryptjs');

// ─── REGISTER ───────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    role    = 'client',  // Trebuie să se potrivească cu CHECK constraint-ul din DB
    phone   = '',
    address = ''
  } = req.body;

  try {
    await User.create({ name, email, password, role, phone, address });
    res.status(201).json({ msg: 'Înregistrare reușită!' });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ msg: 'Date invalide' });
    }

    const valid = await bcrypt.compare(password, user.Password);
    if (!valid) {
      return res.status(401).json({ msg: 'Date invalide' });
    }

    // Returnăm toate câmpurile relevante, inclusiv telefon și adresă
    res.json({
      user: {
        id:      user.UserId,
        name:    user.Name,
        role:    user.Role,
        phone:   user.Phone,
        address: user.Address
      }
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
