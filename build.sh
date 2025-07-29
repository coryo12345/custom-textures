#!/bin/bash

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

echo "Cloning Named Variants Resource Pack"
"$DIR/scripts/clone-named-variants.sh"

echo "Migrating Named Variants textures to vanilla resource pack format"
node "$DIR/scripts/migrate.js" "$DIR/namedvariants"

echo "Merging Assets"
"$DIR/scripts/merge.sh"

echo "Zipping..."
"$DIR/scripts/zip.sh"

echo "Complete!"
