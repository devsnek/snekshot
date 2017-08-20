#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const copy = util.promisify(require('copy-paste').copy);
const notifier = require('node-notifier');
const upload = require('./index');
const chars = require('./chars');
const exec = require('./exec');

const unlinkAsync = util.promisify(fs.unlink);

const snekv = require('snekparse')(process.argv);

const RC_FILE_PATH = path.join(getOSStoragePath(), '.snekshotrc');

let config = {};
try {
  config = JSON.parse(fs.readFileSync(RC_FILE_PATH));
} catch (err) {} // eslint-disable-line no-empty

const filename = snekv.filename || `${makeName(3)}.png`;
const bucket = snekv.bucket || config.bucket;


exec(`${getScreenshotCommand()} ${filename}`)
  .then(() => upload({
    filename,
    file: fs.readFileSync(filename),
    bucket,
    key: snekv.key || config.key,
    secret: snekv.secret || config.secret,
  })).then(() => {
    const final = `${config.endpoint || `https://${bucket}`}/${filename}`;
    process.stdout.write(`${final}\n`);
    notifier.notify({
      title: 'Snekshot',
      message: final,
    });
    if (process.platform === 'darwin') {
      return exec(`echo "${final}" | LANG=en_US.UTF-8 pbcopy`);
    } else {
      return copy(final);
    }
  })
  .then(() => unlinkAsync(filename))
  .catch((err) => {
    process.stderr.write(`${err.message}\n`);
    process.exit(1);
  });

function makeName(length) {
  let name = [];
  while (name.length < length) name.push(chars[Math.floor(Math.random() * chars.length)]);
  return name.join('');
}

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

function getScreenshotCommand() {
  switch (process.platform) {
    case 'darwin':
      return 'screencapture -i';
    case 'linux':
      return 'import';
    default:
      throw new Error('unsupported platform');
  }
}
