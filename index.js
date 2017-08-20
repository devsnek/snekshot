const https = require('https');
const crypto = require('crypto');
const request = require('snekfetch');
const exec = require('./exec');

async function upload({ filename, file, secret, bucket, key, redirect }) {
  const date = await exec('date +"%a, %d %b %Y %T %z"');
  const safe_filename = encodeURIComponent(filename);
  const sig = await signature({
    content_type: 'image/png',
    date, bucket, safe_filename, secret, redirect,
  });
  const headers = {
    Host: `${bucket}.s3.amazonaws.com`,
    Date: date,
    Authorization: `AWS ${key}:${sig}`,
    'Content-Type': 'image/png',
    'x-amz-acl': 'public-read',
  };
  if (redirect) headers['x-amz-website-redirect-location'] = redirect;
  return request.put(`https://${bucket}.s3.amazonaws.com/${safe_filename}`, {
    agent: new https.Agent({ rejectUnauthorized: false }),
  })
    .set(headers)
    .send(file)
    .then((r) => r.body);
}

function signature({ content_type, date, bucket, safe_filename, secret, redirect }) {
  let body = `PUT\n\n${content_type}\n${date}\nx-amz-acl:public-read`;
  if (redirect) body = `${body}\nx-amz-website-redirect-location:${redirect}`;
  return crypto.createHmac('sha1', secret).update(`${body}\n/${bucket}/${safe_filename}`).digest('base64');
}

module.exports = upload;
