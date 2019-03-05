/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const fs = require('fs');

if (!process.env.TARGET_BRANCH) {
  console.log('You must specify TARGET_BRANCH');
  process.exit(1);
}

const jenkinsfile = fs.readFileSync('Jenkinsfile', 'utf-8');

const updatedJenkinsfile = jenkinsfile.replace(
  /branch ".*"/g,
  `branch "${process.env.TARGET_BRANCH}"`
);

fs.writeFileSync('Jenkinsfile', updatedJenkinsfile);
