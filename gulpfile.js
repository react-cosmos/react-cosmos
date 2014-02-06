var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react');

var paths = {
  scripts: [
    'vendor/**/*.js',
    'fresh.js',
    'lib/**/*.js',
    'mixins/**/*.js',
    'visualizations/**/*.jsx']
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(react())
    //.pipe(uglify())
    .pipe(concat('fresh-bundle.js'))
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
