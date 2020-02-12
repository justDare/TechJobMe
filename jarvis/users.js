/*
 * Tests for the express server user api
 */

// JWT Config
const jwtSecret = process.env.JWT;
const jwt = require('jsonwebtoken');

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const { expect } = chai;
chai.use(chaiHttp);

// User model
const User = require('../models/User');

setTimeout(function() {
  // do some setup
  var newUser = new User({
    name: 'test_user',
    email: 'test_user@gmail.com',
    password: 'test_password'
  });

  var token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: 60 });

  // Tests for api/users
  describe('Test the users api!', () => {
    it('Deny edit route without token', done => {
      chai
        .request(app)
        .post('/api/users/edit')
        .send({
          _id: newUser._id,
          field: ['name', 'test_name_update']
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    it('Deny delete route without token', done => {
      chai
        .request(app)
        .delete('/api/users/delete/' + newUser._id)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });

    // Register user with token before tests run
    it('Register user', done => {
      chai
        .request(app)
        .post('/api/users')
        .send({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          passwordCheck: newUser.password
        })
        .end(function(err, res) {
          newUser._id = res.body.user._id;
          done();
        });
    });

    it('Edit user name', done => {
      chai
        .request(app)
        .post('/api/users/edit')
        .set('x-auth-token', token)
        .send({
          _id: newUser._id,
          field: ['name', 'test_name_update']
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.name).to.equals('test_name_update');
          done();
        });
    });

    it('Edit user email', done => {
      chai
        .request(app)
        .post('/api/users/edit')
        .set('x-auth-token', token)
        .send({
          _id: newUser._id,
          field: ['email', 'test_email_update']
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.email).to.equals('test_email_update');
          done();
        });
    });

    it('Delete a user', done => {
      chai
        .request(app)
        .delete('/api/users/delete/' + newUser._id)
        .set('x-auth-token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equals(true);
          done();
        });
    });
  });

  run();
}, 2000);
