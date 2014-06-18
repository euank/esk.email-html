var gulp = require('gulp');
var jade = require('gulp-jade');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

gulp.task('jade', function() {
  var locals = {};

  return gulp.src('templates/*.jade')
  .pipe(jade({
    locals: locals
  }))
  .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js', function() {
  return gulp.src('js/*.js')
  .pipe(concat('tmp.js'))
  .pipe(uglify())
  .pipe(rename('app.js'))
  .pipe(gulp.dest('./dist/js/'));
});

gulp.task('copy-imgs', function() {
  return gulp.src('imgs/*')
  .pipe(gulp.dest('./dist/imgs/'));
});

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
  .pipe(concat('tmp.css'))
  .pipe(minifyCSS())
  .pipe(rename('app.css'))
  .pipe(gulp.dest('./dist/css/'));
});


gulp.task('default', ['jade', 'minify-js', 'minify-css', 'copy-imgs']);
