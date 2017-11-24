inputPath = '/home/select/bug-cruncher-data/highRes/';
resPath = '/home/select/bug-cruncher-data/res/';

print(inputPath);
list = getFileList(inputPath);
for (i = 0; i < list.length; i++) {
	baseName = substring(list[i], 0, lengthOf(list[i]) - 4);
	if (File.isDirectory(resPath + baseName)) {
		print('Exists: ' + resPath + baseName);
	} else {
		print('Does not exists : ' + resPath + baseName);
		cropFile(inputPath + list[i], baseName);
		exit("Done with one!");
	}
}

function cropFile(filePath, baseName) {
	File.makeDirectory(resPath + baseName);
	File.makeDirectory(resPath + baseName + '/bad');
	File.makeDirectory(resPath + baseName + '/crop');

	print('open ' + filePath);
	open(filePath);

	imageId = getImageID();

	run('Duplicate...', 'title=particles');
	imageIdParticles = getImageID();

	print('Subtract Background');
	run('Subtract Background...', 'rolling=500 light');

	print('8-bit');
	run('8-bit');

	print('Convert to Mask');
	run('Convert to Mask');

	print('Analyze Particles');
	run('Analyze Particles...', 'size=80000-10000000 exclude clear add');
	// run("Analyze Particles...", "size=500-15000 exclude clear add");

	// run("Line Width...", "line=2");
	// run('Colors...', 'foreground=white background=black selection=red');
	run('Labels...', 'color=white font=200 show draw');
	saveAs('png', resPath + baseName + '/' + baseName + '.map.png');

	print('save ' + roiManager('count') + ' files');
	selectImage(imageId);
	for (u = 0; u < roiManager('count'); ++u) {
		run('Duplicate...', 'title=crop');
		roiManager('Select', u);
		run('Crop');
		getSelectionBounds(x, y, widthSel, heightSel);
		ratio = widthSel / heightSel;
		if (ratio > 0.14 && ratio < 6.5) {
			saveAs(
				'png',
				resPath + baseName + '/crop/' + baseName + '.' + u + '.png'
			);
		} else {
			saveAs('png', resPath + baseName + '/bad/' + baseName + '.' + u + '.png');
		}
		selectImage(imageId);
	}
	selectImage(imageIdParticles);
	close();
}
