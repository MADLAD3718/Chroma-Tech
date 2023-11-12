import { world, PlayerPlaceBlockAfterEvent, PlayerBreakBlockAfterEvent, ItemUseOnBeforeEvent, ItemStartUseOnAfterEvent } from "@minecraft/server";
import { alterLightStrip, validLightStripPlacement } from "./light_strip";
import { breakLightStripDoor, interactLightStripDoor, placeLightStripDoor, validLightStripDoorPlacement } from "./light_strip_door";
import { alterLightStripFence, breakCollider, interactLightStripFenceCollider } from "./light_strip_fence";
import { alterLightStripFenceGate, interactLightStripFenceGate } from "./light_strip_fence_gate";
import { interactLightStripTrapdoor } from "./light_strip_trapdoor";
import { alterSolidBlock } from "./blocks";

world.afterEvents.playerPlaceBlock.subscribe(placeBlock);
world.afterEvents.playerBreakBlock.subscribe(breakBlock);
world.afterEvents.itemStartUseOn.subscribe(interactHandler);
world.beforeEvents.itemUseOn.subscribe(placementFilter);

/**
 * @remarks Updates any light strips surrounding a block place event.
 * @param {PlayerPlaceBlockAfterEvent} event
 */
function placeBlock({block}) {
    if (block.hasTag("light_strip")) alterLightStrip(block, block.permutation, true);
    else if (block.hasTag("light_strip_door")) placeLightStripDoor(block);
    else if (block.hasTag("light_strip_fence")) alterLightStripFence(block, block.permutation, true);
    else if (block.hasTag("light_strip_fence_gate")) alterLightStripFenceGate(block, block.permutation, true);
    else if (block.isSolid) alterSolidBlock(block, true);
}

/**
 * @remarks Updates any light strips surrounding a light strip break event.
 * @param {PlayerBreakBlockAfterEvent} event
 */
function breakBlock({block, brokenBlockPermutation, player}) {
    if (brokenBlockPermutation.hasTag("light_strip")) alterLightStrip(block, brokenBlockPermutation, false);
    else if (brokenBlockPermutation.hasTag("light_strip_door")) breakLightStripDoor(block, brokenBlockPermutation);
    else if (brokenBlockPermutation.hasTag("light_strip_fence")) alterLightStripFence(block, brokenBlockPermutation, false);
    else if (brokenBlockPermutation.hasTag("light_strip_fence_collider")) breakCollider(block, player);
    else if (brokenBlockPermutation.hasTag("light_strip_fence_gate")) alterLightStripFenceGate(block, brokenBlockPermutation, false);
    else alterSolidBlock(block, false);
}

/**
 * Handles item use on events.
 * @param {ItemUseOnBeforeEvent} event 
 */
function placementFilter(event) {
    if (event.itemStack.hasTag("chroma_tech:light_strip")) event.cancel = !validLightStripPlacement(event.block, event.blockFace);
    else if (event.itemStack.hasTag("chroma_tech:light_strip_door")) event.cancel = !validLightStripDoorPlacement(event.block);
}

/**
 * Handles interaction events with custom blocks.
 * @param {ItemStartUseOnAfterEvent} event 
 */
function interactHandler(event) {
    if (event.block.hasTag("light_strip_door") && (!event.source.isSneaking || !event.itemStack)) interactLightStripDoor(event.block);
    // Full block replacement function is currently unused since it isn't very good.
    else if (event.block.hasTag("light_strip_fence_collider")) interactLightStripFenceCollider(event.block, event.itemStack, event.source);
    else if (event.block.hasTag("light_strip_fence_gate") && (!event.source.isSneaking || event.itemStack)) interactLightStripFenceGate(event.block, event.source);
    else if (event.block.hasTag("light_strip_trapdoor") && (!event.source.isSneaking || !event.itemStack)) interactLightStripTrapdoor(event.block);
}