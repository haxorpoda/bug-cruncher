#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Crawler = require('crawler');
const config = require('./config');

module.exports = function() {
	const sourcePath = `${config.dataDir}/highRes`;
	const fileName = fs.readdirSync(sourcePath)[0];
	console.log('fileName', fileName);
	const name = path.basename(fileName, '.jpg');

	const resPath = `${config.dataDir}/res/${name}`;
	console.log(`creating directory ${resPath}`);
	if (!fs.existsSync(resPath)) {
		fs.mkdirSync(resPath);
		fs.mkdirSync(`${resPath}/bad`);
		fs.mkdirSync(`${resPath}/crop`);
	}

	var exec = require('child_process').exec;
	exec(`imagej -x 7896 "${__dirname}/crop-bugs.ijm" -batchpath`, (error, stdout, stderr) => {
		console.log('stderr', stderr);
		console.log('stdout', stdout);
		fs.unlinkSync(`${sourcePath}/${fileName}`);
		console.log('Done!');
	});
};
