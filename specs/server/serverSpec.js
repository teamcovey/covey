const request = require('supertest');
const should = require('should');
const passportStub = require('passport-stub-es6');
const encrypt = require('../../server/routers/helpers/cookieEncryptionMiddleware');

let userId;
let userIdDecrypted;
let userId2;
let userId2Decrypted;
let coveyId;
let coveyId2;

const newEvent = {
  name: 'Test 1',
  location: 'My House',
  address: '96 ParkG Drive',
  city: 'Whatcha',
  state: 'CA',
  photoUrl: 'http://nope.com/bad.jpg',
  blurb: 'let them eat cake',
};

const updateEvent = JSON.stringify({
  name: 'Test Updated',
  location: 'Your House',
  address: '111 Park Lane',
  city: 'Whosit',
  state: 'CA',
  photoUrl: 'http://yep.com/good.jpg',
  blurb: 'bring me some ice cream',
});

const newEvent2 = {
  name: 'Test 2',
  location: 'White House',
  address: '1600 Pennsylvania Ave',
  city: 'Washington D.C.',
  state: 'DC',
  photoUrl: 'http://whitehouse.gov/home.jpg',
  blurb: 'Presidential Affair',
};

const newUser = JSON.stringify({ email: 'fools@me.com',
  facebookId: 'xxXtestingIdXxx',
  firstName: 'Spider',
  lastName: 'Monkey',
  gender: 'male',
  photoUrl: 'http://something.com/nope.jpg',
});

const newUser2 = JSON.stringify({ email: 'foolsUP@me.com',
  facebookId: 'xxXtestingId2Xxx',
  firstName: 'Blue',
  lastName: 'Moon',
  gender: 'female',
  photoUrl: 'http://this.com/yep.jpg',
});

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
      .end((err, res) => {
        done();
      });
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

describe('Testing user creation', () => {
  let server;

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

  it('POST /api/signup with no data should 404', (done) => {
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

  it('POST /api/signup with new user: status 201, success, id', (done) => {
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
          userIdDecrypted = res.body.id;
          userId = encrypt.encryptValue(res.body.id.toString());
          newEvent.userId = userId;
          res.body.should.have.property('success', true);
          res.body.should.have.property('id');
          done();
        }
      });
  });

  it('POST /api/signup for 2nd user.  increment user Id', (done) => {
    request(server)
      .post('/api/signup')
      .type('json')
      .send(newUser2)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end((err, res) => {
        // Calling the end function will send the request
        // errs are generated from the expect statements and passed to end as the first argument
        if (err) {
          done(err);
        } else if (res) {
          userId2Decrypted = res.body.id;
          userId2 = encrypt.encryptValue(res.body.id.toString());
          newEvent2.userId = userId2;
          (userId2Decrypted).should.be.above(userIdDecrypted);
          res.body.should.have.property('success', true);
          res.body.should.have.property('id');
          done();
        }
      });
  });

  it('should repond with 200 when when logged in and user exists', (done) => {
    request(server)
      .get(`/api/user/${userId}`)
      .set('Cookie', [`user_id=${userId}`])
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.be.equal(200);
        res.body.user.should.have.property('facebookId', 'xxXtestingIdXxx');
        res.body.user.should.have.property('accessToken');
        res.body.user.should.have.property('refreshToken');
        done();
      });
  });
});

describe('Testing Covey Creation, Editing, Retrieval', () => {
  let server;

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
    passportStub.install(server);
    passportStub.login({ username: 'john.doe' });
  });

  it('POST /api/coveys', (done) => {
    request(server)
      .post('/api/coveys')
      .set('Cookie', [`user_id=${userId}`])
      .type('json')
      .send(JSON.stringify(newEvent))
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

  it('POST /api/coveys 2nd event', (done) => {
    request(server)
      .post('/api/coveys')
      .set('Cookie', [`user_id=${userId2}`])
      .type('json')
      .send(JSON.stringify(newEvent2))
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          coveyId2 = res.body.id;
          res.body.should.have.property('success', true);
          res.body.should.have.property('id');
          (coveyId2).should.be.above(coveyId);
          done();
        }
      });
  });

  it('GET /api/covey/*coveyId* for valid coveyId', (done) => {
    request(server)
      .get(`/api/covey/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
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

  it(`PUT /api/coveys/${coveyId}`, (done) => {
    request(server)
      .put(`/api/coveys/${coveyId}`)
      .type('json')
      .set('Cookie', [`user_id=${userId}`])
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

  it(`GET /api/covey/${coveyId} after PUT. location, city`, (done) => {
    request(server)
      .get(`/api/covey/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
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
});

describe('Testing attendee actions', () => {
  let server;

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
    passportStub.install(server);
    passportStub.login({ username: 'john.doe' });
  });

  it('POST /api/coveys/1stCovey/2ndUser', (done) => {
    request(server)
      .post(`/api/coveys/${coveyId}/${userId2}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          coveyId2 = res.body.id;
          res.body.should.have.property('user');
          res.body.should.have.property('id');
          res.body.user.should.have.property('id', userId2Decrypted);
          done();
        }
      });
  });

  it('should respond with 409 if user already in covey', (done) => {
    request(server)
      .post(`/api/coveys/${coveyId}/${userId2}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(409)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });

  it('GET /api/coveys/2ndUser after POST attendee', (done) => {
    request(server)
      .get(`/api/coveys/${userId2}`)
      .set('Cookie', [`user_id=${userId2}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          (res.body.length).should.be.equal(2);
          res.body[0].name.should.be.equal('Test 2');
          done();
        }
      });
  });

  it('DELETE /api/coveys/:coveyId/:userId', (done) => {
    request(server)
      .del(`/api/coveys/${coveyId}/${userId2}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });

  it('GET /api/covey/${coveyId} should respond with 401 for invalid user', (done) => {
    request(server)
      .get(`/api/covey/${coveyId}`)
      .set('Cookie', [`user_id=${userId2}`])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });

  it('PUT /api/coveys/${coveyId} should respond with 401 for invalid user', (done) => {
    request(server)
      .put(`/api/coveys/${coveyId}`)
      .type('json')
      .set('Cookie', [`user_id=${userId2}`])
      .send(updateEvent)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });

  it('DELETE /api/coveys/${coveyId} should respond with 401 for invalid user', (done) => {
    request(server)
      .del(`/api/coveys/${coveyId}`)
      .type('json')
      .set('Cookie', [`user_id=${userId2}`])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
});

describe('Testing resources functionality', () => {
  let server;
  let newResource;
  let updatedResource;
  let resourceId;

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
    passportStub.install(server);
    passportStub.login({ username: 'john.doe' });
    newResource = {
      name: 'Beer',
      quantity: '24',
      type: 'food',
      covey_id: coveyId,
    };
    updatedResource = newResource;
    updatedResource.quantity = 12;
  });

  it('POST /api/resources should respond with 401 if user cookie not valid', (done) => {
    request(server)
      .post('/api/resources')
      .type('json')
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('POST /api/resources should add a new resource for valid users', (done) => {
    request(server)
      .post('/api/resources')
      .type('json')
      .set('Cookie', [`user_id=${userId}`])
      .send(newResource)
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          resourceId = res.body.resource.id;
          done();
        }
      });
  });
  it('PUT /api/resources/:resourceId should update resource', (done) => {
    request(server)
      .put(`/api/resources/${resourceId}`)
      .type('json')
      .set('Cookie', [`user_id=${userId}`])
      .send(updatedResource)
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.updatedResource.quantity.should.be.equal(12);
          done();
        }
      });
  });
  it('PUT /api/resources/:resourceId should respond with 401 if user is unauthorized', (done) => {
    request(server)
      .put(`/api/resources/${resourceId}`)
      .type('json')
      .send(updatedResource)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('GET /api/resources/:coveyid should respond w/ 401 for unauthorized user', (done) => {
    request(server)
      .get(`/api/resources/${coveyId}`)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('GET /api/resources/:coveyid should return resources, if authorized', (done) => {
    request(server)
      .get(`/api/resources/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body[0].name.should.be.equal('Beer');
          done();
        }
      });
  });
  it('POST /api/suppliers/:resourceid/:userid should respond w/ 401 if unauthorized', (done) => {
    request(server)
      .post(`/api/suppliers/${resourceId}/${userId}`)
      .set('Cookie', ['user_id=-1'])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('POST /api/suppliers/:resourceid/:userid should respond w/ 201 if authorized', (done) => {
    request(server)
      .post(`/api/suppliers/${resourceId}/${userId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('GET /api/suppliers/:resourceid should respond w/ 401 if unauthorized', (done) => {
    request(server)
      .get(`/api/suppliers/${resourceId}`)
      .set('Cookie', ['user_id=-1'])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('GET /api/suppliers/:resourceid should respond w/ 200 if authorized', (done) => {
    request(server)
      .get(`/api/suppliers/${resourceId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body[0].user_id.should.be.equal(userIdDecrypted);
          done();
        }
      });
  });
  it('DELETE /api/suppliers/:coveyId/:resourceid/:userid should respond w/ 401 if unauthorized', (done) => {
    request(server)
      .del(`/api/suppliers/${coveyId}/${resourceId}/${userId}`)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('DELETE /api/suppliers/:coveyId/:resourceid/:userid should respond w/ 200 if authorized', (done) => {
    request(server)
      .del(`/api/suppliers/${coveyId}/${resourceId}/${userId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          done();
        }
      });
  });
  it('Should return deleted suppliers', (done) => {
    request(server)
      .get(`/api/suppliers/${resourceId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.length.should.be.equal(0);
          done();
        }
      });
  });
  it('DELETE /api/resources/:coveyId/:resourceId should respond w/ 401 for unauthorized user', (done) => {
    request(server)
      .del(`/api/resources/${coveyId}/${resourceId}`)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('DELETE /api/resources/:coveyId/:resourceId should delete resource if authorized', (done) => {
    request(server)
      .del(`/api/resources/${coveyId}/${resourceId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          done();
        }
      });
  });
  it('Should not return resources that were previously deleted', (done) => {
    request(server)
      .get(`/api/resources/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.length.should.be.equal(0);
          done();
        }
      });
  });
});

describe('Testing cars functionality', () => {
  let server;
  let newCar;
  let updatedCar;
  let carId;

  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
    passportStub.install(server);
    passportStub.login({ username: 'john.doe' });
    newCar = {
      userId: userId,
      name: 'Gandalf\'s car',
      seats: 5,
      location: 'The Shire',
      departureTime: 'Whenever',
      covey_id: coveyId,
    };
    updatedCar = newCar;
    updatedCar.seats = 6;
  });

  it('POST /api/rides should respond with 401 if unauthorized', (done) => {
    request(server)
      .post('/api/rides')
      .type('json')
      .send(newCar)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('POST /api/rides should respond with 201 if authorized', (done) => {
    request(server)
      .post('/api/rides')
      .set('Cookie', [`user_id=${userId}`])
      .type('json')
      .send(newCar)
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          console.log(res.body);
          carId = res.body.car.id;
          done();
        }
      });
  });

  it('PUT /api/rides/:carId should respond with 401 if unauthorized', (done) => {
    request(server)
      .put(`/api/rides/${carId}`)
      .type('json')
      .send(updatedCar)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('PUT /api/rides/:carId should respond with 201 if authorized', (done) => {
    request(server)
      .put(`/api/rides/${carId}`)
      .set('Cookie', [`user_id=${userId}`])
      .type('json')
      .send(updatedCar)
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.updatedRide.seats.should.be.equal(6);
          done();
        }
      });
  });

  it('GET /api/rides/:coveyId should respond with 401 if unauthorized', (done) => {
    request(server)
      .get(`/api/rides/${coveyId}`)
      .set('Cookie', ['user_id=-1'])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('GET /api/rides/:coveyId should respond with 200 if authorized', (done) => {
    request(server)
      .get(`/api/rides/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body[0].name.should.be.equal('Gandalf\'s car');
          done();
        }
      });
  });

  it('POST /api/riders/:carId/:userId should respond with 401 if unauthorized', (done) => {
    request(server)
      .post(`/api/riders/${carId}/${userId2}`)
      .set('Cookie', ['user_id=-1'])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('POST /api/riders/:carId/:userId should respond with 201 if authorized', (done) => {
    request(server)
      .post(`/api/riders/${carId}/${userId2}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(201)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          done();
        }
      });
  });

  it('GET /api/riders/:carId should respond with 401 if unauthorized', (done) => {
    request(server)
      .get(`/api/riders/${carId}`)
      .set('Cookie', ['user_id=-1'])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('GET /api/riders/:carId should respond with 200 if authorized', (done) => {
    request(server)
      .get(`/api/riders/${carId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.length.should.be.equal(2);
          res.body[0].firstName.should.be.equal('Spider');
          res.body[1].firstName.should.be.equal('Blue');
          done();
        }
      });
  });

  it('DELETE /api/riders/:carId/:userId should respond with 401 if unauthorized', (done) => {
    request(server)
      .del(`/api/riders/${carId}/${userId2}`)
      .set('Cookie', ['user_id=-1'])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('DELETE /api/riders/:carId/:userId should respond with 201 if authorized', (done) => {
    request(server)
      .del(`/api/riders/${carId}/${userId2}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          done();
        }
      });
  });
  it('Should not return deleted riders', (done) => {
    request(server)
      .get(`/api/riders/${carId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.length.should.be.equal(1);
          res.body[0].firstName.should.be.equal('Spider');
          done();
        }
      });
  });

  it('DELETE /api/rides/:carId should respond with 401 if unauthorized', (done) => {
    request(server)
      .del(`/api/rides/${carId}`)
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
  it('DELETE /api/rides/:carId should respond with 200 if authorized', (done) => {
    request(server)
      .del(`/api/rides/${carId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.success.should.be.equal(true);
          done();
        }
      });
  });
  it('Should not return deleted cars', (done) => {
    request(server)
      .get(`/api/rides/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          res.body.length.should.be.equal(0);
          done();
        }
      });
  });
});

describe('Testing Deletion', () => {
  let server;

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

  it(`DELETE /api/coveys/${coveyId}`, (done) => {
    request(server)
      .del(`/api/coveys/${coveyId}`)
      .set('Cookie', [`user_id=${userId}`])
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

  it('DELETE /api/user/2ndUser for cleanup testing', (done) => {
    request(server)
      .del(`/api/user/${userId2}`)
      .set('Cookie', [`user_id=${userId2}`])
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

  it('DELETE /api/user/#userId# should delete the user', (done) => {
    request(server)
      .del(`/api/user/${userId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          console.log(res.body);
          res.body.should.have.property('success');
          done();
        }
      });
  });
});

describe('Testing user id encryption/decryption', () => {
  let server;

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

  it('Should respond with a 401 if decrypted user id provided in url parameter', (done) => {
    request(server)
      .get(`/api/coveys/${userIdDecrypted}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });

  it('Should respond with a 401 if decrypted user id provided in cookie', (done) => {
    request(server)
      .get(`/api/coveys/${userId}`)
      .set('Cookie', [`user_id=${userIdDecrypted}`])
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });

  it('Should respond with a 401 if decrypted user id provided in request body', (done) => {
    request(server)
      .post('/api/coveys')
      .set('Cookie', [`user_id=${userId}`])
      .type('json')
      .send({
        userId: userIdDecrypted,
      })
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });


  it('Should respond with a 200 if encrypted version of userId provided', (done) => {
    request(server)
      .get(`/api/coveys/${userId}`)
      .set('Cookie', [`user_id=${userId}`])
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else if (res) {
          done();
        }
      });
  });
});