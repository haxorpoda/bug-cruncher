#!/usr/bin/env node
const fs = require('fs');
const jpeg = require('jpeg-js');

const dataDir = '../data/thumbs';
const fileList = fs.readdirSync(dataDir).map(file => {
  console.log(file);
  const jpegData = fs.readFileSync(`${dataDir}/${file}`);
  const imageData = jpeg.decode(jpegData);
  const { width, height } = imageData;
  return { fileName: file, width, height };
});

fs.writeFileSync('../data/thumbs.index.json', JSON.stringify(fileList, null, 2));
