var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    react = require('gulp-react');

var paths = [
  'wrapper-header.js',
  'cosmos.js',
  'lib/**/*.js',
  'mixins/**/*.js',
  'components/**/*.jsx',
  'wrapper-footer.js'
];

gulp.task('build', function() {
  gulp.src(paths)
    .pipe(gulpif(/\.jsx$/, react()))
    .pipe(concat('cosmos.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('cosmos.min.js'))
    .pipe(gulp.dest('build'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.core, ['build']);
});

gulp.task('default', ['build', 'watch']);
