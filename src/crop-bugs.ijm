inputPath = "E:\\git\\bug-cruncher\\data\\highRes\\" //--headless --console -macro E:\git\bug-cruncher\src\crop-bugs.ijm;
// inputPath = "/home/select/Dev/bugs/data/highRes/";
// inputPath = "/home/select/Dev/bugs/data/test/";

//setBatchMode(true);
print(inputPath);
list = getFileList(inputPath);
for (i = 0; i < list.length; i++) {
	cropFile(inputPath, list[i]);
}



function cropFile(path, fileName) {
	print('open '+path + fileName);
	open(path + fileName);
	baseName=File.nameWithoutExtension;

	File.makeDirectory( inputPath+"\\..\\res\\"+baseName);
	File.makeDirectory( inputPath+"\\..\\res\\"+baseName+"\\bad");
	File.makeDirectory( inputPath+"\\..\\res\\"+baseName+"\\crop");

	imageId=getImageID();

	run("Duplicate...", "title=particles");
	imageIdParticles=getImageID();

	print('Subtract Background');
	run("Subtract Background...", "rolling=500 light");

	print('8-bit');
	run("8-bit");

	// setAutoThreshold("Default");
	// call("ij.plugin.frame.ThresholdAdjuster.setMode", "B&W");
	// setOption("BlackBackground", false);
	print('Convert to Mask');
	run("Convert to Mask");

	//print('Fill Holes');
	//run("Fill Holes");

	print('Analyze Particles');
	run("Analyze Particles...", "size=100000-10000000 exclude clear add");
	// run("Analyze Particles...", "size=500-15000 exclude clear add");

	  run("Labels...", "color=white font=140 show draw"); 
	saveAs("png", inputPath+"\\..\\res\\"+baseName+"\\"+baseName+".map.png");

	// File.makeDirectory(dirCropOutput);
	// selectWindow(fileName);
	print('save '+roiManager("count")+' files');
	selectImage(imageId);
	for (u=0; u<roiManager("count"); ++u) {
		run("Duplicate...", "title=crop");
		roiManager("Select", u);
		run("Crop");
		getSelectionBounds(x, y, widthSel, heightSel);
		ratio=widthSel/heightSel;
		if (ratio > 0.14 && ratio < 6.5) {
			saveAs("png", inputPath+"\\..\\res\\"+baseName+"\\crop\\"+fileName+'.'+u+".png");
		} else {
			saveAs("png", inputPath+"\\..\\res\\"+baseName+"\\bad\\"+fileName+'.'+u+".png");
		}
		// close();
		//Next round!
		// selectWindow(fileName);
		selectImage(imageId);
	}
	selectImage(imageIdParticles);
	// selectWindow("particles");
	close();
}