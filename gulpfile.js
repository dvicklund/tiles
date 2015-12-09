var gulp = require('gulp');
var webpack = require('webpack-stream');

// Who watches the watch tasks?
gulp.task('watch:js', function() {
  gulp.watch('app/js/**/*.js', ['webpack:dev']);
});

gulp.task('watch:html', function() {
  gulp.watch('app/**/*.html', ['static:dev']);
});

// Move static files to build
gulp.task('static:dev', function() {
  return gulp.src(['app/*.html', 'app/*.css'])
  .pipe(gulp.dest('build'));
});

// Move meat and bones to build
gulp.task('webpack:dev', function() {
  return gulp.src(['app/js/game.js'])
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('build'));
});

gulp.task('watch:all', ['watch:js', 'watch:html']);
gulp.task('build:dev', ['webpack:dev', 'static:dev']);
gulp.task('default', ['build:dev']);

// gulp.doneCallback = function(err) {
//   process.exit(err ? 1 : 0);
// };