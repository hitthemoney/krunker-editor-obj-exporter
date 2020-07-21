# krunker-editor-obj-exporter

This extension allows you to download the map in the editor as an obj + mtl.

## How to install

1. Install Tampermonkey 
> * Chrome: **<https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo>** 
> * Firefox: **<https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/>**
2. Go to **<https://github.com/hitthemoney/krunker-editor-obj-exporter/blob/master/objExporter.user.js>**
3. Click on "Raw"
4. Then click install on the tampermonkey page.

## How to use

First import your map.

Then click on **Export OBJ**.

You will be given download instructions.
1. Choose an MTL File name
2. Choose an OBJ File name
3. Choose an a mod folder path (Example: /Users/johnsmith/Downloads/mod or if your obj is in /Users/johnsmith/Downloads/showcase and your mod folder is in /Users/johnsmith/Downloads/showcase/mod then you can just do **mod** as the file path)
4. It should download 2 files (**OBJ** and **MTL**) 

## Important Info
* Changing the name of the MTL file without updating the code of the obj file will result in not textures.
* Also an invalid mod path will result in no image textures loading and possibly the obj not loading as a whole.

## Working on
* Adding the ability to export as a zip file
* Emmisive Textures

## ASSETS
* MOD: <https://assets.krunker.io/mod.zip>
* Krunker Editor: <https://krunker.io/editor.html>

**Remember to check this repo every once in a while for updates!**
