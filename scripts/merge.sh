#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

rm -rf "$DIR/../out"
mkdir -p "$DIR/../out/assets"
cp -R "$DIR/../namedvariants/assets" "$DIR/../out"
cp "$DIR/../resourcepack/pack.mcmeta" "$DIR/../out"
cp -R "$DIR/../resourcepack/assets" "$DIR/../out"
rm -rf "$DIR/../out/assets/minecraft/optifine"
