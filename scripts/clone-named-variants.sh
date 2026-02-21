#!/bin/bash

SOURCE_URL="https://cdn.modrinth.com/data/ybctGziT/versions/Z1OUWUw4/TooManyRenamesV19.9.zip"

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

wget -O namedvariants.zip $SOURCE_URL
unzip namedvariants.zip -d namedvariants
