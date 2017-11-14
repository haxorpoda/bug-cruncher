inputPath = "E:\\git\\bug-cruncher\\data\\highRes\\" //--headless --console -macro E:\git\bug-cruncher\src\crop-bugs.ijm;
// inputPath = "/home/select/Dev/bugs/data/highRes/";
// inputPath = "/home/select/Dev/bugs/data/test/";

//setBatchMode(true);
print(inputPath);
list = getFileList(inputPath);
for (i = 0; i < list.length; i++) {
	if (File.isDirectory(inputPath+"\\..\\res\\"+substring(list[i], 0, lengthOf(list[i]) -4))) {
      	print('Exists          : ' + inputPath+"\\..\\res\\" + substring(list[i], 0, lengthOf(list[i]) -4));
  	} else {
		print('Does not exists : ' + inputPath+"\\..\\res\\" + substring(list[i], 0, lengthOf(list[i]) -4));
		File.makeDirectory( inputPath+"\\..\\res\\"+substring(list[i], 0, lengthOf(list[i]) -4));
		File.makeDirectory( inputPath+"\\..\\res\\"+substring(list[i], 0, lengthOf(list[i]) -4)+"\\bad");
		File.makeDirectory( inputPath+"\\..\\res\\"+substring(list[i], 0, lengthOf(list[i]) -4)+"\\crop");
		
		cropFile(inputPath, list[i]);
		return;
	}
}

function cropFile(path, fileName) {
	print('open '+path + fileName);
	open(path + fileName);
	baseName=File.nameWithoutExtension;

	imageId=getImageID();

	run("Duplicate...", "title=particles");
	imageIdParticles=getImageID();

	print('Subtract Background');
	run("Subtract Background...", "rolling=500 light");

	print('8-bit');
	run("8-bit");

	print('Convert to Mask');
	run("Convert to Mask");

	//print('Fill Holes');
	//run("Fill Holes");

	print('Analyze Particles');
	run("Analyze Particles...", "size=80000-10000000 exclude clear add");
	// run("Analyze Particles...", "size=500-15000 exclude clear add");

	// run("Line Width...", "line=2");
	run("Colors...", "foreground=white background=black selection=red");
	run("Labels...", "color=white font=200 show draw"); 
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