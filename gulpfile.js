"use strict"
// get the dependencies
let gulp        = require('gulp'),
    childProcess  = require('child_process'),
    electron      = require('electron');

// create the gulp task
gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});