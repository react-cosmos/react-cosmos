var gulp = require('gulp'),
    less = require('gulp-less');

var lessPath = 'component-playground.less';

gulp.task('generate-playground-style', function () {
  gulp.src(lessPath)
    .pipe(less())
    .pipe(gulp.dest('.'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(lessPath, ['generate-playground-style']);
});

gulp.task('default', ['generate-playground-style', 'watch']);
