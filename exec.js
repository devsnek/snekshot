const child_process = require('child_process');

function exec(str) {
  return new Promise((resolve, reject) => {
    child_process.exec(str, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout.trim());
    });
  });
}

module.exports = exec;
