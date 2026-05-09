#!/bin/bash

SOURCE_URL="https://cdn.modrinth.com/data/ybctGziT/versions/P98U2Swe/TooManyRenames%2026.1%20by%20Mickey%20Joe.zip?mr_download_reason=standalone"

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
