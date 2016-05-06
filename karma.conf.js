// Karma configuration

module.exports = function (config) {
  config.set({
    basePath: './',

    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      // angular source
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-cookies/angular-cookies.js',

      // our app code
      'client/app.js',
      'client/scripts/**/*.js',

      // our client-side spec files - in order
      'specs/client/clientExampleSpec.js',
      'specs/client/coveySpec.js',
      'specs/client/myCoveysSpec.js',
      'specs/client/createCoveySpec.js',
      'specs/client/servicesspec.js',
    ],

    preprocessors: {
      'client/app.js': ['babel'],
      'client/scripts/**/*.js': ['babel'],
      'specs/**/*.js': ['babel'],
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
      },
    },

    reporters: ['spec'],

    browsers: ['PhantomJS'],

    autoWatch: false,

    singleRun: true,

  });
};
