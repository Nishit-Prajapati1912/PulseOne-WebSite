// routes/auth.js - Authentication Controller Routing Engine
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/signup
// @desc    Register new secure ecosystem user account
router.post('/signup', async (req, res) => {
  const { name, email, role, password } = req.body;

  try {
    // 1. Check for complete parameter presence
    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'All registration parameters are mandatory fields.' });
    }

    // 2. Scan database collection to isolate duplicate accounts
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ message: 'An account with that professional email already exists.' });
    }

    // 3. Cryptographically secure password string structure
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Instantiation mapping
    user = new User({
      name,
      email,
      role,
      password: hashedPassword
    });

    // 5. Explicitly commit to live MongoDB collection
    await user.save();
    console.log(`[Database Record Created Successfully]: Account registered for ${email}`);

    // 6. Sign authorization key string package
    const payload = { user: { id: user.id, role: user.role } };
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_pulseone';

    jwt.sign(payload, jwtSecret, { expiresIn: '24h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    });

  } catch (error) {
    // This outputs exhaustive system telemetry diagnostics to your active Nodemon panel terminal
    console.error(' [CRITICAL BACKEND COLLISION DETECTED]:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});







router.post('/login', async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password required.'
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: cleanEmail
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials.'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials.'
      });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'pulseone_secret',
      {
        expiresIn: '24h'
      },
      (err, token) => {

        if (err) {
          throw err;
        }

        res.status(200).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });

      }
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Server error.',
      error: error.message
    });

  }

});

module.exports = router;