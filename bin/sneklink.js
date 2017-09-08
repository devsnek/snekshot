#!/usr/bin/env node

const common = require('./common');

const filename = common.snekv.filename || `${common.makeName(4)}`;

const long = process.argv[2];

common.run({
  file: Buffer.from(`Redirecting to ${long}`),
  filename,
  redirect: long,
})
  .then(() => process.exit(0));
