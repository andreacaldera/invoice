/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const { execSync } = require('child_process');
const fs = require('fs');

const { version } = JSON.parse(fs.readFileSync('package.json'));
console.log('Current version:', version);

execSync('npm version minor', {
  stdio: [process.stdin, process.stdout, process.stderr],
});

const newVersion = JSON.parse(fs.readFileSync('package.json')).version;
console.log('Current version:', newVersion);
