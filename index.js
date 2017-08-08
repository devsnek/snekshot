const child_process = require('child_process');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const request = require('../snekfetch');
const unlinkAsync = util.promisify(fs.unlink);

async function snekshot({ filename, bucket, key, secret }) {
  await exec(`screencapture -i ${filename}`);
  const date = await exec('date +"%a, %d %b %Y %T %z"');
  const safe_filename = encodeURIComponent(filename);
  const sig = await signature({
    content_type: 'image/png',
    date, bucket, safe_filename, secret,
  });
  return request.put(`https://${bucket}.s3.amazonaws.com/${safe_filename}`, {
    agent: new https.Agent({ rejectUnauthorized: false }),
  })
    .set({
      Host: `${bucket}.s3.amazonaws.com`,
      Date: date,
      Authorization: `AWS ${key}:${sig}`,
      'Content-Type': 'image/png',
      'x-amz-acl': 'public-read',
    })
    .send(fs.readFileSync(filename))
    .then(() => unlinkAsync(filename))
    .then(() => filename);
}

function signature({ content_type, date, bucket, safe_filename, secret }) {
  const body = `PUT\n\n${content_type}\n${date}\nx-amz-acl:public-read\n/${bucket}/${safe_filename}`;
  return crypto.createHmac('sha1', secret).update(body).digest('base64');
}

function exec(str) {
  return new Promise((resolve, reject) => {
    child_process.exec(str, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout.trim());
    });
  });
}

module.exports = snekshot;
