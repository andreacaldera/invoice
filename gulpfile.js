var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;
var mocha = require('gulp-mocha');
var del = require('del');
var mkdirs = require('mkdirs');

var logging = false;
var mongoData = '/tmp/invoice-data';

function runCommand(command) {
    return function (cb) {
        exec(command, function (error, stdout, stderr) {
            if (logging) {
                console.error(stderr);
                console.log(stdout);
            }
            cb(error);
        });
    }
}

gulp.task('start-app-dev', function () {
    nodemon({
        script: 'server.js',
        env: {'LOG': 'debug'}
    });
});

gulp.task('mocha-test', function (done) {
    return gulp.src(['test/*.js'], {read: false})
        .pipe(mocha({
            reporter: 'spec'
        }))
        .once('error', function (error) {
            console.error(error);
            done();
        });
});


gulp.task('start-app', runCommand('npm start'));
gulp.task("stop-app", ['mocha-test'], runCommand('kill $(cat invoice.pid)'));

gulp.task('start-mongo-dev', runCommand('rm -fr ' + mongoData + ' && mkdir ' + mongoData + ' && mongod --dbpath ' + mongoData));

gulp.task('start-mongo', runCommand('rm -fr ' + mongoData + ' && mkdir ' + mongoData + ' && mongod --fork --dbpath ' + mongoData + ' --logpath ' + mongoData + '/mongo.log'));
gulp.task('stop-mongo', ['stop-app'], runCommand('mongo admin --eval "db.shutdownServer();"'));

// Main tasks //
gulp.task('default', ['start-mongo', 'start-app', 'mocha-test', 'stop-app', 'stop-mongo']);
gulp.task('dev', ['start-mongo-dev', 'start-app-dev']);





////////////////////////////////////////////////
// Review the following tasks and their usage //
////////////////////////////////////////////////
gulp.task('delete-npm-logs', ['mocha-test'], function () {
    return del([
        './npm-debug.log*'
    ]);
});
//gulp.task("start-mongo", function () {
//    var dbLogs = '/tmp/invoice-data-log';
//    var command = "mongod --fork --dbpath " + mongoData + "/ --logpath " + dbLogs + "/mongo.log";
//    mkdirs(mongoData);
//    mkdirs(dbLogs);
//    runCommand(command);
//});