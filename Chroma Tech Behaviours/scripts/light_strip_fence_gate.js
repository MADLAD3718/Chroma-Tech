import { Block, BlockPermutation, ItemStack, BlockTypes, Player, Vector, world } from "@minecraft/server";
import { dirToEastWestStr, dirToNorthSouthStr, rotateByCardinalDirection, toBlockFace } from "./util";
import { hasCenter, placeCollider } from "./light_strip_fence";


/**
 * Handles the placement or removal of a light strip fence gate.
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
export function alterLightStripFenceGate(block, permutation, placed) {
    const {dimension, location} = block;
    const block_dir = permutation.getState("minecraft:cardinal_direction");
    const rEast = rotateByCardinalDirection(Vector.left, block_dir);
    const rWest = rotateByCardinalDirection(Vector.right, block_dir);
    const block_e = dimension.getBlock(Vector.add(location, rEast));
    const block_w = dimension.getBlock(Vector.add(location, rWest));
    if (block_e.hasTag("light_strip_fence")) {
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:" + toBlockFace(rEast), placed));
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
        placeCollider(block_e);
    }
    if (block_w.hasTag("light_strip_fence")) {
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:" + toBlockFace(rWest), placed));
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
        placeCollider(block_w);
    }
    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    if (placed) { if (block_a.isAir) placeColliderOnGate(block_a, block_dir); }
    else if (block_a.hasTag("light_strip_fence_collider")) block_a.setType(BlockTypes.get("air"));
}

/**
 * Handles interactions with light strip fence gates.
 * @param {Block} block 
 * @param {Player} player 
 */
export function interactLightStripFenceGate(block, player) {
    const {dimension, location} = block;
    let permutation = block.permutation;
    const block_dir = permutation.getState("minecraft:cardinal_direction");
    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    if (permutation.getState("chroma_tech:opened") == 0) {
        let player_dir;
        if (block_dir == "north" || block_dir == "south") player_dir = dirToNorthSouthStr(player.getViewDirection());
        else player_dir = dirToEastWestStr(player.getViewDirection());
        permutation = permutation.withState("chroma_tech:opened", block_dir == player_dir ? 2 : 1);
        if (block_a.hasTag("light_strip_fence_collider")) block_a.setType(BlockTypes.get("air"));
        world.playSound("open.iron_trapdoor", location);
    }
    else {
        permutation = permutation.withState("chroma_tech:opened", 0);
        if (block_a.isAir) placeColliderOnGate(block_a, block_dir);
        world.playSound("close.iron_trapdoor", location);
    }
    block.setPermutation(permutation);
}

/**
 * Places a light strip fence collider on a fence gate.
 * @param {Block} block_a 
 * @param {String} block_dir 
 */
export function placeColliderOnGate(block_a, block_dir) {
    let permutation;
    if (block_dir == "north" || block_dir == "south")
        permutation = BlockPermutation.resolve("chroma_tech:light_strip_fence_collider", {
            "chroma_tech:east": true, "chroma_tech:west": true
        });
    else permutation = BlockPermutation.resolve("chroma_tech:light_strip_fence_collider", {
        "chroma_tech:north": true, "chroma_tech:south": true
    });
    block_a.setPermutation(permutation);
}

/**
 * Destroys a light strip fence gate as if it were broken.
 * @param {Block} block 
 * @param {Boolean} inSurvival
 */
export function breakLightStripFenceGate(block, inSurvival) {
    const {dimension, location, permutation} = block;
    alterLightStripFenceGate(block, permutation, false);
    if (inSurvival) dimension.spawnItem(new ItemStack(block.typeId), location);
    block.setType(BlockTypes.get("air"));
}