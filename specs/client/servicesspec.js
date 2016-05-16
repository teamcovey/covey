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

describe('Date Factory', () => {
  let dateFactory;
  beforeEach(module('date.services'));

  beforeEach(inject((_dateFactory_) => {
    dateFactory = _dateFactory_;
  }));
  it('convertToTextDate function should exist', () => {
    expect(dateFactory.convertToTextDate).to.be.defined;
  });
  it('Should correctly convert date to a string', () => {
    let testDate = new Date(2016, 4, 15, 12, 15);
    expect(dateFactory.convertToTextDate(testDate)).to.equal('Sun May 15th, 2016 @ 12:15PM');
    testDate = new Date(2016, 4, 16, 12, 15);
    expect(dateFactory.convertToTextDate(testDate)).to.equal('Mon May 16th, 2016 @ 12:15PM');
    testDate = new Date(2020, 2, 1, 0, 0);
    expect(dateFactory.convertToTextDate(testDate)).to.equal('Sun Mar 1st, 2020 @ 12:00AM');
    testDate = new Date(2020, 2, 2, 13, 0);
    expect(dateFactory.convertToTextDate(testDate)).to.equal('Mon Mar 2nd, 2020 @ 1:00PM');
    testDate = new Date(2020, 2, 3, 13, 0);
    expect(dateFactory.convertToTextDate(testDate)).to.equal('Tue Mar 3rd, 2020 @ 1:00PM');
  });
});

describe('Add to calendar', () => {
  let calendarHelpers;
  let times;
  const details = {};
  details.startTime = '2016-05-16T19:00:00.000Z';
  details.endTime = '2016-05-16T21:00:00.000Z';
  details.name = 'A big trip';
  details.location = 'Earth';
  const name = 'Dave';

  beforeEach(module('calendar.services'));
  beforeEach(inject((_calendarHelpers_) => {
    calendarHelpers = _calendarHelpers_;
  }));

  it('should return an object with startTime and endTime in ISO format', () => {
    times = calendarHelpers.formatTime(details);
    expect(times.start).to.equal('20160516T190000Z');
    expect(times.end).to.equal('20160516T210000Z');
  });

  it('should return formatted url string for Google calendar API', () => {
    times = calendarHelpers.formatTime(details);
    const url = calendarHelpers.makeURL(details, times, name);
    expect(url).to.be.equal('http://www.google.com/calendar/event?action=TEMPLATE&text=A%20big%20trip&dates=20160516T190000Z/20160516T210000Z&details=Added%20by%20Dave,%20using%20Covey.%20Join%20a%20Covey%20at%20mycovey.com&location=Earth');
  });
});
