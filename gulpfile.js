var           gulp = require('gulp');
var    browserSync = require('browser-sync').create();
var        htmlmin = require('gulp-htmlmin');
var       minifyjs = require('gulp-js-minify');
var       imagemin = require('gulp-imagemin');
var   gulpSequence = require('gulp-sequence');
var          watch = require('gulp-watch');
var      concatCss = require('gulp-concat-css');
var     sourcemaps = require('gulp-sourcemaps');
var          clean = require('gulp-clean');
var         cssMin = require('gulp-css');
var         autoprefixer = require('gulp-autoprefixer');

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
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
    .pipe(cssMin())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('html', function() {
  return gulp.src('./src/html/*.html')
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js:minify', function() {
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(minifyjs())
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
  gulp.watch('./src/js/*.js', ['js:minify', 'html']);
  gulp.watch('./src/img/*', ['images']);
});

/*build & serve without cleaning up
  directories and image minifying*/
gulp.task('build:light', gulpSequence(['html', 'styles', 'js:minify'], 'browserSync', 'watch'));

gulp.task('build', gulpSequence('clean', ['html', 'styles', 'js:minify', 'images'], 'browserSync', 'watch'));