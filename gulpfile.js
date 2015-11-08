var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;
var mocha = require('gulp-mocha');

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

gulp.task('mochaTest', function() {
    return gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('start-mongo', runCommand('rm -fr /tmp/invoice-data && mkdir /tmp/invoice-data && mongod --dbpath /tmp/invoice-data'));
gulp.task('stop-mongo', runCommand('mongo --eval "use admin; db.shutdownServer();"'));

gulp.task('test', ['mochaTest']);

