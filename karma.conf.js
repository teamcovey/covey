// Karma configuration

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // testing frameworks to use
    frameworks: ['mocha', 'chai', 'sinon'],

    // list of files / patterns to load in the browser
    files: [
      // angular source
      'client/lib/angular/angular.js',
      'client/lib/angular-route/angular-route.js',
      'client/lib/angular-mocks/angular-mocks.js',

      // our app code
      'client/app.js',
      'client/scripts/**/*.js',

      // our spec files - in order
      'specs/client/testControllerSpec.js',
    ],

    // preprocessors: {
    //   "client/app.js": ["babel"],
    //   "client/scripts/*.js": ["babel"],
    //   "specs/**/*.js": ["babel"]
    // },

    // "babelPreprocessor": {
    //   options: {
    //     presets: ['es2015']
    //   }
    // },

    // test results reporter to use
    reporters: ['spec'],

    // start these browsers. PhantomJS will load up in the background
    browsers: ['PhantomJS'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // if true, Karma exits after running the tests.
    singleRun: true

  });
};
