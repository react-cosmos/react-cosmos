var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react');

var paths = {
  dependencies: [
    'vendor/**/*.js'
  ],
  scripts: [
    'fresh.js',
    'lib/**/*.js',
    'mixins/**/*.js',
    'components/**/*.jsx']
};

gulp.task('scripts', function() {
  // Node bundle
  gulp.src(paths.scripts)
    .pipe(react())
    .pipe(concat('build/fresh.js'))
    .pipe(gulp.dest('.'));
  // Bundle bundle
  gulp.src(paths.dependencies.concat(paths.scripts))
    .pipe(react())
    .pipe(concat('build/fresh-with-dependencies.js'))
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
