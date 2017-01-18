const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const exec = require('child_process').exec;
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const del = require('del');
const fs = require('fs');

const logging = false;
const mongoDataDev = '/tmp/invoice-data';
const mongoData = './mongo-data';

function runCommand(command) {
  return (cb) => {
    exec(command, (error, stdout, stderr) => {
      if (logging) {
        gutil.log(stderr);
        gutil.log(stdout);
      }
      cb(error);
    });
  };
}

// Application //
gulp.task('start-app-dev', () => {
  nodemon({
    script: 'server.js',
    env: { LOG: 'debug' },
  });
});
function stopApp() {
  return runCommand('kill $(cat invoice.pid)');
}
gulp.task('start-app', runCommand('npm start'));
gulp.task('stop-app', ['mocha-test'], stopApp());

// Mongo //
function stopMongo() {
  return runCommand('mongo admin --eval "db.shutdownServer();"');
}
gulp.task('start-mongo-dev', runCommand(`rm -fr ${mongoDataDev} && mkdir ${mongoDataDev} && mongod --dbpath ${mongoDataDev}`));

gulp.task('start-mongo', runCommand(`mongod --fork --dbpath ${mongoData} --logpath ${mongoData}/mongo.log`));
gulp.task('stop-mongo', ['stop-app'], stopMongo());

gulp.task('setup-data', runCommand('node setup.private.js'));

function shutdown() {
  stopMongo()(() => {
    stopApp()(() => {
      process.exit(1);
    });
  });
}

gulp.task('mocha-test', () => gulp.src(['test/*.js'], { read: false })
        .pipe(mocha({ reporter: 'spec', timeout: 5000 }))
        .on('error', (error) => {
          gutil.log('Test failure', error);
          shutdown();
        }));

gulp.task('clean', (done) => {
  del.sync(['output']);
  fs.mkdirSync('output');
  done();
});

gulp.task('exit', ['clean', 'mocha-test', 'stop-app', 'stop-mongo'], process.exit);

// Main tasks //
gulp.task('default', ['start-mongo', 'start-app', 'mocha-test', 'stop-app', 'stop-mongo', 'exit']);
gulp.task('dev', ['start-mongo-dev', 'setup-data', 'start-app-dev']);
gulp.task('live', ['start-app-dev']);
