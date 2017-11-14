#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Crawler = require('crawler');
const config = require('./config');

module.exports = function() {
	const sourcePath = path.normalize(`${config.dataDir}/highRes`);
	const fileName = fs.readdirSync(sourcePath)[0];
	console.log('fileName', fileName);
	const name = path.basename(fileName, '.jpg');

	const resPath = path.normalize(`${config.dataDir}/res/${name}`);
	console.log(`creating directory ${resPath}`);
	if (!fs.existsSync(resPath)) {
		fs.mkdirSync(resPath);
		fs.mkdirSync(path.normalize(`${resPath}/bad`));
		fs.mkdirSync(path.normalize(`${resPath}/crop`));
	}

	var exec = require('child_process').exec;
	const scriptPath = path.normalize(`${__dirname}/crop-bugs.ijm`);
	
	exec(`E:\\git\\ij150-win-java8\\ImageJ -x 7896 "${scriptPath}" -batchpath`, (error, stdout, stderr) => {
		console.log('stderr', stderr);
		console.log('stdout', stdout);
		fs.unlinkSync(path.normalize(`${sourcePath}/${fileName}`));
		console.log('Done!');
	});
};
