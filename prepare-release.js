/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const { execSync } = require('child_process');
const fs = require('fs');

const { version } = JSON.parse(fs.readFileSync('package.json'));
console.log('Current version:', version);

const versions = version.split('.');
const newVersion = [versions[0], `${Number(versions[1]) + 1}`, '0'].join('.');

console.log('New version', newVersion);

const branch = `v${newVersion}`;

execSync(`git checkout -b ${branch}`, {
  stdio: [process.stdin, process.stdout, process.stderr],
});

execSync('npm version minor', {
  stdio: [process.stdin, process.stdout, process.stderr],
});

execSync(`git push origin ${branch}`, {
  stdio: [process.stdin, process.stdout, process.stderr],
});

const updatedVersion = JSON.parse(fs.readFileSync('package.json')).version;
console.log('Updated version:', updatedVersion);
