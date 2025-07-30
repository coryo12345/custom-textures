import fs from "node:fs"
import path from "node:path"

const resourcePackDir = process.argv[2];
if (!resourcePackDir) {
    console.error("Usage: node migrate.js path/to/extracted_barelydefault/")
    process.exit(1)
}

const rootDir = path.join(resourcePackDir, "/assets", "/minecraft")

// parse optifine files
const optifineModels = path.join(rootDir, "/optifine", "/cit", "/models")
const tiers = fs.readdirSync(optifineModels)
for (const tier of tiers) {
    console.log("STARTING TIER: ", tier)
    const files = fs.readdirSync(path.join(optifineModels, tier))
    for (const file of files) {
        let makeEquipment = false
        let style = ""

        if (file.endsWith("_layer_1.png")) {
            style = file.replace("_layer_1.png", "")
            makeEquipment = true
            const src = path.join(optifineModels, tier, file)
            const destinationDir = path.join(rootDir, "textures", "entity", "equipment", "humanoid", tier)
            const destination = path.join(destinationDir, style + ".png")
            fs.mkdirSync(destinationDir, { recursive: true })
            fs.copyFileSync(src, destination)
        }

        if (file.endsWith("_layer_2.png")) {
            style = file.replace("_layer_2.png", "")
            makeEquipment = true
            const src = path.join(optifineModels, tier, file)
            const destinationDir = path.join(rootDir, "textures", "entity", "equipment", "humanoid_leggings", tier)
            const destination = path.join(destinationDir, style + ".png")
            fs.mkdirSync(destinationDir, { recursive: true })
            fs.copyFileSync(src, destination)
        }

        if (file.endsWith("_elytra.png")) {
            style = file.replace("_elytra.png", "")
            makeEquipment = true
            const src = path.join(optifineModels, tier, file)
            const destinationDir = path.join(rootDir, "textures", "entity", "equipment", "wings", tier)
            const destination = path.join(destinationDir, style + ".png")
            fs.mkdirSync(destinationDir, { recursive: true })
            fs.copyFileSync(src, destination)
        }

        if (makeEquipment) {
            const obj = { layers: {} }
            if (tier == 'elytra') {
                obj.layers['wings'] = [
                    {
                        texture: tier + '/' + style
                    }
                ]
            } else {
                obj.layers['humanoid'] = [
                    {
                        texture: tier + "/" + style
                    }
                ]
                obj.layers['humanoid_leggings'] = [
                    {
                        texture: tier + "/" + style
                    }
                ]
            }
            const outDir = path.join(rootDir, "equipment", tier)
            const outfile = path.join(outDir, style + ".json")
            fs.mkdirSync(outDir, { recursive: true })
            fs.writeFileSync(outfile, JSON.stringify(obj, null, 4))
        }
    }
}
