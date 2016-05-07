const request = require('supertest');
const should = require('should');
const passportStub = require('passport-stub-es6');

describe('loading express', () => {
  let server;
  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
  });

  it('response to /', (done) => {
    request(server)
      .get('/')
      .expect(200)
      .end(done);
  });
});

describe('Testing unauthorized API attempts', () => {
  let server;

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
  });

  it('should respond with 302 (redirect) if authentication fails', (done) => {
    request(server)
      .get('/api/user/2')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.be.equal(302);
        done();
      });
  });

  it('should redirect to "/" if authentication fails', (done) => {
    request(server)
      .get('/api/user/2')
      .expect(302)
      .end((err, res) => {
        should.not.exist(err);
        res.header.location.should.be.equal('/');
        done();
      });
  });
});


describe('Testing Covey Creation, Editing, Retrieval', () => {
  let server;
  let coveyId;

  const newEvent = JSON.stringify({
    name: 'Test 1',
    location: 'My House',
    address: '96 ParkG Drive',
    city: 'Whatcha',
    state: 'CA',
    photoUrl: 'http://nope.com/bad.jpg',
    blurb: 'let them eat cake',
    userId: 2,
  });

  const updateEvent = JSON.stringify({
    name: 'Test Updated',
    location: 'Your House',
    address: '111 Park Lane',
    city: 'Whosit',
    state: 'CA',
    photoUrl: 'http://yep.com/good.jpg',
    blurb: 'bring me some ice cream',
    userId: 2,
  });

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
    passportStub.install(server);
    passportStub.login({ username: 'john.doe' });
  });

  it('response to POST /api/coveys', (done) => {
    request(server)
      .post('/api/coveys')
      .type('json')
      .send(newEvent)
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          coveyId = res.body.id;
          res.body.should.have.property('success', true);
          res.body.should.have.property('id');
          done();
        }
      });
  });

  it('response to GET /api/covey/*coveyId* for valid coveyId', (done) => {
    request(server)
      .get(`/api/covey/${coveyId}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.covey.should.have.property('location', 'My House');
          res.body.covey.should.have.property('id');
          done();
        }
      });
  });

  it(`response to PUT /api/coveys/${coveyId}`, (done) => {
    request(server)
      .put(`/api/coveys/${coveyId}`)
      .type('json')
      .send(updateEvent)
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.should.have.property('updatedCovey');
          res.body.updatedCovey.should.have.property('blurb', 'bring me some ice cream');
          done();
        }
      });
  });

  it(`GET /api/coveys/${coveyId} after PUT. location, city`, (done) => {
    request(server)
      .get(`/api/covey/${coveyId}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.covey.should.have.property('location', 'Your House');
          res.body.covey.should.have.property('city', 'Whosit');
          done();
        }
      });
  });

  it(`response to DELETE /api/coveys/${coveyId}`, (done) => {
    request(server)
      .del(`/api/coveys/${coveyId}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          coveyId = res.body.id;
          res.body.should.have.property('success', true);
          done();
        }
      });
  });

  // it('response to POST /api/signup', (done) => {
  //   request(server)
  //     .get('/api/signup')
  //     .expect(404)
  //     .end(done);
  // });
});

describe('Testing user api enpoints', () => {
  let server;
  let userId;
  const newUser = JSON.stringify({ email: 'fools@me.com',
    facebookId: 'xxXtestingIdXxx',
    firstName: 'Spider',
    lastName: 'Monkey',
    gender: 'male',
    photoUrl: 'http://something.com/nope.jpg',
  });

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
    passportStub.install(server);
    passportStub.login({ email: 'fools@me.com',
      facebookId: 'xxXtestingIdXxx',
      firstName: 'Spider',
      lastName: 'Monkey',
      gender: 'male',
      photoUrl: 'http://something.com/nope.jpg',
    });
  });

  it('response to POST /api/signup with no data should 404', (done) => {
    request(server)
      .post('/api/signup')
      .type('json')
      .send({ name: 'foo' })  // without a facebookId field, this will fail
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.should.have.property('errorMessage', 'no facebookId');
          done();
        }
      });
  });

  it('response to POST /api/signup with new user: status 201, success, id', (done) => {
    request(server)
      .post('/api/signup')
      .type('json')
      .send(newUser)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end((err, res) => {
        // Calling the end function will send the request
        // errs are generated from the expect statements and passed to end as the first argument
        if (err) {
          done(err);
        } else if (res) {
          userId = res.body.id;
          res.body.should.have.property('success', true);
          res.body.should.have.property('id');
          done();
        }
      });
  });

  it('should repond with 200 when when logged in and user exists', (done) => {
    request(server)
      .get(`/api/user/${userId}`)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.be.equal(200);
        res.body.user.should.have.property('facebookId', 'xxXtestingIdXxx');
        res.body.user.should.have.property('accessToken');
        res.body.user.should.have.property('refreshToken');
        done();
      });
  });

  it('response to DELETE /api/user/#userId# with userId should delete the user and respond with 200', (done) => {
    request(server)
      .del(`/api/user/${userId}`)
      .type('json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.should.have.property('success');
          done();
        }
      });
  });
});

