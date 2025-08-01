// this script creates new resources in an extracted namedvariants resourcepack directory to support:
// 1. Armor textures that are recognizeable via vanilla MC (no optifine)
// 2. Creating asset files for the datapack in this repo to automatically change assets for equipment based on name
// It also processes the equipment in the resourcepack/ folder of this repo to generate datapack files
import fs from "node:fs";
import path from "node:path";

const namedVariantDir = process.argv[2];
if (!namedVariantDir) {
  console.error("Usage: node migrate.js path/to/extracted_barelydefault/");
  process.exit(1);
}

/**
 * @param {DatapackVariantRegister} datapackRegister 
 */
function processNamedVariants(datapackRegister) {
  const rootDir = path.join(namedVariantDir, "/assets", "/minecraft");

  // parse optifine files
  const optifineModels = path.join(rootDir, "/optifine", "/cit", "/models");
  const tiers = fs.readdirSync(optifineModels);
  // a "tier" is "diamond"/"iron"/"elytra" etc...
  for (const tier of tiers) {
    console.log("STARTING TIER: ", tier);
    const files = fs.readdirSync(path.join(optifineModels, tier));
    // essentially: every variant
    for (const file of files) {
      let makeEquipment = false;
      let style = "";

      // helmet, chest, boots
      if (file.endsWith("_layer_1.png")) {
        style = file.replace("_layer_1.png", "");
        makeEquipment = true;
        const src = path.join(optifineModels, tier, file);
        const destinationDir = path.join(
          rootDir,
          "textures",
          "entity",
          "equipment",
          "humanoid",
          tier
        );
        // we need to move this texture to the correct vanilla resourcepack location
        const destination = path.join(destinationDir, style + ".png");
        fs.mkdirSync(destinationDir, { recursive: true });
        fs.copyFileSync(src, destination);
      }

      // leggings
      if (file.endsWith("_layer_2.png")) {
        style = file.replace("_layer_2.png", "");
        makeEquipment = true;
        const src = path.join(optifineModels, tier, file);
        const destinationDir = path.join(
          rootDir,
          "textures",
          "entity",
          "equipment",
          "humanoid_leggings",
          tier
        );
        // we need to move this texture to the correct vanilla resourcepack location
        const destination = path.join(destinationDir, style + ".png");
        fs.mkdirSync(destinationDir, { recursive: true });
        fs.copyFileSync(src, destination);
      }

      // wings
      if (file.endsWith("_elytra.png")) {
        style = file.replace("_elytra.png", "");
        makeEquipment = true;
        const src = path.join(optifineModels, tier, file);
        const destinationDir = path.join(
          rootDir,
          "textures",
          "entity",
          "equipment",
          "wings",
          tier
        );
        // we need to move this texture to the correct vanilla resourcepack location
        const destination = path.join(destinationDir, style + ".png");
        fs.mkdirSync(destinationDir, { recursive: true });
        fs.copyFileSync(src, destination);
      }

      if (makeEquipment) {
        // we need to record this item variant in the datapackregister
        datapackRegister.register(tier, capitalize(style.replaceAll("_", " ")), `${tier}/${style}`)

        // now we need to record the resourcepack equipment file to map this asset_id to a texture
        const obj = { layers: {} };
        if (tier == "elytra") {
          obj.layers["wings"] = [
            {
              texture: tier + "/" + style,
            },
          ];
        } else {
          obj.layers["humanoid"] = [
            {
              texture: tier + "/" + style,
            },
          ];
          obj.layers["humanoid_leggings"] = [
            {
              texture: tier + "/" + style,
            },
          ];
        }
        const outDir = path.join(rootDir, "equipment", tier);
        const outfile = path.join(outDir, style + ".json");
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outfile, JSON.stringify(obj, null, 4));
      }
    }
  }
}

/**
 * @param {DatapackVariantRegister} datapackRegister 
 */
function processResourcePackEquipment(datapackRegister) {
  const resourcepackDir = path.join(namedVariantDir, '..', 'resourcepack', 'assets', 'minecraft')
  const equipmentDir = path.join(resourcepackDir, 'equipment');
  const tiers = fs.readdirSync(equipmentDir);

  for (const tier of tiers) {
    const files = fs.readdirSync(path.join(equipmentDir, tier));
    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const style = file.replaceAll('.json', '');

      if (tier == 'common') {
        datapackRegister.getTiers().filter(t => t != 'common').forEach(t => {
          datapackRegister.register(t, capitalize(style.replaceAll('_', ' ')), `common/${style}`);
        });
      } else {
        datapackRegister.register(tier, capitalize(style.replaceAll('_', ' ')), `${tier}/${style}`);
      }
    }
  }
}

// Utils / Classes / Libraries

class DatapackVariantRegister {
  /** @typedef {string} Tier */
  /** @typedef {'head' | 'chest' | 'legs' | 'feet'} Slot */

  /** @typedef {{ name: string; asset_id: string; }} TierRegistration */

  /** @type {Record<Tier,TierRegistration[]>} #map */
  #data = {};
  constructor() {
    this.#data = {};
  }

  /**
   *
   * @param {string} tier
   * @param {string} name
   * @param {string} asset_id
   */
  register(tier, name, asset_id) {
    if (!this.#data[tier]) {
      this.#data[tier] = [];
    }

    const existing = this.#data[tier].find(tr => tr.name == name || tr.asset_id == asset_id);

    if (!existing) {
      this.#data[tier].push({ name, asset_id });
    }
  }

  getTiers() {
    return Object.keys(this.#data)
  }

  /** @typedef {{name: string; content: string;}} FileDefinition */

  /**
   * @returns {FileDefinition[]}
   */
  getFileDefs() {
    /** @type {Record<string,string[]>} keys are items e.g. chainmail_boots */
    const contentMap = {};

    Object.entries(this.#data).forEach(([tier, registrations]) => {
      if (tier == "elytra") {
        registrations.forEach(registration => {
          if (!contentMap['elytra']) contentMap['elytra'] = [this.#getDispatchString("chest", "Elytra", "elytra")]
          contentMap['elytra'].push(this.#getDispatchString("chest", capitalize(`${registration.name} elytra`), registration.asset_id));
        })
      } else {
        registrations.forEach(registration => {
          if (!contentMap[`${tier}_helmet`]) contentMap[`${tier}_helmet`] = [this.#getDispatchString("head", capitalize(`${tier} helmet`), tier)]
          contentMap[`${tier}_helmet`].push(this.#getDispatchString("head", capitalize(`${registration.name} helmet`), registration.asset_id));

          if (!contentMap[`${tier}_chestplate`]) contentMap[`${tier}_chestplate`] = [this.#getDispatchString("chest", capitalize(`${tier} chestplate`), tier)]
          contentMap[`${tier}_chestplate`].push(this.#getDispatchString("chest", capitalize(`${registration.name} chestplate`), registration.asset_id));

          if (!contentMap[`${tier}_leggings`]) contentMap[`${tier}_leggings`] = [this.#getDispatchString("legs", capitalize(`${tier} leggings`), tier)]
          contentMap[`${tier}_leggings`].push(this.#getDispatchString("legs", capitalize(`${registration.name} leggings`), registration.asset_id));

          if (!contentMap[`${tier}_boots`]) contentMap[`${tier}_boots`] = [this.#getDispatchString("feet", capitalize(`${tier} boots`), tier)]
          contentMap[`${tier}_boots`].push(this.#getDispatchString("feet", capitalize(`${registration.name} boots`), registration.asset_id));
        });
      }
    });

    /** @type {FileDefinition[]} */
    const defs = Object.entries(contentMap).map(([item, cmds]) => {
      return {
        name: `${item}.mcfunction`,
        content: cmds.join('\n')
      }
    });

    return defs;
  }

  /**
   * Generates a single "execute if ..." command to assign the currently held item to the provided asset_id if the name matches
   * @param {Slot} slot
   * @param {string} name
   * @param {string} asset_id
   * @returns {string}
   */
  #getDispatchString(slot, name, asset_id) {
    return `execute if data entity @s {SelectedItem:{components:{"minecraft:custom_name":"${name}"}}} run item modify entity @s weapon.mainhand {"function":"minecraft:set_components","components": {"minecraft:equippable":{"slot":"${slot}","asset_id":"${asset_id}"}}}`;
  }
}

function capitalize(str) {
  return str.split(' ').map(word => word.at(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
}


// execution
const datapackRegister = new DatapackVariantRegister();

processNamedVariants(datapackRegister);
processResourcePackEquipment(datapackRegister);

console.log("Creating Datapack Dispatchers")
// now we need to write out the datapack dispatch functions
const functionDir = path.join(namedVariantDir, '..', 'datapack', 'data', 'armortexturemapper', 'function', 'dispatch');
fs.mkdirSync(functionDir, { recursive: true });
const fileDefs = datapackRegister.getFileDefs()
fileDefs.forEach(fileDef => {
  const filepath = path.join(functionDir, fileDef.name);
  fs.writeFileSync(filepath, fileDef.content + '\n', { encoding: 'utf-8' });
});