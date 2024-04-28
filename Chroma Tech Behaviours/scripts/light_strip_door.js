import { Block, BlockPermutation, ItemStack, world } from "@minecraft/server";
import { add, toDirection } from "./vectors";
import { Basis } from "./basis";

/**
 * Handles the placement of a new light strip door.
 * @param {Block} block 
 */
export function placeLightStripDoor(block) {
    const {dimension, location, permutation} = block;
    const basis = new Basis(toDirection(permutation.getState("minecraft:cardinal_direction")));
    const block_e = dimension.getBlock(add(location, basis.u));
    if (block_e.hasTag("light_strip_door") && !block_e.permutation.getState("chroma_tech:flipped"))
        block.setPermutation(permutation.withState("chroma_tech:flipped", true));
    block.above().setPermutation(block.permutation.withState("chroma_tech:top", true));
}

/**
 * Handles the removal of a light strip door.
 * @param {Block} block 
 * @param {BlockPermutation} permutation
 */
export function breakLightStripDoor(block, permutation) {
    const other_block = permutation.getState("chroma_tech:top") ? block.below() : block.above();
    other_block.setType("minecraft:air");
}

/**
 * Pops a lightstrip door as if it were broken.
 * @param {Block} block 
 */
export function popLightStripDoor(block) {
    const {dimension, location, typeId} = block;
    world.playSound("dig.stone", location);
    dimension.spawnItem(new ItemStack(typeId.replace("_block", "")), location);
    block.setType("minecraft:air");
    block.above().setType("minecraft:air");
}

/**
 * Handles interactions with Light Strip Doors
 * @param {Block} block 
 */
export function interactLightStripDoor(block) {
    const {location, permutation} = block;
    const open = permutation.getState("chroma_tech:open");
    const other_block = permutation.getState("chroma_tech:top") ? block.below() : block.above();
    block.setPermutation(permutation.withState("chroma_tech:open", !open));
    other_block.setPermutation(other_block.permutation.withState("chroma_tech:open", !open));
    if (!open) world.playSound("open.iron_door", location);
    else world.playSound("close.iron_door", location);
}

/**
 * Filters light strip door placement for valid locations.
 * @param {Block} block 
 */
export function validLightStripDoorPlacement(block) {
    const {location, dimension, typeId} = block;
    if (location.y + 2 > dimension.heightRange.max) return false;
    return block.above(2).isAir && !typeId.includes("fence");
}