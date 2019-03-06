/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const fs = require('fs');

const TYPES = ['major', 'minor', 'hotfix'];

const TYPE = process.env;

if (!TYPES.includes(TYPE)) {
  console.error('process.env.TYPE must be one of ', TYPES);
  process.exit(1);
}

const { version } = JSON.parse(fs.readFileSync('package.json'));

const versions = version.split('.');
const newVersion = [versions[0], `${Number(versions[1]) + 1}`, '0'].join('.');

console.log(newVersion);
