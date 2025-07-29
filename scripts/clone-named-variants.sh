#!/bin/bash

SOURCE_URL="https://cdn.modrinth.com/data/ybctGziT/versions/8QKro1nd/AllTheNamedVariantsV17.11.zip"

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

wget -O namedvariants.zip $SOURCE_URL
unzip namedvariants.zip -d namedvariants
