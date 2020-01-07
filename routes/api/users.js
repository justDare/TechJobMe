const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Config
const jwtSecret = process.env.JWT || require('../../config/keys').jwt;

// Application Model
const User = require('../../models/User');

// @route GET api/users
// @desc  Register new User
// @access Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Simple evalidation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields.' });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) {
      return res.status(400).json({ msg: 'User already exists.' });
    }

    const newUser = new User({
      name,
      email,
      password
    });

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
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
  });
});

module.exports = router;
