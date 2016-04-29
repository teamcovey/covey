var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var exec = require('child_process').exec;

// the paths to our app files
var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/app.js', 'client/scripts/**/*.js'],
  html: ['client/app/views/*.html', 'client/index.html'],
  styles: ['client/styles/*.css'],
  test: ['specs/**/*.js']
};

// Run our karma tests 
// TODO: Rename to 'client-test' ?
gulp.task('karma', function (done) {
  new KarmaServer({
    configFile: '/Users/skyefree/Documents/web-projects/hackreactor/covey/karma.conf.js'
  }, done).start();
});

// TODO: Rename to 'server-test' ?
gulp.task('mocha', function(done) {
  exec('mocha specs/server --compilers js:babel-register', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
  });
});

// TODO: npm test should call gulp test which should do tasks mocha, karma
