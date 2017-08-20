#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

const common = require('./common');

const filename = common.snekv.filename || `${common.makeName(3)}.png`;

common.exec(`${getScreenshotCommand()} ${filename}`)
  .then(() => common.run({
    filename,
    file: fs.readFileSync(filename),
  }))
  .then(() => unlinkAsync(filename));

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
