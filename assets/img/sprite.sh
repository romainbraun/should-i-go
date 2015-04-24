#!/bin/bash
 
# uses imagemagick to stich together all images in a folder.
# ex command: ./spriter.sh rivendell-title jpg 640 400
 
if [ $# -gt 3 ]
then
 
    folder=$1;
    name=$1; # output will be placed in a folder named this
    spritename=$1"-sprite";
    ext="."$2;
    width=$3;
    height=$4;
    
    #create new folder, replace old
    rm -fr $spritename;
    mkdir $spritename;
 
    echo "Generating sprite file...";
    FILES=$(ls $folder/*$ext | tr '\n' ' ');
    
    montage +frame +shadow +label -tile 1x -gravity West -background transparent -geometry +0+0 -tile 32x1 -resize ${width}x${height} ${FILES[@]} $spritename/$name$ext;
    
    echo "Sprite complete!";
else
    echo -e "There should be at least 3 argument!\n output_folder extension width height"
fi