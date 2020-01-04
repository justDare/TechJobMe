const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// JWT Config
const jwtSecret = process.env.JWT || require('../../config/keys').jwt;

// Application Model
const User = require('../../models/User');

// @route GET api/auth
// @desc  Authenticate User
// @access Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Simple evalidation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields.' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist.' });
    }

    // Validate Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      jwt.sign(
        { id: user.id },
        jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              _id: user.id,
              name: user.name,
              email: user.email
            }
          });
        }
      );
    });
  });
});

// @route GET api/auth/user
// @desc  Get user data
// @access Private
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

module.exports = router;
