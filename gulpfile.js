var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    react = require('gulp-react'),
    less = require('gulp-less');

var jsPaths = [
  'wrapper-header.js',
  'cosmos.js',
  'lib/**/*.js',
  'mixins/**/*.js',
  'components/**/*.jsx',
  'wrapper-footer.js'
];

var lessPath = 'component-playground.less';

gulp.task('build-js', function() {
  gulp.src(jsPaths)
    .pipe(gulpif(/\.jsx$/, react()))
    .pipe(concat('cosmos.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('cosmos.min.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-css', function () {
  gulp.src(lessPath)
    .pipe(less())
    .pipe(gulp.dest('build'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(jsPaths, ['build-js']);
  gulp.watch(lessPath, ['build-css']);
});

gulp.task('default', ['build-js', 'build-css', 'watch']);
