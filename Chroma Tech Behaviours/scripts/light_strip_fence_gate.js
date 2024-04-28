import { Block, BlockPermutation, ItemStack, Player, world } from "@minecraft/server";
import { dirToEastWestStr, dirToNorthSouthStr } from "./util";
import { hasCenter, placeCollider } from "./light_strip_fence";
import { add, toDirection, toBlockFace, neg, Directions } from "./vectors";
import { Basis } from "./basis";

/** @typedef {{x: Number, y: Number, z: Number}} Vector3 */

/**
 * Handles the placement or removal of a light strip fence gate.
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
export function alterLightStripFenceGate(block, permutation, placed) {
    const {dimension, location} = block;
    const basis = new Basis(toDirection(permutation.getState("minecraft:cardinal_direction")));
    const block_e = dimension.getBlock(add(location, basis.u));
    const block_w = dimension.getBlock(add(location, neg(basis.u)));
    if (block_e.hasTag("light_strip_fence")) {
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:" + toBlockFace(neg(basis.u)), placed));
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
        placeCollider(block_e);
    }
    if (block_w.hasTag("light_strip_fence")) {
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:" + toBlockFace(basis.u), placed));
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
        placeCollider(block_w);
    }
    const block_a = dimension.getBlock(add(location, Directions.Up));
    if (placed) { if (block_a.isAir) placeColliderOnGate(block_a, basis.v); }
    else if (block_a.hasTag("light_strip_fence_collider")) block_a.setType("minecraft:air");
}

/**
 * Handles interactions with light strip fence gates.
 * @param {Block} block 
 * @param {Player} player 
 */
export function interactLightStripFenceGate(block, player) {
    const {location} = block;
    let {permutation} = block;
    const basis = new Basis(toDirection(permutation.getState("minecraft:cardinal_direction")));
    const block_dir = permutation.getState("minecraft:cardinal_direction");
    const block_a = block.above();
    if (permutation.getState("chroma_tech:opened") == 0) {
        let player_dir;
        if (Math.abs(basis.v.z) == 1) player_dir = dirToNorthSouthStr(player.getViewDirection());
        else player_dir = dirToEastWestStr(player.getViewDirection());
        permutation = permutation.withState("chroma_tech:opened", block_dir == player_dir ? 2 : 1);
        if (block_a.hasTag("light_strip_fence_collider")) block_a.setType("minecraft:air");
        world.playSound("open.iron_trapdoor", location);
    }
    else {
        permutation = permutation.withState("chroma_tech:opened", 0);
        if (block_a.isAir) placeColliderOnGate(block_a, basis.v);
        world.playSound("close.iron_trapdoor", location);
    }
    block.setPermutation(permutation);
}

/**
 * Places a light strip fence collider on a fence gate.
 * @param {Block} block 
 * @param {Vector3} dir 
 */
export function placeColliderOnGate(block, dir) {
    let permutation;
    if (Math.abs(dir.z) == 1) permutation = BlockPermutation.resolve("chroma_tech:light_strip_fence_collider", {
        "chroma_tech:east": true, "chroma_tech:west": true
    });
    else permutation = BlockPermutation.resolve("chroma_tech:light_strip_fence_collider", {
        "chroma_tech:north": true, "chroma_tech:south": true
    });
    block.setPermutation(permutation);
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
    block.setType("minecraft:air");
}