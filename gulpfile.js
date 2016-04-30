var browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify');

postcss.options = [
  require('postcss-partial-import')(),
  require('postcss-css-variables')(),
  require('postcss-nesting')(),
  require('autoprefixer')({ browsers: ['last 2 versions', 'ie >= 8']  }),
  require('postcss-flexibility')(),
  require('cssnano')()
];

gulp.task('css', function () {
  return gulp.src('./src/css/app.css')
    .pipe(postcss(postcss.options))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('html', function(){
  gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist/'));
});

gulp.task('img', function(){
  gulp.src(['./src/img/*.jpg', './src/img/*.png'])
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['html', 'css', 'js', 'img'], function () {
  browserSync.init({
      server: "./dist"
  });
  gulp.watch('./src/css/**/*.css', ['css']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/img/**/*.jpg', ['img']);
  gulp.watch("./dist/*.html").on('change', browserSync.reload);
});
