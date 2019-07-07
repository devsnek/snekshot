'use strict';

const childProcess = require('child_process');

function exec(str) {
  return new Promise((resolve, reject) => {
    childProcess.exec(str, (err, stdout) => {
      if (err) {
        reject(err);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

module.exports = exec;
