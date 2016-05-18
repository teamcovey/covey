var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var processhtml = require('gulp-processhtml');

var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/app.js', 'client/scripts/**/*.js', 'client/features/**/*.js'],
  html: ['client/views/*.html', 'client/index.html'],
  styles: ['client/styles/*.css'],
  test: ['specs/**/*.js']
};

// Runs client-side tests
gulp.task('karma', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

// Runs server-side tests
gulp.task('mocha', function(done) {
  exec('mocha specs/server --compilers js:babel-register', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    if(err) {
      process.exit(1);
    }
  });
});

gulp.task('compress', function() {
  return gulp.src(paths.scripts)
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(uglify())
    .on('error', function(err) {
      console.log('error was ', err);
    })
    .pipe(gulp.dest('client/dist'));
});

gulp.task('minify-css', function() {
  return gulp.src('client/styles/*.css')
    .pipe(concat("all.css"))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('client/dist'));
});

gulp.task('min-index', function () {
    return gulp.src('client/index.html')
               .pipe(processhtml())
               .pipe(gulp.dest('client'));
});

// TODO: npm test should call gulp test which should do tasks mocha, karma
gulp.task('test', ['mocha', 'karma']);

gulp.task('go-prod', ['compress', 'minify-css', 'min-index']);
