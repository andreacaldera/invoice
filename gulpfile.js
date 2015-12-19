var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var exec = require('child_process').exec
var mocha = require('gulp-mocha')
var gutil = require('gulp-util')
var del = require('del')
var fs = require('fs')

var logging = false
var mongoData = '/tmp/invoice-data'


function runCommand(command) {
    return function (cb) {
        exec(command, function (error, stdout, stderr) {
            if (logging) {
                gutil.log(stderr);
                gutil.log(stdout);
            }
            cb(error);
        });
    }
}


function shutdown() {
    stopMongo()(function () {
        stopApp()(function () {
            process.exit(1)
        })
    })
}


// Application //
gulp.task('start-app-dev', function () {
    nodemon({
        script: 'server.js',
        env: {'LOG': 'debug'}
    })
})
function stopApp() {
    return runCommand('kill $(cat invoice.pid)')
}
gulp.task('start-app', runCommand('npm start'))
gulp.task("stop-app", ['mocha-test'], stopApp())


// Mongo //
function stopMongo() {
    return runCommand('mongo admin --eval "db.shutdownServer();"')
}
gulp.task('start-mongo-dev', runCommand('rm -fr ' + mongoData + ' && mkdir ' + mongoData + ' && mongod --dbpath ' + mongoData))

gulp.task('start-mongo', runCommand('rm -fr ' + mongoData + ' && mkdir ' + mongoData + ' && mongod --fork --dbpath ' + mongoData + ' --logpath ' + mongoData + '/mongo.log'))
gulp.task('stop-mongo', ['stop-app'], stopMongo())


gulp.task('mocha-test', function () {
    return gulp.src(['test/*.js'], {read: false})
        .pipe(mocha({reporter: 'spec', timeout: 5000}))
        .on('error', function (error) {
            gutil.log('Test failure', error)
            shutdown()
        })
})

gulp.task('clean', function(done) {
    del.sync(['output'])
    fs.mkdirSync('output');
    done()
})

gulp.task('exit', ['clean', 'mocha-test', 'stop-app', 'stop-mongo'], process.exit)

// Main tasks //
gulp.task('default', ['start-mongo', 'start-app', 'mocha-test', 'stop-app', 'stop-mongo', 'exit'])
gulp.task('dev', ['start-mongo-dev', 'start-app-dev'])