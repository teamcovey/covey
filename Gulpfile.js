var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var exec = require('child_process').exec;
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var processhtml = require('gulp-processhtml');

var paths = {
  // all our client app js files, not including 3rd party js files
  scripts: ['client/app.js', 'client/scripts/**/*.js', 'client/features/**/*.js'],
  html: ['client/views/*.html', 'client/index.html'],
  styles: ['client/styles/*.css'],
  test: ['specs/**/*.js'],
  services: ['client/features/index/services/indexService.js',
    'client/features/welcome/services/welcomeService.js',
    'client/features/coveys/services/services.js',
    'client/features/attendees/services/attendeesService.js',
    'client/features/supplies/services/suppliesService.js',
    'client/features/friends/services/friendsService.js',
    'client/features/rides/services/ridesService.js',
    'client/features/covey/services/coveyService.js',
    'client/features/rides/filters/ridesFilter.js',
    'client/scripts/services/dateservices.js',
    'client/scripts/services/authservices.js',
    'client/features/chat/services/chatService.js',
    'client/features/profile/services/profileService.js',
    'client/features/expenses/services/expensesService.js',
    'client/scripts/services/calendarService.js',
    'client/scripts/services/emailService.js',
    'client/scripts/services/dateservices.js'],
    controllers: ['client/scripts/controllers/auth.js',
    'client/features/hamburger/controllers/hamburger.js',
    'client/features/createcovey/controllers/createcovey.js',
    'client/features/index/controllers/indexController.js',
    'client/features/welcome/controllers/welcomeController.js',
    'client/scripts/controllers/auth.js',
    'client/features/coveys/controllers/coveys.js',
    'client/features/navbar/controllers/navController.js',
    'client/features/rides/controllers/ridesController.js',
    'client/features/supplies/controllers/suppliesController.js',
    'client/features/attendees/controllers/attendeesController.js',
    'client/features/friends/controllers/friendsController.js',
    'client/features/covey/controllers/coveyController.js',
    'client/features/chat/controllers/chatController.js',
    'client/features/profile/controllers/profileController.js',
    'client/features/expenses/controllers/expensesController.js'],
  directives: ['client/features/welcome/directives/welcomeDirective.js',
    'client/features/createcovey/directives/createcoveydirective.js',
    'client/features/coveys/directives/coveysdirective.js',
    'client/features/hamburger/directives/hamburgerdirective.js',
    'client/features/covey/directives/coveyDirectives.js',
    'client/features/friends/directives/friendsDirective.js',
    'client/features/profile/directives/profileDirective.js'],
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

gulp.task('compress-services', function() {
  return gulp.src(paths.services)
    .pipe(babel())
    .pipe(concat("services.min.js"))
    .on('error', function(err) {
      console.log('error was ', err);
    })
    .pipe(gulp.dest('client/dist'));
});

gulp.task('compress-controllers', function() {
  return gulp.src(paths.controllers)
    .pipe(babel())
    .pipe(concat("controllers.min.js"))
    .on('error', function(err) {
      console.log('error was ', err);
    })
    .pipe(gulp.dest('client/dist'));
});

gulp.task('compress-directives', function() {
  return gulp.src(paths.directives)
    .pipe(babel())
    .pipe(concat("directives.min.js"))
    .on('error', function(err) {
      console.log('error was ', err);
    })
    .pipe(gulp.dest('client/dist'));
});

gulp.task('compress-app', function() {
  return gulp.src('client/app.js')
    .pipe(babel())
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

gulp.task('go-prod', ['compress-services', 'compress-directives', 'compress-controllers', 'compress-app', 'minify-css', 'min-index']);
