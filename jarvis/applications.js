/*
 * Tests for the express server applications api
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
const Application = require('../models/Application');

const test_id = '5e41bc4f05e31426402524b9';
var token = jwt.sign({ id: test_id }, jwtSecret, { expiresIn: 60 });
let appId;

describe('Test the applictions api!', () => {
  it('Deny add route without token', done => {
    chai
      .request(app)
      .post('/api/applications')
      .send({
        name: 'Some company',
        position: 'intern',
        stage: 'offer',
        user_id: test_id
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('Add application', done => {
    chai
      .request(app)
      .post('/api/applications')
      .set('x-auth-token', token)
      .send({
        name: 'Some company',
        position: 'intern',
        stage: 'offer',
        user_id: test_id
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        appId = res.body._id;
        done();
      });
  });

  it('Delete an application', done => {
    chai
      .request(app)
      .delete('/api/applications/delete-application/' + appId)
      .set('x-auth-token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.equals(true);
        done();
      });
  });
});
