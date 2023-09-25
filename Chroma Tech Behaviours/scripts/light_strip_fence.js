import { Block, BlockPermutation, ItemStack, BlockTypes, ItemTypes, Player, Vector, world } from "@minecraft/server";
import { beehiveIdx, cardinalStr, decrementStack, dirToCardinalIdx, facingIdx, gateIdx, inSurvival, legacyIdx, sculkIdx, weirdoIdx } from "./util";
import { breakLightStripFenceGate, interactLightStripFenceGate } from "./light_strip_fence_gate";

/**
 * Handles the placement or removal of new light strip fences.
 * @param {Block} block 
 * @param {BlockPermutation} permutation
 * @param {Boolean} placed
 */
export function alterLightStripFence(block, permutation, placed) {
    const {dimension, location} = block;

    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    const block_b = dimension.getBlock(Vector.add(location, Vector.down));
    const block_n = dimension.getBlock(Vector.add(location, Vector.forward));
    const block_s = dimension.getBlock(Vector.add(location, Vector.back));
    const block_e = dimension.getBlock(Vector.add(location, Vector.left));
    const block_w = dimension.getBlock(Vector.add(location, Vector.right));
    
    if (block_a.hasTag("light_strip_fence")) {
        const block_aa = dimension.getBlock(Vector.add(block_a.location, Vector.up));
        if (!block_aa.hasTag("light_strip_fence") && hasDouble(block_a.permutation))
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:center", placed));
    }
    
    if (block_b.hasTag("light_strip_fence")) {
        const block_bb = dimension.getBlock(Vector.add(block_b.location, Vector.down));
        if (!block_bb.hasTag("light_strip_fence") && hasDouble(block_b.permutation))
            block_b.setPermutation(block_b.permutation.withState("chroma_tech:center", placed));
        if (!placed) placeCollider(block_b);
    }

    if (block_n.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:south", placed);
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:north", placed));
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:center", hasCenter(block_n)));
        placeCollider(block_n);
    }
    else if (placed) {
        if (block_n.isSolid) permutation = permutation.withState("chroma_tech:south", true);
        else if (block_n.hasTag("light_strip_fence_gate")) {
            const block_n_dir = block_n.permutation.getState("minecraft:cardinal_direction");
            if (block_n_dir == "east" || block_n_dir == "west")
                permutation = permutation.withState("chroma_tech:south", true);
        }
    }

    if (block_s.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:north", placed);
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:south", placed));
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:center", hasCenter(block_s)));
        placeCollider(block_s);
    }
    else if (placed) {
        if (block_s.isSolid) permutation = permutation.withState("chroma_tech:north", true);
        else if (block_s.hasTag("light_strip_fence_gate")) {
            const block_s_dir = block_s.permutation.getState("minecraft:cardinal_direction");
            if (block_s_dir == "east" || block_s_dir == "west")
                permutation = permutation.withState("chroma_tech:north", true);
        }
    }

    if (block_e.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:west", placed);
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:east", placed));
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
        placeCollider(block_e);
    }
    else if (placed) {
        if (block_e.isSolid) permutation = permutation.withState("chroma_tech:west", true);
        else if (block_e.hasTag("light_strip_fence_gate")) {
            const block_e_dir = block_e.permutation.getState("minecraft:cardinal_direction");
            if (block_e_dir == "north" || block_e_dir == "south")
                permutation = permutation.withState("chroma_tech:west", true);
        }
    }
    
    if (block_w.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:east", placed);
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:west", placed));
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
        placeCollider(block_w);
    }
    else if (placed) {
        if (block_w.isSolid) permutation = permutation.withState("chroma_tech:east", true);
        else if (block_w.hasTag("light_strip_fence_gate")) {
            const block_w_dir = block_w.permutation.getState("minecraft:cardinal_direction");
            if (block_w_dir == "north" || block_w_dir == "south")
                permutation = permutation.withState("chroma_tech:east", true);
        }
    }

    if (placed) {
        if (hasDouble(permutation) && !block_a.hasTag("light_strip_fence") && !block_b.hasTag("light_strip_fence"))
            permutation = permutation.withState("chroma_tech:center", false);
        permutation = permutation.withState("chroma_tech:alternate", (location.x + location.y + location.z) % 2 == 1);
        block.setPermutation(permutation);
        if (block_a.isAir || block_a.hasTag("light_strip_fence_collider")) placeCollider(block, permutation);
    }
    else if (block_a.hasTag("light_strip_fence_collider")) block_a.setType(BlockTypes.get("air"));
}

/**
 * Determines if a fence should have the center piece.
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @returns {Boolean}
 */
export function hasCenter(block) {
    const {dimension, location, permutation} = block;
    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    const block_b = dimension.getBlock(Vector.add(location, Vector.down));
    return block_a.hasTag("light_strip_fence") || block_b.hasTag("light_strip_fence") || !hasDouble(permutation);
}

/**
 * Determines if a fence block has a double connection.
 * @param {BlockPermutation} permutation 
 * @returns {Boolean}
 */
function hasDouble(permutation) {
    const north = permutation.getState("chroma_tech:north");
    const south = permutation.getState("chroma_tech:south");
    const east = permutation.getState("chroma_tech:east");
    const west = permutation.getState("chroma_tech:west");
    return ((north && south) || (east && west))
         && !(north && south && east && west);
}

/**
 * Places a fence collider block in the given block location according to the provided fence permutation.
 * @param {Block} block
 */
export function placeCollider(block) {
    const {dimension, permutation, location} = block;
    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    if (!block_a.isAir && !block_a.hasTag("light_strip_fence_collider")) return;
    const north = permutation.getState("chroma_tech:north");
    const south = permutation.getState("chroma_tech:south");
    const east = permutation.getState("chroma_tech:east");
    const west = permutation.getState("chroma_tech:west");
    const alternate = (location.x + location.y + location.z) % 2 == 0;
    block_a.setPermutation(BlockPermutation.resolve("chroma_tech:light_strip_fence_collider", {
        "chroma_tech:north": north, "chroma_tech:south": south, "chroma_tech:east": east, "chroma_tech:west": west, "chroma_tech:alt": alternate
    }));
}

/**
 * Handles the removal of a fence collider block.
 * @param {Block} block 
 * @param {Player} player
 */
export function breakCollider(block, player) {
    const block_b = block.dimension.getBlock(Vector.add(block.location, Vector.down));
    if (block_b.hasTag("light_strip_fence")) breakLightStripFence(block_b, inSurvival(player));
    else if (block_b.hasTag("light_strip_fence_gate")) breakLightStripFenceGate(block_b, inSurvival(player));
}

/**
 * Destroys a light strip fence as if it were broken.
 * @param {Block} block 
 * @param {Boolean} inSurvival
 */
function breakLightStripFence(block, inSurvival) {
    const {dimension, location, permutation} = block;
    alterLightStripFence(block, permutation, false);
    if (inSurvival) dimension.spawnItem(new ItemStack(block.typeId), location);
    block.setType(BlockTypes.get("air"));
}

const unplaceable_items = [
    "minecraft:redstone",
    "minecraft:scaffolding",
    "minecraft:concrete_powder",
    "minecraft:stone_block_slab",
    "minecraft:sapling",
    "minecraft:vine",
    "minecraft:weeping_vines",
    "minecraft:twisting_vines",
    "minecraft:turtle_egg",
    "minecraft:pointed_dripstone",
    "minecraft:wheat",
    "minecraft:beetroot",
    "minecraft:potato",
    "minecraft:carrot",
    "minecraft:tallgrass",
    "minecraft:double_plant",
    "minecraft:nether_sprouts",
    "minecraft:fire_coral",
    "minecraft:brain_coral",
    "minecraft:bubble_coral",
    "minecraft:tube_coral",
    "minecraft:horn_coral",
    "minecraft:dead_fire_coral",
    "minecraft:dead_brain_coral",
    "minecraft:dead_bubble_coral",
    "minecraft:dead_tube_coral",
    "minecraft:dead_horn_coral",
    "minecraft:coral_fan",
    "minecraft:coral_fan_dead",
    "minecraft:crimson_roots",
    "minecraft:warped_roots",
    "minecraft:yellow_flower",
    "minecraft:red_flower",
    "minecraft:pitcher_plant",
    "minecraft:pink_petals",
    "minecraft:wither_rose",
    "minecraft:torchflower",
    "minecraft:waterlily",
    "minecraft:seagrass",
    "minecraft:kelp",
    "minecraft:deadbush",
    "minecraft:bamboo",
    "minecraft:snow_layer",
    "minecraft:hanging_roots",
    "minecraft:big_dripleaf",
    "minecraft:small_dripleaf_block",
    "minecraft:spore_blossom",
    "minecraft:azalea",
    "minecraft:flowering_azalea",
    "minecraft:glow_lichen",
    "minecraft:small_amethyst_bud",
    "minecraft:medium_amethyst_bud",
    "minecraft:large_amethyst_bud",
    "minecraft:amethyst_cluster",
    "minecraft:brown_mushroom",
    "minecraft:red_mushroom",
    "minecraft:crimson_fungus",
    "minecraft:warped_fungus",
    "minecraft:frog_spawn",
    "minecraft:nether_wart",
    "minecraft:chorus_plant",
    "minecraft:chorus_flower",
    "minecraft:cactus",
    "minecraft:mangrove_propagule",
    "minecraft:cherry_sapling",
    "minecraft:sculk_vein",
    "minecraft:prismarine",
    "minecraft:stained_hardened_clay",
    "minecraft:purpur_block",
    "minecraft:bed",
    "minecraft:skull",
    "minecraft:observer",
    "minecraft:tripwire_hook",
    "minecraft:sea_pickle",
    "minecraft:lever",
];

const up_facing_items = [
    "minecraft:frame",
    "minecraft:glow_frame",
    "minecraft:end_rod",
    "minecraft:lightning_rod",
];

/**
 * Handles block placement in a space that is occupied by a fence collider.
 * @param {Block} block 
 * @param {ItemStack} item
 * @param {Player} player
 */
export function placeBlockOnCollider(block, item, player) { // This is a really shitty method of dealing with block replacement but I don't know of a better one.
    if (unplaceable_items.includes(item.typeId) || item.hasTag("chroma_tech:light_strip")) return;
    let permutation;
    try { permutation = BlockPermutation.resolve(item.typeId); }
    catch { return; }
    const viewDirIdx = dirToCardinalIdx(player.getViewDirection());
    if (item.typeId == "minecraft:calibrated_sculk_sensor")
        permutation = permutation.withState("direction", sculkIdx[viewDirIdx]);
    else if (up_facing_items.includes(item.typeId))
        permutation = permutation.withState("facing_direction", 1);
    else if (item.typeId == "minecraft:hopper")
        permutation = permutation.withState("facing_direction", 0);
    else for (const state in permutation.getAllStates()) switch (state) {
        case "sand_type":
            if (!item.isStackableWith(new ItemStack(ItemTypes.sand)))
                permutation = permutation.withState("sand_type", "red");
            break;
        case "direction":
            if (permutation.getState("in_wall_bit") != undefined
                || permutation.getState("extinguished") != undefined
                || permutation.getState("attachment") != undefined) 
                permutation = permutation.withState("direction", gateIdx[viewDirIdx]);
            else if (permutation.getState("honey_level") != undefined
                    || permutation.getState("books_stored") != undefined
                    || permutation.getState("powered_bit") != undefined)
                permutation = permutation.withState("direction", beehiveIdx[viewDirIdx]);
            else permutation = permutation.withState("direction", legacyIdx[viewDirIdx]);
            break;
        case "weirdo_direction":
            permutation = permutation.withState("weirdo_direction", weirdoIdx[viewDirIdx]);
            break;
        case "minecraft:cardinal_direction":
            permutation = permutation.withState("minecraft:cardinal_direction", cardinalStr[viewDirIdx]);
            break;
        case "facing_direction":
            permutation = permutation.withState("facing_direction", facingIdx[viewDirIdx]);
            break;
        case "door_hinge_bit": return;
        case "hanging": return;
        case "rail_direction": return;
        case "button_pressed_bit": return;
    }
    block.setPermutation(permutation);
    if (block.hasTag("light_strip_fence")) alterLightStripFence(block, permutation, true);
    if (inSurvival(player)) decrementStack(player);
}

/**
 * Handles light strip fence placement in a space that is occupied by a fence collider.
 * @param {Block} block 
 * @param {ItemStack} item
 * @param {Player} player
 */
export function interactLightStripFenceCollider(block, item, player) {
    const location = block.location;
    const block_b = block.dimension.getBlock(Vector.add(location, Vector.down));
    if (block_b.hasTag("light_strip_fence_gate")) interactLightStripFenceGate(block_b, player);
    else if (item.typeId.endsWith("light_strip_fence")) {
        const permutation = BlockPermutation.resolve(item.typeId);
        block.setPermutation(permutation);
        world.playSound("dig.stone", location);
        alterLightStripFence(block, permutation, true);
        if (inSurvival(player)) decrementStack(player);
    }
}