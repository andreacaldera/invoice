var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;
var install = require("gulp-install");

function runCommand(command) {
    return function (cb) {
        exec(command, function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
}

gulp.task('start-app', function () {
    nodemon(
        {script: 'server.js'})
        .on('restart', function () {
            console.log('restarted!')
        });
});

gulp.task('start-mongo', runCommand('rm -fr /tmp/invoice-data && mkdir /tmp/invoice-data && mongod --dbpath /tmp/invoice-data'));
gulp.task('stop-mongo', runCommand('mongo --eval "use admin; db.shutdownServer();"'));

gulp.task('default', []);