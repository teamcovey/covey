describe('Running', () => {
  it('Should be running a test', () => {
    expect([1, 2, 3][1]).to.equal(2);
  });
});

describe('Routing', () => {
  let $route;
  beforeEach(module('covey'));

  beforeEach(inject(($injector) => {
    $route = $injector.get('$route');
  }));

  it('Should have /coveys route, and template', () => {
    expect($route.routes['/coveys']).to.be.defined;
    expect($route.routes['/coveys'].templateUrl).to.equal('features/coveys/views/coveys.html');
  });
});
