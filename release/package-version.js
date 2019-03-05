/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const fs = require('fs');

const { version } = JSON.parse(fs.readFileSync('package.json'));
console.log(version);
