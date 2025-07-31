#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

cd "$DIR/../out"
zip -r "$DIR/../custom-textures-resourcepack.zip" .
cd -

cd "$DIR/../datapack"
zip -r "$DIR/../armor-retexture-datapack.zip" .
cd -
