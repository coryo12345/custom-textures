#!/bin/bash

SOURCE_URL="https://cdn.modrinth.com/data/ybctGziT/versions/nglKpsjE/TooManyRenamesV21.zip?mr_download_reason=standalone&mr_game_version=26.3&mr_loader=minecraft"

DIR=$(dirname -- "$( readlink -f -- "$0"; )")

if command -v curl &>/dev/null; then
  curl -L -o namedvariants.zip "$SOURCE_URL"
elif command -v wget &>/dev/null; then
  wget -O namedvariants.zip "$SOURCE_URL"
else
  echo "Error: neither curl nor wget is installed" >&2
  exit 1
fi
unzip namedvariants.zip -d namedvariants
