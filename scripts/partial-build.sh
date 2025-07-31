#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

echo "Deleting out directory"
sudo rm -rf "$DIR/../out"

echo "Deleting previous zips"
rm "$DIR/../armor-retexture-datapack.zip"
rm "$DIR/../custom-textures-resourcepack.zip"

echo "Migrating Named Variants textures to vanilla resource pack format"
node "$DIR/migrate.js" "$DIR/../named-variants"

echo "Merging Assets"
"$DIR/merge.sh"

echo "Zipping..."
"$DIR/zip.sh"

echo "Complete!"
