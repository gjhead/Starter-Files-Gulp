// Include gulp

var gulp = require('gulp');

// Include any plugins

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var kit = require('gulp-kit');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');


// Lint my custom js file
gulp.task('lint', function() {
    return gulp.src('./a/js/script.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
      './a/js/jquery/jquery.js', 
      './a/js/plugins/**/*.js', 
      './a/js/script.js'
    ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('./build/js'))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
});


// Compile CSS
gulp.task('styles', function() {
	
	return gulp.src('./a/sass/screen.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sass({outputStyle: 'expanded'}))// compact, compressed, nested or expanded
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build/css'))
		.pipe(rename({suffix: '.min'}))
});


// Compile kit files
gulp.task('html', function() {
  return gulp.src('./a/kit/**/*.kit')
    .pipe(kit())
    .pipe(gulp.dest('./build/'))
});


// Copy Static Assets 
gulp.task('copy', function(){
  gulp.src([
    './static/**'
  ])
  .pipe(gulp.dest('./build/assets/'));

  gulp.src([
    './basedir/**'
  ])
  .pipe(gulp.dest('./build/'));  
});


// Watch Task
gulp.task('watch', ['lint', 'scripts', 'styles', 'html'], function(){
	
	livereload.listen();
	
	gulp.watch('./a/kit/**/*.kit', ['html']).on('change', livereload.changed);
	gulp.watch('./a/js/script.js', ['lint']).on('change', livereload.changed);
	gulp.watch('./a/js/**/*.js', ['scripts']).on('change', livereload.changed);
	gulp.watch('./a/sass/**/*.scss', ['styles']).on('change', livereload.changed);
	gulp.watch(['./static/**', './basedir/**'], ['copy']).on('change', livereload.changed);
});



// Default Task
gulp.task('default', ['lint', 'scripts', 'styles', 'html', 'watch']);