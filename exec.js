'use strict';

const childProcess = require('child_process');

function exec(str) {
  return new Promise((resolve, reject) => {
    const child = childProcess.exec(str, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
    child.stdin.end();
  });
}

module.exports = exec;
