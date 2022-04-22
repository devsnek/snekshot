#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const {
  promises: {
    unlink,
    readdir,
  },
} = require('fs');

const common = require('./common');

const filename = common.snekv.filename || `${common.makeName()}.png`;
const full = path.resolve(filename);

function getScreenshotCommand() {
  switch (process.platform) {
    case 'darwin':
      return 'screencapture -i';
    case 'linux':
      return 'scrot -fs';
    default:
      throw new Error('unsupported platform');
  }
}

common.exec(`${getScreenshotCommand()} ${full}`)
  .then(() => common.run({
    filename,
    file: fs.readFileSync(full),
  }))
  .then(async () => {
    const files = await readdir(path.dirname(full));
    const name = files.find((n) => n.normalize() === filename.normalize());
    await unlink(name);
  })
  .then(() => process.exit(0));
