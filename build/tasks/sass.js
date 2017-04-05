'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var paths = require('../paths');


/**
 * Sass task
 * Run using "gulp sass"
 * Searches for sass files in paths.sassSrc
 * Compiles sass to css
 * Auto prefixes css
 * Writes css to paths.cssDir
 */
gulp.task('sass', function() {
    // Searches for sass files in paths.sassSrc
    gulp.src(paths.sassSrc)
        // Compiles sass to css
        .pipe(sass({
            outputStyle: 'minified',
        })
        .on('error', sass.logError))

        // Auto prefixes css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))

        // Writes css to paths.cssDir
        .pipe(gulp.dest(paths.cssDir));
});
