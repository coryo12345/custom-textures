#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

echo "Deleting out directory"
sudo rm -rf "$DIR/out"

echo "Deleting previous zips"
rm "$DIR/armor-retexture-datapack.zip"
rm "$DIR/custom-textures-resourcepack.zip"
rm -rf "$DIR/datapack/data/armortexturemapper/function/dispatch"
rm -rf "$DIR/namedvariants.zip"
