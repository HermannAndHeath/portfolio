const gulp = require('gulp');
const serve = require('gulp-serve');

const clean = require('gulp-clean');

gulp.task('clean', () =>
  gulp.src('dist', {
    read: false,
  })
  .pipe(clean())
);

gulp.task('copy-assets', ['clean'], () =>
  gulp
    .src([
      'content/*',
      '!content/*.html',
      '!content/pages',
      '!content/partials',
    ])
    .pipe(gulp.dest('dist'))
);

const cssmin = require('gulp-cssmin');

gulp.task('minify-css', ['copy-assets'], () =>
  gulp.src('dist/**/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('dist'))
);

gulp.task('compile', ['clean'], () =>
  require('./compile/blog')()
);

const htmlmin = require('gulp-htmlmin');

gulp.task('minify', ['compile'], () =>
  gulp.src('dist/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
);

gulp.task('build', ['minify', 'minify-css']);

gulp.task('watch', ['build'], () => {
  gulp.watch('./content/**/*', ['build']);
});

gulp.task('serve', serve({
  root: ['dist'],
  port: 8001,
}));

gulp.task('default', ['serve', 'watch']);

const eslint = require('gulp-eslint');

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
