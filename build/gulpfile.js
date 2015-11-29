var gulp = require('gulp');
// var watch = require('gulp-watch');
var webpack = require('webpack-stream');

// // Watch for changes
// gulp.task('watch', function() {
//   return gulp.src('./*')
//   .pipe(watch('./*'))
//   .pipe(gulp.dest('build'))
// });

// Move static files to build
gulp.task('static:dev', function() {
  return gulp.src(['app/*.html', 'app/*.css'])
  .pipe(gulp.dest('build'));
});

// Move meat and bones to build
gulp.task('webpack:dev', function() {
  return gulp.src('app/js/game.js')
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('build'));
});

gulp.task('build:dev', ['webpack:dev', 'static:dev']);
gulp.task('default', ['build:dev']);

// gulp.doneCallback = function(err) {
//   process.exit(err ? 1 : 0);
// };