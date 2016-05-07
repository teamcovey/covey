describe('Coveys Factory', () => {
  let coveysFactory;
  let $httpBackend;
  let userIdFactory;
  beforeEach(module('covey.services'));
  beforeEach(module('userId.services'));

  beforeEach(inject((_coveysFactory_, _$httpBackend_, _userIdFactory_) => {
    coveysFactory = _coveysFactory_;
    $httpBackend = _$httpBackend_;
    userIdFactory = _userIdFactory_;
  }));
  it('Coveys factory functions should exist', () => {
    expect(coveysFactory.getCoveys).to.be.defined;
    expect(coveysFactory.postCovey).to.be.defined;
    expect(coveysFactory.getCovey).to.be.defined;
    expect(coveysFactory.putCovey).to.be.defined;
    expect(coveysFactory.deleteCovey).to.be.defined;
  });
  it('Should receive a 200 when getCoveys is called', (done) => {
    $httpBackend.expectGET('/api/coveys/').respond(200, '');
    coveysFactory.getCoveys()
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      });
    $httpBackend.flush();
  });
  it('Should receive a 201 when postCovey is called', (done) => {
    $httpBackend.expectPOST('/api/coveys').respond(201, []);
    coveysFactory.postCovey()
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(Array.isArray(response.data)).to.equal(true);
        done();
      });
    $httpBackend.flush();
  });
});

describe('User Id Factory', () => {
  let userIdFactory;
  beforeEach(module('userId.services'));

  beforeEach(inject((_userIdFactory_) => {
    userIdFactory = _userIdFactory_;
  }));
  it('getUserId function should exist', () => {
    expect(userIdFactory.getUserId).to.be.defined;
  });
  it('should return empty string if cookie does not exist', () => {
    expect(userIdFactory.getUserId()).to.equal('');
  });
  it('should return the correct cookie if it exists', () => {
    expect(userIdFactory.getUserId()).to.equal('');
    document.cookie = 'user_id=12345';
    expect(userIdFactory.getUserId()).to.equal('12345');
  });
});
