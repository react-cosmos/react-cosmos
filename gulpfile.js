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

var componentPlaygroundStyle = 'component-playground.less';

gulp.task('build', function() {
  gulp.src(jsPaths)
    .pipe(gulpif(/\.jsx$/, react()))
    .pipe(concat('cosmos.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('cosmos.min.js'))
    .pipe(gulp.dest('build'));
});

gulp.task('generate-playground-style', function () {
  gulp.src(componentPlaygroundStyle)
    .pipe(less())
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(jsPaths, ['build']);
  gulp.watch(componentPlaygroundStyle, ['generate-playground-style']);
});

gulp.task('default', ['build', 'generate-playground-style', 'watch']);
