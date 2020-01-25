const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const nodemailer = require('nodemailer');

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

// @route POST api/auth/forgotPassword
// @desc Send password reset link
// @access Public
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  // Check db for user with email
  User.findOne({ email }).then(user => {
    if (user === null)
      res.status(403).send("No user's were found with that email.");
    else {
      // Generate token, update user and send email
      jwt.sign(
        { id: user.id },
        jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;

          User.update(
            { email: email },
            {
              resetPasswordToken: token,
              resetPasswordExpires: Date.now() + 3600000
            },
            (err, res) => {
              if (err) throw err;
            }
          );

          const userEmail =
            process.env.EMAIL_USER ||
            require('../../config/keys').email_username;
          const pass =
            process.env.EMAIL_PASS ||
            require('../../config/keys').email_password;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: userEmail,
              pass: pass
            },
            secure: false,
            tls: {
              // do not fail on invalid certs
              rejectUnauthorized: false
            }
          });

          const url = `http://${req.headers['x-forwarded-host']}/forgot-password/${token}`;

          const mailOptions = {
            from: userEmail,
            to: user.email,
            subject: 'Link To Reset Password',
            text:
              'You are recieving this because you (or someone else) have requested the reset of the passwor for your account at TechJobMe. \n\n' +
              'Please click on the following link, or paste this into your browser within one hour to complete your password reset: \n\n' +
              `${url}\n\n` +
              'If you did not recieve this request, contact TechJobMe right away.'
          };

          transporter.sendMail(mailOptions, (err, response) => {
            if (err) res.status(400).send('Error');
            else res.status(200).send('Recovery email sent!');
          });
        }
      );
    }
  });
});

// @route POST api/auth/check-reset-token/token
// @desc Check for authourized token on password reset
// @access Public
router.get('/check-reset-token/:token', (req, res) => {
  const token = req.params.token;

  User.findOne({ resetPasswordToken: token })
    .then(user => {
      if (user === null)
        res.status(400).send('Password reset link invalid or expired.');
      // Token expired
      if (user.resetPasswordExpires < Date.now())
        res.status(400).send('Password reset link invalid or expired.');
      // Token valid
      else
        res.status(200).send({
          _id: user._id
        });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// @route POST api/auth/update-password-via-email
// @desc Check for authourized token on password reset
// @access Public
router.post('/update-password-via-email', (req, res) => {
  const { token, _id, password } = req.body;
  console.log('body ' + req.body);
  bcrypt.hash(password, 10).then(function(hash) {
    User.findByIdAndUpdate(
      { _id: _id, resetPasswordToken: token },
      { password: hash, resetPasswordToken: '', resetPasswordExpires: null }
    )
      .then(response => {
        res.status(200).send('Password updated.');
      })
      .catch(err => {
        res.status(400).send('Error');
      });
  });
});

module.exports = router;
