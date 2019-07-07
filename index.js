'use strict';

const https = require('https');
const crypto = require('crypto');
const request = require('snekfetch');
const exec = require('./exec');

function signature({ contentType, date, bucket, safeFilename, secret, redirect }) {
  let body = `PUT\n\n${contentType}\n${date}\nx-amz-acl:public-read`;
  if (redirect) {
    body = `${body}\nx-amz-website-redirect-location:${redirect}`;
  }
  return crypto.createHmac('sha1', secret).update(`${body}\n/${bucket}/${safeFilename}`).digest('base64');
}

async function upload({ filename, file, secret, bucket, key, redirect }) {
  const date = await exec('date +"%a, %d %b %Y %T %z"');
  const safeFilename = encodeURIComponent(filename);
  const sig = await signature({
    contentType: 'image/png',
    date,
    bucket,
    safeFilename,
    secret,
    redirect,
  });
  const headers = {
    'Date': date,
    'Authorization': `AWS ${key}:${sig}`,
    'Content-Type': 'image/png',
    'x-amz-acl': 'public-read',
  };
  if (redirect) {
    headers['x-amz-website-redirect-location'] = redirect;
  }
  return request.put(`https://s3.amazonaws.com/${bucket}/${safeFilename}`, {
    agent: new https.Agent({ rejectUnauthorized: false }),
  })
    .set(headers)
    .send(file)
    .then((r) => r.body);
}

module.exports = upload;
