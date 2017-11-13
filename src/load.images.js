#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const Crawler = require('crawler');

const config = require('./config');
const crop = require('./crop.current');

const urlsText = fs.readFileSync(path.normalize(`${config.dataDir}/highResNames.txt`), 'utf8');

const urls = urlsText
  .split('\n')
  .filter(n => !!n)
  .map(n => ({
    uri: `http://gbif.naturkundemuseum-berlin.de/hackathon/Insektenkasten/High_resolution/${n}`,
    fileName: n,
  }));

var randomUrl = urls[Math.floor(Math.random()*urls.length)];

console.log(`get URL ${randomUrl.uri}`);
var crawler = new Crawler({
  encoding: null,
  jQuery: false, // set false to suppress warning message.
  maxConnections: 10,
  callback: function(err, res, done) {
  
    if (err) {
      console.error(err.stack);
    } else {
      console.log(path.normalize(`${config.dataDir}/highRes/${res.options.fileName}`));

      const tempFilepath = path.normalize(`E:\\git\\bug-cruncher\\data\\highRes\\${res.options.fileName}`); // ${config.dataDir}/highRes/${res.options.fileName}




      tempFile = fs.writeFileSync(tempFilepath, res.body);
    }
    done();
  },
});

// Queue a list of URLs
crawler.queue([randomUrl]);

crawler.on('drain', () => {
  crop();
});

