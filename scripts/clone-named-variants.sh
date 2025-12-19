#!/bin/bash

SOURCE_URL="https://cdn.modrinth.com/data/ybctGziT/versions/8QQ2Sza1/TooManyRenamesV18.20.zip"

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

wget -O namedvariants.zip $SOURCE_URL
unzip namedvariants.zip -d namedvariants
