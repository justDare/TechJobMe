const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// JWT Config
const jwtSecret = process.env.JWT || require('../../config/keys').jwt;

// User Model
const User = require('../../models/User');

// @route POST api/users
// @desc  Register new User
// @access Public
router.post('/', (req, res) => {
  const { name, email, password, passwordCheck } = req.body;

  // Simple evalidation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields.' });
  }

  if (password !== passwordCheck) {
    return res.status(400).json({ msg: 'Passwords do not match.' });
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

// @route GET api/users/edit
// @desc  Edit A User data field
// @access Private
router.post('/edit', auth, async (req, res) => {
  const { _id, field } = req.body;

  // Get field name and value from request
  const data = { [field[0]]: field[1] };

  // If password edit, re-hash before sending to DB
  if (field[0] === 'password') {
    bcrypt.hash(field[1], 10).then(function(hash) {
      data['password'] = hash;
      User.findOneAndUpdate({ _id: _id }, data, { new: true }, (err, doc) => {
        if (err) throw err;
        res.json(doc);
      });
    });
  } else {
    User.findOneAndUpdate(
      { _id: _id },
      data,
      {
        new: true,
        projection: { _id: true, name: true, email: true, register_date: true }
      },
      (err, doc) => {
        if (err) throw err;
        res.json(doc);
      }
    );
  }
});

router.delete('/delete/:id', auth, (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then(user => user.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
