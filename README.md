# snekshot

### General Usage:

- `~$ snekshot`
- `~$ sneklink <some link here>`

---

### API

```js
const s = require('snekshot');

// upload some file
s({
  filename: 'aaa.png',
  file: fs.readFileSync('./aaa.png'),
  bucket: 'your.bucket',
  key: '<.<',
  secret: '>.>',
});

// make a shortlink
s({
  filename: 'short',
  file: Buffer.from('Redirecting...'),
  redirect: 'https://google.com',
  bucket: 'your.bucket',
  key: ':3',
  secret: ':D',
});
```
