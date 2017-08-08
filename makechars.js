const fs = require('fs');

const chars = new Set();
const ranges = [
  [0x30, 0x3a], // numbers
  [0x41, 0x5b], // uppercase chars
  [0x61, 0x7b], // lowercase chars
  [0xbc, 0x2b0], // weird characters with accents, etc
  [0x25a0, 0x2800], // dingbats, etc
  [0x1f300, 0x1f650], // emoticons
];

for (const [x, y] of ranges) {
  for (let i = x; i < y; i++) chars.add(String.fromCharCode(i));
}

fs.writeFileSync('./chars.json', JSON.stringify(Array.from(chars)));
