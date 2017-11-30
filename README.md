# bug-cruncher

We come to crop and sort insects.

We combine art and sience to create beauty and knowlege.

## Approach

Our approach was fully powered by open source tools that helped us download, share, and process high resolution scans of insect specimen drawers provied by the [Museum für Naturkunde Berlin](https://www.naturkundemuseum.berlin) for the [Coding da Vinci](https://codingdavinci.de/daten/) Hackaton 2017 under a [CC0 license](https://wiki.creativecommons.org/wiki/CC0).

After experiment with [linux command line tools](https://stackoverflow.com/questions/23888287/split-image-into-parts) we adoped [ImageJ](https://imagej.net) as our main tool for feature detection (finding the outlines of bugs and butterflies) and cropping of individual insect specimen from the high resolution scans utilizing a similar protocol used for [counting cells](https://www.youtube.com/watch?v=D1qBaFwuF4E) on microscopy images.

## Loading and sharing the raw data

Our first approach to load all the data into this Github repository was quickly rejected since there are about 300 GB files that need to be processed. These files will then generate at least another 100 GB of result data. This might be a bit much for a Github repository (though we did not check the limits of Github). Our alternative approach uses a private [Nextcloud](https://nextcloud.com) instance where we had about 700 GB diskspace available. To maximise the loading speed we downloaded the date directly to the data folder of the Nextcloud using `wget`. For this we prepared a texfile containing all download links (the metadata csv file provied contained errors and was thus not directly usable)

We copy and pasted the text from http://gbif.naturkundemuseum-berlin.de/hackathon/Insektenkasten/High_resolution/ into a text file and used Sublimes multislection to create the `wget` input file `data/highResUrls.txt` and  executed `wget` in the Nexcloud data directory (configured in `nexcloud/config/config.php`) where the files should be located.

```
cd /var/lib/nextcloud/data/myUserName/files/bug-cruncher/highRes
wget -i highResUrls.txt
```

Since the download even with full 10 MB/s took over 8 hourse we had to cancel the download and resume at a later point.

```
wget -N -i highResUrls.txt
```

We then used the Nexcloud [command line tool](https://docs.nextcloud.com/server/9/admin_manual/configuration_server/occ_command.html#file-operations-label) to rescan the files and add it to the Nextcloud database.

```
sudo -u www-data php occ files:scan myUserName --path myUserName/files/bug-cruncher
```

We were now able to mount the Nexcloud directoy in Linux ~~and Windows~~ machines using [WebDAV](https://en.wikipedia.org/wiki/WebDAV). This enabled us to use a fast computer to calculate the data while directly sharing the results.

## HTML Galleries

- masonany grid
- d3 treemap