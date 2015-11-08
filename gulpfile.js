var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;
var mocha = require('gulp-mocha');

var logging = false;

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
    nodemon({script: 'server.js'});
});

gulp.task('mochaTest', function () {
    return gulp.src(['test/*.js'], {read: false})
        .pipe(mocha({
            reporter: 'spec'
        }))
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});

gulp.task('start-app', runCommand('npm start'));

gulp.task('start-mongo', runCommand('rm -fr /tmp/invoice-data && mkdir /tmp/invoice-data && mongod --dbpath /tmp/invoice-data'));

gulp.task('stop-mongo', runCommand('mongo --eval "db.getSiblingDB(\'admin\').shutdownServer()"'));

gulp.task('test', ['start-mongo', 'start-app', 'mochaTest', 'stop-mongo']);

gulp.task('start-dev', ['start-mongo', 'start-app-dev']);