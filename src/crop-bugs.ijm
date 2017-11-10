inputPath = "/home/select/Dev/bugs/data/raw/";

setBatchMode(true);
list = getFileList(inputPath);
for (i = 0; i < list.length; i++) {
	cropFile(inputPath, list[i]);
}

function cropFile(path, fileName) {
	open(path + fileName);
	run("Duplicate...", "title=particles");

	run("Subtract Background...", "rolling=15 light");
	run("8-bit");
	setAutoThreshold("Default");
	call("ij.plugin.frame.ThresholdAdjuster.setMode", "B&W");
	setOption("BlackBackground", false);
	run("Convert to Mask");
	run("Fill Holes");
	run("Analyze Particles...", "size=500-10000 display exclude clear add");


	// File.makeDirectory(dirCropOutput);
	selectWindow(fileName);
	for (u=0; u<roiManager("count"); ++u) {
		run("Duplicate...", "title=crop");
		roiManager("Select", u);
		run("Crop");
		getSelectionBounds(x, y, widthSel, heightSel);
		ratio=widthSel/heightSel;
		if (ratio > 0.14 && ratio < 6.5) {
			saveAs("png", "/home/select/Dev/bugs/data/crop/"+fileName+'.'+u+".png");
		} else {
			saveAs("png", "/home/select/Dev/bugs/data/bad/"+fileName+'.'+u+".png");
		}
		close();
		//Next round!
		selectWindow(fileName);
	}
	//selectWindow("particles");
	close();
}


