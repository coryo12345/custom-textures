#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

echo "Deleting out directory"
sudo rm -rf "$DIR/../out"

echo "Deleting previous zips"
rm "$DIR/../armor-retexture-datapack.zip"
rm "$DIR/../custom-textures-resourcepack.zip"
rm -rf "$DIR/../datapack/data/armortexturemapper/function/dispatch"

echo "Migrating Named Variants textures to vanilla resource pack format"
node "$DIR/migrate.js" "$DIR/../namedvariants"

echo "Merging Assets"
"$DIR/merge.sh"

echo "Zipping..."
"$DIR/zip.sh"

echo "Complete!"


cp "$DIR/../armor-retexture-datapack.zip" "/mnt/c/Users/Cory/Documents/MultiMC/instances/Fabulously Optimized 10.0.0-alpha.4/.minecraft/saves/test-world/datapacks"
cp "$DIR/../custom-textures-resourcepack.zip" "/mnt/c/Users/Cory/Documents/MultiMC/instances/Fabulously Optimized 10.0.0-alpha.4/.minecraft/resourcepacks"
