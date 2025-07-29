#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

cd "$DIR/../out"
zip -r "$DIR/../custom-textures.zip" .
cd -
