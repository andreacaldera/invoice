/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const fs = require('fs');

const TYPES = ['major', 'minor', 'hotfix'];

const { TYPE } = process.env;

const { version } = JSON.parse(fs.readFileSync('package.json'));

const versions = version.split('.');

const outputVersion = (major, minor = 0, hotfix = 0) => {
  const newVersion = [`${major}`, `${minor}`, `${hotfix}`].join('.');
  console.log(newVersion);
};

switch (TYPE) {
  case 'major':
    outputVersion(Number(versions[0] + 1));
    break;

  case 'minor':
    outputVersion(versions[0], Number(versions[1]) + 1);
    break;

  case 'hotfix':
    outputVersion(versions[0], versions[1], Number(versions[2]) + 1);
    break;

  default:
    console.error('process.env.TYPE must be one of ', TYPES);
    process.exit(1);
}
