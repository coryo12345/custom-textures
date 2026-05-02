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

// Named variants not updated for 26.1 - need to apply some fixes to v19.9 to work

function applyItemFixes() {
  const macePath = path.join(outDir, "assets", "minecraft", "items", "mace.json");
  if (fs.existsSync(macePath)) {
    fixMaceItemSyntax(macePath);
  }
}

function applyModelFixes() {
  // TODO nothing for now
}

// fix implementations ---------------------------------------------

// Converts mace.json from old item model syntax to modern syntax.
//
// Old syntax wraps everything in a condition(has_component) → select chain and
// uses a bare string for select's default ("model" property). It also allows
// condition nodes to carry a top-level "model" property as a default layer.
//
// Modern syntax:
//   - select sits at the root; fallback is a proper node object
//   - condition nodes never carry a "model" property; that pattern becomes a
//     composite of [condition(on_false: empty), base model]
function fixMaceItemSyntax(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  data.model = migrateModelNode(data.model);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function migrateModelNode(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(migrateModelNode);

  // Rule 1: unwrap outer condition(has_component) — promote inner select to root
  if (node.type === "condition" && node.property === "has_component") {
    return migrateModelNode(node.on_true);
  }

  // Rule 2: select with bare string "model" default → proper fallback node
  if (node.type === "select" && typeof node.model === "string") {
    const { model, fallback, ...rest } = node;
    return migrateModelNode({
      ...rest,
      fallback: fallback ?? { type: "model", model },
    });
  }

  // Rule 3: condition carrying a top-level "model" property → composite
  // The "model" value was always the same as on_false; in modern syntax the base
  // model is a permanent layer and the condition overlays on_true or nothing.
  if (node.type === "condition" && node.model !== undefined) {
    const { model: defaultModel, ...conditionWithoutModel } = node;
    return {
      type: "composite",
      models: [
        migrateModelNode({ ...conditionWithoutModel, on_false: { type: "empty" } }),
        { type: "model", model: defaultModel },
      ],
    };
  }

  // Recurse into all child values
  return Object.fromEntries(
    Object.entries(node).map(([k, v]) => [k, migrateModelNode(v)])
  );
}

applyItemFixes();
applyModelFixes();
