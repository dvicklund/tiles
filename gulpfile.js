var gulp = require('gulp');
var webpack = require('webpack-stream');

// Move static files to build
gulp.task('static:dev', function() {
  gulp.src(['app/*.html', 'app/*.css'])
  .pipe(gulp.dest('build/'));
});

// Move meat and bones to build
gulp.task('webpack:dev', function() {
  return gulp.src('app/js/game.js')
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('build/'));
});

gulp.task('build:dev', ['webpack:dev', 'static:dev']);
gulp.task('default', ['build:dev']);

// gulp.doneCallback = function(err) {
//   process.exit(err ? 1 : 0);
// };