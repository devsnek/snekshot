'use strict';

const path = require('path');
const util = require('util');
const copy = util.promisify(require('copy-paste').copy);
const notifier = require('node-notifier');
const snekv = require('snekparse')(process.argv);
const upload = require('../');
const exec = require('../exec');

function getOSStoragePath() {
  switch (process.platform) {
    case 'win32':
      return process.env.APPDATA;
    case 'darwin':
    case 'linux':
      return `${process.env.HOME}/.config`;
    default:
      return '.';
  }
}

const RC_FILE_PATH = path.join(getOSStoragePath(), '.snekshotrc');

let config = {};
try {
  config = require(RC_FILE_PATH);
} catch (err) {} // eslint-disable-line no-empty

const bucket = snekv.bucket || config.bucket;

function run({ filename, file, redirect }) {
  return upload({
    filename,
    file,
    redirect,
    bucket,
    key: snekv.key || config.key,
    secret: snekv.secret || config.secret,
  })
    .then(() => {
      const final = `${config.endpoint || `https://${bucket}`}/${filename}`;
      process.stdout.write(`${final}\n`);
      notifier.notify({
        title: path.basename(module.parent.filename).split('.')[0],
        message: final,
      });
      if (process.platform === 'darwin') {
        return exec(`echo "${final}" | tr -d '\n' | LANG=en_US.UTF-8 pbcopy`);
      }
      return copy(final);
    })
    .catch((err) => {
      process.stderr.write(`${err.stack}\n`);
      process.exit(1);
    });
}

module.exports = {
  makeName: config.makeName || (() => Date.now().toString()),
  getOSStoragePath,
  run,
  exec,
  snekv,
};
