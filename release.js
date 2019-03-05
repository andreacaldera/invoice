/* eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

const { execSync } = require('child_process');

const branch = execSync('git branch | grep \\* | cut -d " " -f2')
  .toString()
  .trim();

console.log('Current branch', branch);

execSync('git checkout master && git pull', {
  stdio: [process.stdin, process.stdout, process.stderr],
});

execSync(`git rebase ${branch}`, {
  stdio: [process.stdin, process.stdout, process.stderr],
});

execSync('git push origin master', {
  stdio: [process.stdin, process.stdout, process.stderr],
});
