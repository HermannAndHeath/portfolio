const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('clean', () =>
  gulp.src('dist', {
    read: false,
  })
  .pipe(clean())
);

const imagemin = require('gulp-imagemin');

const imageExtensions = ['jpg', 'jpeg', 'gif', 'png', 'svg'];
const imagePaths = imageExtensions.map(extension => `content/images/*.${extension}`);

gulp.task('copy-images', ['clean'], () =>
  gulp.src(imagePaths)
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'))
);

gulp.task('copy-assets', ['clean'], () =>
  gulp.src([
    'content/**/*',
    '!content/**/*.html',
    '!content/**/*.scss',
    '!content/pages',
    '!content/partials',
    '!content/posts/**/*.md',
  ].concat(imagePaths.map(path => `!${path}`)))
  .pipe(gulp.dest('dist'))
);

gulp.task('compile', ['clean'], () => require('./compile/compileHandlebars')());

const htmlmin = require('gulp-htmlmin');

gulp.task('minify', ['compile'], () =>
  gulp.src('dist/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('dist'))
);

const sass = require('gulp-sass');
const eyeglass = require('eyeglass');

const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const processors = [
  cssnano(),
  autoprefixer(),
];

gulp.task('sass', () =>
  gulp.src('./content/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass(eyeglass()).on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(postcss(processors))
  .pipe(gulp.dest('./dist'))
  .pipe(browserSync.stream())
);

gulp.task('build', ['minify', 'sass', 'copy-assets', 'copy-images']);

gulp.task('watch', ['build'], () => {
  browserSync.init({
    proxy: 'localhost:8001',
  });

  gulp.watch([
    './content/**/*',
    '!./content/**/*.scss',
  ], ['rebuild', 'copy-assets']);

  gulp.watch('./content/**/*.scss', ['sass']);
});

gulp.task('rebuild', ['build'], done => {
  browserSync.reload();
  done();
});

const serve = require('gulp-serve');
gulp.task('serve', serve({
  root: ['dist'],
  port: 8001,
}));

gulp.task('default', ['serve', 'watch']);
gulp.task('production', ['build']);

const eslint = require('gulp-eslint');

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);
