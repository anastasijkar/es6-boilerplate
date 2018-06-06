var           gulp = require('gulp');
var    browserSync = require('browser-sync').create();
var        htmlmin = require('gulp-htmlmin');
var       minifyjs = require('gulp-js-minify');
var       imagemin = require('gulp-imagemin');
var   gulpSequence = require('gulp-sequence');
var          watch = require('gulp-watch');
var     sourcemaps = require('gulp-sourcemaps');
var          clean = require('gulp-clean');
var         cssmin = require('gulp-cssmin');
var   autoprefixer = require('gulp-autoprefixer');
var      concatCss = require('gulp-concat-css');
var         concat = require('gulp-concat');
var          babel = require('gulp-babel');
var         eslint = require('gulp-eslint');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    }
  })
});

gulp.task('clean', function () {
  return gulp.src('./build', {read: false})
    .pipe(clean());
});

gulp.task('styles', function() {
  return gulp.src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concatCss("bundle.min.css"))
    .pipe(cssmin())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('html', function() {
  return gulp.src('./src/html/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task ('eslint', function() {
  return gulp.src('./src/js/*.js')
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('js', ['eslint'], function() {
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(minifyjs())
    .pipe(concat('bundle.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('./src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/img'));
});

gulp.task('watch', function(){
  gulp.watch('./src/css/*.css', ['styles']);
  gulp.watch('./src/html/*.html', ['html']);
  gulp.watch('./src/js/*.js', ['js', 'html']);
  gulp.watch('./src/img/*', ['images']);
});

/* build & serve without cleaning up
  directories and image minifying */
gulp.task('build:light', gulpSequence(['html', 'styles', 'js'], 'browserSync', 'watch'));

gulp.task('build', gulpSequence('clean', ['html', 'styles', 'js', 'images'], 'browserSync', 'watch'));