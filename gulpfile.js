'use strict';

var gulp = require('gulp');
var minifyJS = require('gulp-uglify');
var babel = require('gulp-babel');
var minifyCss = require('gulp-csso');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

gulp.task('babel', () => {
	return gulp.src('./src/js/*.js')
		.pipe(babel())
		.pipe(minifyJS())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./public/javascripts'));

});
gulp.task('sass', () => {
	return gulp.src('./src/sass/style.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(minifyCss())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./public/stylesheets'));

});

gulp.task('watch', function () {
	gulp.watch("./src/**/*.sass", ['sass']);
	gulp.watch("./src/**/*.js", ['babel']);
});

gulp.task('default', ['babel', 'sass', 'watch']);
