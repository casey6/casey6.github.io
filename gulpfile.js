var browserSync = require('browser-sync').create(),
    clean = require('gulp-clean'),
    file = require('gulp-file'),
    ghPages = require('gulp-gh-pages'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify');

postcss.options = [
  require('postcss-partial-import')(),
  require('postcss-css-variables')(),
  require('postcss-nesting')(),
  require('autoprefixer')({ browsers: ['last 2 versions', 'ie >= 8']  }),
  require('cssnano')()
];

gulp.task('css', function() {
  return gulp.src('./src/css/app.css')
    .pipe(postcss(postcss.options))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('./src/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('html', function() {
  return gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img', ['img-resize-feature', 'img-resize-photos'], function() {
  return gulp.src(['./src/img/*.jpg', './src/img/*.png'])
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img-resize-feature', function() {
  return gulp.src('./src/img/feature/*.jpg')
    .pipe(imageResize({ width: 1500 }))
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img-resize-photos', function() {
  return gulp.src('./src/img/photos/*.jpg')
    .pipe(imageResize({ width: 640 }))
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function() {
  return gulp.src('./dist/', { read: false })
    .pipe(clean());
});

gulp.task('build', ['html', 'css', 'js', 'img'], function() {
  return gulp.src('./src/favicon.ico')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['html', 'css', 'js', 'img'], function() {
  browserSync.init({
      server: "./dist"
  });
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch("./dist/*.html").on('change', browserSync.reload);
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(file('CNAME', 'jacobson.wedding'))
    .pipe(ghPages({ branch: 'gh-pages' }));
});
