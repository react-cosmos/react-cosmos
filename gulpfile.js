var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    react = require('gulp-react');

var paths = {
  dependencies: [
    'vendor/**/*.js'
  ],
  scripts: [
    'cosmos.js',
    'lib/**/*.js',
    'mixins/**/*.js',
    'components/**/*.jsx'],
  demo: [
    'demo/components/**/*.jsx'
  ]
};

gulp.task('scripts', function() {
  // Node bundle
  gulp.src(paths.scripts)
    .pipe(react())
    .pipe(concat('cosmos.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('cosmos.min.js'))
    .pipe(gulp.dest('build'));
  // Bundle bundle
  gulp.src(paths.dependencies.concat(paths.scripts))
    .pipe(react())
    .pipe(concat('cosmos-with-dependencies.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('cosmos-with-dependencies.min.js'))
    .pipe(gulp.dest('build'));
  // Demo bundle
  gulp.src(paths.demo)
    .pipe(react())
    .pipe(concat('demo.js'))
    .pipe(gulp.dest('build'))
    .pipe(uglify())
    .pipe(rename('demo.min.js'))
    .pipe(gulp.dest('build'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.dependencies.concat(paths.scripts, paths.demo), ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
