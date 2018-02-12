#!/usr/bin/env node
const jpeg = require('jpeg-js');
const jsQR = require('jsqr');
const fs = require('fs');

var jpegData = fs.readFileSync(process.argv[2]);
var imageData = jpeg.decode(jpegData);
console.log('imageData', imageData);
const code = jsQR(imageData.data, imageData.width, imageData.height);

if (code) {
  console.log('Found QR code', code);
}
