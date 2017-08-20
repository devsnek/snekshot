const chars = new Set();
const ranges = [
  [0x30, 0x39], // numbers
  [0x41, 0x5a], // uppercase chars
  [0x61, 0x7a], // lowercase chars
  [0xbc, 0x2af], // weird characters with accents, etc
  [0x25a0, 0x27ff], // dingbats, etc
  [0x1f300, 0x1f64f], // emoticons
  [0x1f910, 0x1f9e6], // emoticons 2
];

for (const [x, y] of ranges) {
  for (let i = x; i < y; i++) chars.add(String.fromCharCode(i));
}

module.exports = Array.from(chars);
