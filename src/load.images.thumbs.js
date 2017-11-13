#!/usr/bin/env node
const fs = require('fs');
const Crawler = require('crawler');
const config = require('./config');

const urlsText = fs.readFileSync(`${config.dataDir}/thumbNames.txt`, 'utf8');

const urls = urlsText
  .split('\n')
  .filter(n => !!n)
  .map(n => ({
    uri: `http://gbif.naturkundemuseum-berlin.de/hackathon/Insektenkasten/Thumbs/${n}`,
    fileName: n,
  }));

console.log("urls", urls);

var crawler = new Crawler({
  encoding: null,
  jQuery: false, // set false to suppress warning message.
  maxConnections: 10,
  callback: function(err, res, done) {
    if (err) {
      console.error(err.stack);
    } else {
      fs.createWriteStream(`${config.dataDir}/raw/${res.options.fileName}`).write(res.body);
    }
    done();
  },
});

// Queue a list of URLs
crawler.queue(urls);

crawler.on('drain', () => {
  console.log('Done!');
});
