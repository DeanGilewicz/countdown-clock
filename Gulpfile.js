var gulp = require('gulp'),
	autoprefixer = require('autoprefixer'),
	cssnano = require('cssnano'),
	jshint = require('gulp-jshint'),
	livereload = require('gulp-livereload'),
	postcss = require('gulp-postcss'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify');


gulp.task('express', function() {
	var express = require('express');
	var app = express();
	app.use(express.static(__dirname + '/dist', {'extensions': ['html']}));
	app.listen(4000);
});


gulp.task('jshint', function() {
	return gulp.src('scripts/main.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('minify-main-js', function() {
	return gulp.src('scripts/main.js')
		.pipe(sourcemaps.init()) 
		.pipe(uglify().on('error', function(e) {
			console.log(e.message);
			return this.end();
		}))
		.pipe(rename('main.min.js'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/js'))
		.pipe(livereload());
});


gulp.task('minify-css', function() {
	var processors = [
		autoprefixer({browsers: ['last 4 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
		cssnano
	];
	return gulp.src('styles/sass/main.scss')
		.pipe(sass({ outputStyle: 'expanded' })
			.on('error', sass.logError)
		)
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(rename('main.min.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/css'))
		.pipe(livereload());
});


gulp.task('html', function () {
	return gulp.src('templates/index.html')
		.pipe(gulp.dest('dist/'))
		.pipe(livereload())
});


gulp.task('watch', function() {
	livereload.listen({ quiet: true });
	gulp.watch(['styles/sass/**'], ['minify-css']);
	gulp.watch(['scripts/main.js'], ['jshint', 'minify-main-js']);
	gulp.watch(['templates/**'], ['html']);
});


gulp.task('default', ['express', 'watch', 'jshint', 'minify-css', 'minify-main-js', 'html'], function() {
	console.log('gulp is watching and will rebuild when changes are made...');
});

