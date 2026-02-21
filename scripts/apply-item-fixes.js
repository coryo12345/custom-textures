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
  // As of v19.9 there are no fixes needed

  // const itemsDir = path.join(outDir, "assets/", "minecraft/", "items/");
  // const files = fs.readdirSync(itemsDir);
  // files.forEach((file) => {
  //   const fullFileName = path.join(itemsDir, file);
  //   if (file.endsWith("_spear.json")) {
  //     fixSpearFallbackModel(fullFileName);
  //   } else if (file.endsWith("trident.json")) {
  //     fixTridentFallbackModel(fullFileName);
  //   }
  // });
}

function applyModelFixes() {
  // TODO nothing for now
}

// fix implementations ---------------------------------------------

/**
 * Minecraft default spears have a different model for the GUI view and when you hold it
 * Namedvariants doesn't account for this, so it doesn't appear properly in your hand
 * This correctly sets the default model for spears as the fallback
 * @param {string} filename
 */
function fixSpearFallbackModel(filename) {
  // we handle all spear tiers in this function, so we need to get the name for the tier
  // e.g. "diamond_spear" so we can reference the correct base models
  const itemName = filename.split("/").at(-1).replace(".json", "");

  let definitionStr = fs.readFileSync(filename, { encoding: "utf-8" });
  const definition = JSON.parse(definitionStr);
  definition.model.fallback = {
    type: "minecraft:select",
    cases: [
      {
        model: {
          type: "minecraft:model",
          model: `minecraft:item/${itemName}`,
        },
        when: ["gui", "ground", "fixed", "on_shelf"],
      },
    ],
    fallback: {
      type: "minecraft:model",
      model: `minecraft:item/${itemName}_in_hand`,
    },
    property: "minecraft:display_context",
  };
  definitionStr = JSON.stringify(definition, null, 4);
  fs.writeFileSync(filename, definitionStr, { encoding: "utf-8" });
}

/**
 * Trident model definition is not just a reference to a model, because the appearance is different based on the context
 * Namedvariants doesn't account for this, so to make default tridents look correct, we apply the default model definition as the fallback
 * @param {string} filename
 */
function fixTridentFallbackModel(filename) {
  let definitionStr = fs.readFileSync(filename, { encoding: "utf-8" });
  const definition = JSON.parse(definitionStr);
  // Apply the default from: https://misode.github.io/assets/item/?version=1.21.11&preset=trident
  definition.model.fallback = {
    type: "minecraft:select",
    cases: [
      {
        model: {
          type: "minecraft:model",
          model: "minecraft:item/trident",
        },
        when: ["gui", "ground", "fixed", "on_shelf"],
      },
    ],
    fallback: {
      type: "minecraft:condition",
      on_false: {
        type: "minecraft:special",
        base: "minecraft:item/trident_in_hand",
        model: {
          type: "minecraft:trident",
        },
      },
      on_true: {
        type: "minecraft:special",
        base: "minecraft:item/trident_throwing",
        model: {
          type: "minecraft:trident",
        },
      },
      property: "minecraft:using_item",
    },
    property: "minecraft:display_context",
  };
  definitionStr = JSON.stringify(definition, null, 4);
  fs.writeFileSync(filename, definitionStr, { encoding: "utf-8" });
}

applyItemFixes();
applyModelFixes();
