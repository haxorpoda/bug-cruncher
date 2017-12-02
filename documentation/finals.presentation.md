title: Haxorpoda Collective - Wir sind die die Käfter sotieren
author:
	name: Falko Krause, Olivier Wagener, Michael Scheuerl
	github: shoutrlabs
	url: https://github.com/haxorpoda
output: ./documentation/finals.presentation.html
theme: ./cleaver-select-theme
controls: true

--

# Haxorpoda Collective


## Wir sind die die Käfter sotieren

<style>
.fullscreen {
	position: fixed;
    top: 5%;
    left: 5%;
    height: 90%;
    width: 90%;
    background-size: ;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
.fullscreen-full {
	position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-size: ;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>

--
<div style="background-image: url('img/MichaelFolien_Final/01_Anfangsfolie_small.jpg'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/01b_Daten_small.jpg'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/MichaelFolien_Final/02_Comunity_small.jpg'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/MichaelFolien_Final/03_Sortierung_small.jpg'); " class="fullscreen-full" ></div>

--
<div>&nbsp;</div>
<div style="font-size: 1.5em">
	1. Einzelne Insekten freistellen,<br><br>
	2. nach Farbe sortieren,<br><br>
	3. schön darstellen.<br><br>
</div>

--
# Protokoll für …

--
<div style="background-image: url('img/wustplatte.jpg'); " class="fullscreen" ></div>

--
<div style="background-image: url('img/wurstplatte.featrure-detection.1.png'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/wurstplatte.featrure-detection.2.png'); " class="fullscreen" ></div>
--
# Zu ungenau
<div style="text-align: center;">
	
<img 
	src="img/frown.emoji.png" 
	style="display: inline; height: 112px; width: inherit;">
</div>

--
# … grübel, google, Haxor Session …

--
# Software für winzige Zellen

--
### ImageJ für winzige Zellen
<div>&nbsp;</div>
<div class="left">
	<img src="img/ImageJ nuclei number.1.jpg" alt="">
</div>
<div class="right">
	<img src="img/ImageJ nuclei number.2.jpg" alt="">
</div>


--
### ImageJ - mächtig (kompliziert gemacht)
<div>&nbsp;</div>
<div class="left"><div>&nbsp;</div><div>&nbsp;</div><img src="img/ImageJ-screenshot.png" style="width: 135%">
</div>
<div class="right">
<img src="img/imagej.logo.png" alt="">
</div>

--
<div style="text-align: center;">
	
<img
	src="img/frown.emoji.png"
	style="display: inline; height: 112px; width: inherit; margin-bottom: -150px">
</div>
# help!

--
# Der grösste Wissensspeicher der Menschheit?

--
<div style="background-image: url('img/imagej.youtube.tutorial.png'); " class="fullscreen" ></div>

--
``` js

function cropFile(filePath, baseName) {
	open(filePath);
	imageId = getImageID();
	run('Duplicate...', 'title=particles');
	imageIdParticles = getImageID();
	run('Subtract Background...', 'rolling=500 light');
	run('8-bit');
	run('Convert to Mask');
	run('Analyze Particles...', 'size=80000-10000000 exclude clear add');
	run('Labels...', 'color=white font=200 show draw');
	saveAs('png', resPath + baseName + '/' + baseName + '.map.png');
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

```



--
<div style="background-image: url('img/mfnb_col_buprestidae_julodinae_d019.jpg'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/mfnb_col_scarabaeidae_dynastinae_d187.jpg'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/tristan.naturkundemuseeum.berlin.jpg'); " class="fullscreen-full" ></div>

--
# 286M px²
<div style="text-align: center; font-size: .7em">
	18338px * 15639px 
</div>

--
# 302.2 GB
<div style="text-align: center; font-size: .7em">
	1650 Files
</div>

--
# … und wieviel hast du so auf deinem Computer frei?

--
<img src="img/nextcloud.screenshot.png" alt="">
--
<img src="img/Nextcloud_Logo.svg.png" alt="">

--
# … Probleme … … … …
<img src="img/imagej.logo.png" class="fullscreen">

--
# 13GB peak RAM
<img src="img/ram.chip.jpg" >

<style>
#slide-28 .slide-content {
    overflow: visible;
}
</style>

--
<div style="background-image: url('img/big-server.jpg'); " class="fullscreen-full" ></div>

--
# … einige Zeit später
<div style="text-align: center; font-size: .7em">
	detachable X11 sessions
	<br>
	`tmux` + `xpra` = ♥
</div>
--
<div style="background-image: url('img/MFNB_Col_Buprestidae_Julodinae_D008.map.png'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/MFNB_Col_Scarabaeidae_Cetoniinae_D189.map.png'); " class="fullscreen" ></div>
--
<div style="background-image: url('img/MFNB_Lep_Schultze_SK_D0031.map.png'); " class="fullscreen" ></div>

--
# so viel tolle Hexapoda …

--
# so viel tolle Hxorpoda …

--
# so viel tolle Haxorpoda …

--
# … aber was issn jetzt mit den Farben Oli?



--
<div style="background-image: url('img/o.wagner.smarty-sort-machine.2.png'); " class="fullscreen" ></div>
--
# Smartie-Farben-Sortier-Maschine
<div style="text-align: center; font-size: .7em">
	Sortiert Smarties nach Farben.
</div>

--
<div style="background-image: url('img/o.wagner.smarty-sort-machine.1.png'); " class="fullscreen" ></div>

--
# scannt Farben in <br> <span style="color: red;">R</span><span style="color: #00ff0a">G</span><span style="color: blue">B</span>

--
<div style="background-image: url('img/rgb.color.space.jpg'); " class="fullscreen" ></div>

--
# HLS ist besser
<div style="text-align: center; font-size: .7em">
	convert(**RGB** to **HLS**)
</div>

--
<div style="background-image: url('img/hsl.color.space.png'); " class="fullscreen" ></div>

--
# … letzer Schritt, schöne Bilder!


--
<div style="background-image: url('img/bugs.sorted.by.color.png'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/Schmetterline.19cols.png'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/699-insects.29-cols.png'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/BunteKaefer.Lsort.png'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/BunteKaefer.31cols.png'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/2140-insects.85-cols.png'); " class="fullscreen-full" ></div>
--
<div style="background-image: url('img/MichaelFolien_Final/99_EndFolie_small.jpg'); " class="fullscreen-full" ></div>

--
### Links und Code
Ihr wollt uns helfen? Ihr wollt auch Bugs crunchen?

<div style="font-weight: 700; text-align: center; font-size: 2em;">
github.com/haxorpoda <br>
@haxorpoda <br>
<img src="img/haxarpoda.logo.png" width="50px" style="width: 209px;height: inherit;">
</div>

