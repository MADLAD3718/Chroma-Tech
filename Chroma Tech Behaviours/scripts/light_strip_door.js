import { Block, BlockPermutation, ItemStack, Vector, world, BlockTypes } from "@minecraft/server";
import { rotateByCardinalDirection } from "./util";

/**
 * Handles the placement of a new light strip door.
 * @param {Block} block 
 */
export function placeLightStripDoor(block) {
    const {dimension, location, permutation} = block;
    const rEast = rotateByCardinalDirection(Vector.left, permutation.getState("minecraft:cardinal_direction"));
    const block_e = dimension.getBlock(Vector.add(location, rEast));
    if (block_e.hasTag("light_strip_door") && !block_e.permutation.getState("chroma_tech:flipped"))
        block.setPermutation(permutation.withState("chroma_tech:flipped", true));
    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    block_a.setPermutation(block.permutation.withState("chroma_tech:top", true));
}

/**
 * Handles the removal of a light strip door.
 * @param {Block} block 
 * @param {BlockPermutation} permutation
 */
export function breakLightStripDoor(block, permutation) {
    const {dimension, location} = block;
    const other_block = dimension.getBlock(Vector.add(location, permutation.getState("chroma_tech:top") ? Vector.down : Vector.up));
    other_block.setType(BlockTypes.get("air"));
}

/**
 * Pops a lightstrip door as if it were broken.
 * @param {Block} block 
 */
export function popLightStripDoor(block) {
    const {dimension, location} = block;
    dimension.spawnItem(new ItemStack(block.typeId.replace("_block", "")), location);
    block.setType(BlockTypes.get("air"));
    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    block_a.setType(BlockTypes.get("air"));
}

/**
 * Handles interactions with Light Strip Doors
 * @param {Block} block 
 */
export function interactLightStripDoor(block) {
    const {dimension, location, permutation} = block;
    const state = permutation.getState("chroma_tech:open");
    const other_block = dimension.getBlock(Vector.add(location, permutation.getState("chroma_tech:top") ? Vector.down : Vector.up));
    block.setPermutation(permutation.withState("chroma_tech:open", !state));
    other_block.setPermutation(other_block.permutation.withState("chroma_tech:open", !state));
    if (!state) world.playSound("open.iron_door", location);
    else world.playSound("close.iron_door", location);
}

/**
 * Filters light strip door placement for valid locations.
 * @param {Block} block 
 */
export function validLightStripDoorPlacement(block) {
    const {dimension, location} = block;
    const block_aa = dimension.getBlock(Vector.add(location, Vector.multiply(Vector.up, 2)));
    return block_aa.isAir && !block.typeId.includes("fence");
}