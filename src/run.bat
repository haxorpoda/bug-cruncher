@echo off

echo Start %time%

:: set inputPath=Z:\bug-cruncher\highRes\
:: set outputPath=Z:\bug-cruncher\res\

set inputPath=E:\git\bug-cruncher\data\highRes\
set outputPath=E:\git\bug-cruncher\data\res\

set Filecount=
for %%f in (%inputPath%*) do set /a Filecount+=1
echo Filecount %Filecount%

:loop
    ..\..\ij150-win-java8\ImageJ\ImageJ.exe --console -batch ..\..\bug-cruncher\src\crop-bugs.ijm

    set Foldercount=
    for /d %%a in (%outputPath%*) do set /a Foldercount+=1
    echo Just processed image %Foldercount% of %Filecount%

    if %foldercount% GEQ %Filecount% (
        goto done
    ) else (
        goto loop
    )
:done

echo Done %time%