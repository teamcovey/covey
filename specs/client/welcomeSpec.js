describe('Welcome modal & phone number verifcation', () => {
  let $controller;
  let welcomeService;
  let $httpBackend;

  const userData = {
    user: { firstName: 'Fred' },
  };

  const phoneNumber = '+447766564019';

  beforeEach(module('covey.welcome'));
  beforeEach(module('welcome.services'));

  beforeEach(inject((_$controller_, _welcomeService_, _$httpBackend_) => {
    $controller = _$controller_;
    welcomeService = _welcomeService_;
    $httpBackend = _$httpBackend_;
  }));

  it('welcomeController & welcomeService functions should exist', () => {
    expect(welcomeService.getUser).to.be.defined;
    expect($controller.verify).to.be.defined;
    expect($controller.compare).to.be.defined;
  });

  it('should return a name when getUser is called', (done) => {
    $httpBackend.expectGET('/api/user/1').respond(200, userData);
    document.cookie = 'user_id=1';
    welcomeService.getUser(1)
      .then((response) => {
        expect(response).to.equal('Fred');
        done();
      });
    $httpBackend.flush();
  });

  it('should receive 200 when getVerificationCode is called', (done) => {
    $httpBackend.expectGET(`/api/tel/verify/${phoneNumber}`).respond(200);
    welcomeService.getVerificationCode(phoneNumber)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should receive 200 when saveTel is called', (done) => {
    $httpBackend.expectPOST('api/tel/').respond(200);
    welcomeService.saveTel(phoneNumber)
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      });
    $httpBackend.flush();
  });

  it('should receive 200 when hasTel is called', (done) => {
    $httpBackend.expectGET('api/tel/').respond(200);
    welcomeService.hasTel()
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      });
    $httpBackend.flush();
  });
});
