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
});
