// Karma configuration

module.exports = function (config) {
  config.set({
    basePath: './',

    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      // angular source
      'client/lib/angular/angular.js',
      'client/lib/angular-route/angular-route.js',
      'client/lib/angular-mocks/angular-mocks.js',

      // our app code
      'client/app.js',
      'client/scripts/**/*.js',

      // our client-side spec files - in order
      'specs/client/clientExampleSpec.js',
    ],

    reporters: ['spec'],

    browsers: ['PhantomJS'],

    autoWatch: false,

    singleRun: true

  });
};
