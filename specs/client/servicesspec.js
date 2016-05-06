describe('Coveys Factory', () => {
  let coveysFactory, $httpBackend;
  beforeEach(module('covey.services'));

  beforeEach(inject((_coveysFactory_, _$httpBackend_) => {
    coveysFactory = _coveysFactory_;
    $httpBackend = _$httpBackend_;
  }));
  it('Coveys factory functions should exist', () => {
    expect(coveysFactory.getCoveys).to.be.defined;
    expect(coveysFactory.postCovey).to.be.defined;
    expect(coveysFactory.getCovey).to.be.defined;
    expect(coveysFactory.putCovey).to.be.defined;
    expect(coveysFactory.deleteCovey).to.be.defined;
  });
  it('Should receive a 200 when getCoveys is called', (done) => {
    $httpBackend.expectGET('/api/coveys').respond(200, '');
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
