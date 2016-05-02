// Example Server test:
const request = require('supertest');

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

describe('Testing endpoint HTTP response types', () => {
  let server;
  beforeEach(() => {
    /* eslint-disable */
    server = require('../../server/server.js');
    /* eslint-enable */
  });

  it('response to /api/auth', (done) => {
    request(server)
      .get('/api/auth')
      .expect(200)
      .end(done);
  });

  it('response to GET /api/coveys', (done) => {
    request(server)
      .get('/api/coveys')
      .expect(200)
      .end(done);
  });

  it('response to POST /api/coveys', (done) => {
    request(server)
      .post('/api/coveys')
      .expect(201)
      .end(done);
  });

  it('response to DELETE /api/coveys/:id', (done) => {
    request(server)
      .del('/api/coveys/4')
      .expect(200)
      .end(done);
  });

  it('response to PUT /api/coveys/:id', (done) => {
    request(server)
      .put('/api/coveys/4')
      .expect(200)
      .end(done);
  });

  it('response to GET /api/coveys/:id', (done) => {
    request(server)
      .get('/api/coveys/4')
      .expect(200)
      .end(done);
  });

  it('response to POST /api/signup', (done) => {
    request(server)
      .get('/api/signup')
      .expect(404)
      .end(done);
  });
});

describe('Testing user signup api /api/signup', () => {
  const server = require('../../server/server.js');
  const newUser = JSON.stringify({ email: 'fools@me.com',
    facebookId: 'wastedId8',
    firstName: 'Spider',
    lastName: 'Monkey',
    gender: 'male',
    photoUrl: 'http://something.com/nope.jpg',
  });

  // beforeEach(() => {
  //   /* eslint-disable */
  //   server = require('../../server/server.js');
  //   /* eslint-enable */
  // });

  it('response to /api/auth with no data', (done) => {
    request(server)
      .post('/api/signup')
      // .field('name', 'my awesome avatar')
      .type('json')
      .send({ name: 'foo' })
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404)
      .end((err, res) => {
    // Calling the end function will send the request
        if (err) {
          done(err);
          // console.log('err is');
          // console.log('*', err, '*');
          // console.log(err.status);
        } else if (res) {
          // console.log('res is :');
          // // console.log(res);
          // console.log('res status is :');
          // console.log(res.status);
          done();
        }
      });
  });

  it('response to /api/auth with new user data', (done) => {
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
          // console.log('res is :');
          // // console.log(res);
          // console.log('res status is :');
          // console.log(res.status);
          done();
        }
      });
  });
});
