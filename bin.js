#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const copy = util.promisify(require('copy-paste').copy);
const notifier = require('node-notifier');
const snekshot = require('./index');
const chars = require('./chars.json');

const snekv = require('snekparse')(process.arvg);

const RC_FILE_PATH = path.join(getOSStoragePath(), '.snekshotrc');

let config = {};
try {
  config = JSON.parse(fs.readFileSync(RC_FILE_PATH));
} catch (err) {} // eslint-disable-line no-empty

const filename = snekv.filename || `${makeName(3)}.png`;
const bucket = config.bucket || snekv.bucket;

snekshot({
  filename, bucket,
  key: config.key || snekv.key,
  secret: config.secret || snekv.secret,
}).then(() => {
  const final = `${config.endpoint || `https://${bucket}`}/${filename}`;
  process.stdout.write(final);
  notifier.notify({
    title: 'Snekshot',
    message: final,
  });
  return copy(final);
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
