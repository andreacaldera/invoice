var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;
var mocha = require('gulp-mocha');
var del = require('del');
var mkdirs = require('mkdirs');

var logging = true;
var mongoData = '/tmp/invoice-data';

function runCommand(command) {
    return function (cb) {
        exec(command, function (error, stdout, stderr) {
            if (logging) {
                console.error(stderr);
                // console.log(stdout);
            }
            cb(error);
        });
    }
}

function stopMongo() {
    console.log('Stopping MongoDB');
    runCommand('mongo admin --eval "db.shutdownServer();"');
}

gulp.task('start-app-dev', function () {
    nodemon({
        script: 'server.js',
        env: {'LOG': 'debug'}
    });
});

gulp.task('mocha-test', function (done) {
    gulp.src(['test/*.js'], {read: false})
        .pipe(mocha({
            reporter: 'spec'
        }))
        .once('error', function (error) {
            console.log('Test error', error);
        })
        .once('end', function () {
            console.log('tests done');
            // done();
        });
});

gulp.task('delete-npm-logs', ['mocha-test'], function () {
    return del([
        './npm-debug.log*'
    ]);
});

gulp.task('start-app', runCommand('npm start'));

gulp.task("stop-app", ['mocha-test'], runCommand('kill $(cat invoice.pid)'));

gulp.task("start-mongo", function () {
    var dbLogs = '/tmp/invoice-data-log';
    var command = "mongod --fork --dbpath " + mongoData + "/ --logpath " + dbLogs + "/mongo.log";
    mkdirs(mongoData);
    mkdirs(dbLogs);
    runCommand(command);
});

gulp.task('start-mongo-dev', runCommand('rm -fr ' + mongoData + ' && mkdir ' + mongoData + ' && mongod --dbpath ' + mongoData));

gulp.task("stop-mongo", ['mocha-test'], function () {
    var command = 'mongo admin --eval "db.shutdownServer();"';
    runCommand(command);
});

gulp.task('test-setup', ['start-mongo', 'start-app']);
gulp.task('test-tear-down', ['mocha-test', 'stop-app', 'stop-mongo', 'delete-npm-logs']);

gulp.task('test', ['test-setup', 'mocha-test', 'test-tear-down']);

gulp.task('dev', ['start-mongo-dev', 'start-app-dev']);