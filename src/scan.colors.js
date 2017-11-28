#!/usr/bin/env node
const fs = require('fs');
const execSync = require('child_process').execSync;

const config = require('./config');

// const baseDir = `../data/BeispielKaefer`
const baseDir = `../data/Insekten_Mittel`

const fileColor = fs
  .readdirSync(baseDir)
  .map(file => {
    const resBuffer = execSync(`./average.color.py ${baseDir}/${file}`, 'inherit');
    return {
      file,
      colors: JSON.parse(resBuffer.toString())
    }
  });

// console.log("fileColor", fileColor);

fs.writeFileSync(`${config.dataDir}/colors.js`, `export const fileColors = ${JSON.stringify(fileColor, null, 2)}`);
process.stdout.write(`\nwrote file ${config.dataDir}/colors.json\n`);

