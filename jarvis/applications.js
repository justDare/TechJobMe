/*
 * Tests for the express server applications api
 */

// JWT Config
const jwtSecret = process.env.JWT || require('../config/keys').jwt;
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

  it('Edit application', done => {
    chai
      .request(app)
      .post('/api/applications/edit')
      .set('x-auth-token', token)
      .send({
        _id: appId,
        field: ['name', 'Some company edit']
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.equals('Some company edit');
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

  describe('Group actions', () => {
    // populate db with 2 applications for group tests
    before(done => {
      chai
        .request(app)
        .post('/api/applications')
        .set('x-auth-token', token)
        .send({
          name: 'Some company 1',
          position: 'intern',
          stage: 'offer',
          user_id: test_id
        })
        .end((err, res) => {
          appId = res.body._id;
          chai
            .request(app)
            .post('/api/applications')
            .set('x-auth-token', token)
            .send({
              name: 'Some company 2',
              position: 'intern',
              stage: 'offer',
              user_id: test_id
            })
            .end((err, res) => {
              done();
            });
        });
    });

    it('Get all applications', done => {
      chai
        .request(app)
        .get('/api/applications/' + test_id)
        .set('x-auth-token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });

    it('Delete all applications', done => {
      chai
        .request(app)
        .delete('/api/applications/delete-all/' + test_id)
        .set('x-auth-token', token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.equals(2);
          done();
        });
    });
  });
});
