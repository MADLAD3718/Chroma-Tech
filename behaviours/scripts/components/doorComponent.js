import { BlockComponentOnPlaceEvent, BlockComponentPlayerInteractEvent, BlockComponentPlayerPlaceBeforeEvent, BlockPermutation, BlockTypes, world } from "@minecraft/server";
import { strToDir } from "../extensions/vectors";
import { buildTNB } from "../extensions/matrices";

/** @type {import("@minecraft/server").BlockCustomComponent} */
export const doorComponent = {
    onPlace: placeDoor,
    onPlayerInteract: toggleDoor,
    beforeOnPlayerPlace: filterDoorPlacement,
    onPlayerDestroy: event => breakDoor(event.block, event.destroyedBlockPermutation)
}

/**
 * @param {BlockComponentOnPlaceEvent} event
 */
function placeDoor({block}) {
    if (block.permutation.getState("onyx:top")) return;
    const direction = strToDir(block.permutation.getState("minecraft:cardinal_direction"));
    const tnb = buildTNB(direction);
    if (block.offset(tnb.u).typeId.endsWith("door"))
        block.setPermutation(block.permutation.withState("onyx:flipped", true));
    block.above().setPermutation(block.permutation.withState("onyx:top", true));
}

/**
 * @param {Block} block
 * @param {BlockPermutation} permutation
 */
function breakDoor(block, permutation) {
    if (permutation.getState("onyx:top"))
        block.below().setType(BlockTypes.get("air"));
    else block.above().setType(BlockTypes.get("air"));
}

/**
 * @param {BlockComponentPlayerInteractEvent} event 
 */
function toggleDoor(event) {
    const block = event.block;
    const open = !block.permutation.getState("onyx:open")
    block.setPermutation(block.permutation.withState("onyx:open", open));
    if (block.permutation.getState("onyx:top"))
        block.below().setPermutation(block.permutation.withState("onyx:top", false));
    else block.above().setPermutation(block.permutation.withState("onyx:top", true));
    block.dimension.playSound(open ? "open.iron_door" : "close.iron_door", block.center());
}

/**
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
function filterDoorPlacement(event) {
    event.cancel = !event.block.above().isAir;
}

world.afterEvents.blockExplode.subscribe(event => {
    if (!event.explodedBlockPermutation.hasTag("door")) return;
    breakDoor(event.block, event.explodedBlockPermutation);
});
