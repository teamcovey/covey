describe('Friends Factory', () => {
  let friendsFactory;
  let $httpBackend;
  let userIdFactory;
  beforeEach(module('friends.services'));
  beforeEach(module('userId.services'));

  beforeEach(inject((_friendsFactory_, _$httpBackend_, _userIdFactory_) => {
    friendsFactory = _friendsFactory_;
    $httpBackend = _$httpBackend_;
    userIdFactory = _userIdFactory_;
  }));
  it('friends factory functions should exist', () => {
    expect(friendsFactory.getFriends).to.be.defined;
    expect(friendsFactory.addFriend).to.be.defined;
    expect(friendsFactory.removeFriend).to.be.defined;
    expect(friendsFactory.searchUsers).to.be.defined;
  });

  it('Should receive a 200 when getFriends is called', (done) => {
    $httpBackend.expectGET('/api/friends/1').respond(200, '');
    document.cookie = 'userId=1';
    friendsFactory.getFriends()
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      });
    $httpBackend.flush();
  });

  it('Should receive a 200 when searchUsers is called', (done) => {
    $httpBackend.expectGET('/api/searchUsers/foo').respond(200, { users: [] });
    friendsFactory.searchUsers('foo')
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.data.users)).to.equal(true);
        done();
      });
    $httpBackend.flush();
  });

  it('Should receive a 201 when addFriend is called', (done) => {
    $httpBackend.expectPOST('/api/friends/1/2').respond(201, { userId: 2, success: true });
    friendsFactory.addFriend('2')
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.data.userId).to.equal(2);
        expect(response.data.success).to.equal(true);
        done();
      });
    $httpBackend.flush();
  });

  it('Should receive a 200 when removeFriend is called', (done) => {
    $httpBackend.expectDELETE('/api/friends/1/2').respond(200, { success: true });
    friendsFactory.removeFriend(2)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.data.success).to.equal(true);
        done();
      });
    $httpBackend.flush();
  });
});
