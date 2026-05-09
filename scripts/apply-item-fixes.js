// This file applies custom tweaks to item/model definitions.
// Essentialy bugfixes for issues I find in the default namedvariants pack, or to resolve conflicts with my custom items

// As a reference: https://misode.github.io/assets/item/?version=1.21.11

import fs from "node:fs";
import path from "node:path";

const outDir = process.argv[2];
if (!outDir) {
  console.error("Usage: node apply-item-fixes.js path/to/out_directory/");
  process.exit(1);
}

function applyItemFixes() {
  // TODO nothing for now
}

function applyModelFixes() {
  // TODO nothing for now
}

// fix implementations ---------------------------------------------


applyItemFixes();
applyModelFixes();
