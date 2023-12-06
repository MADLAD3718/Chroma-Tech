import { world, PlayerPlaceBlockAfterEvent, ItemUseOnBeforeEvent, ItemStartUseOnAfterEvent, PlayerInteractWithBlockAfterEvent, PlayerBreakBlockBeforeEvent, system } from "@minecraft/server";
import { alterLightStrip, validLightStripPlacement } from "./light_strip";
import { breakLightStripDoor, interactLightStripDoor, placeLightStripDoor, validLightStripDoorPlacement } from "./light_strip_door";
import { alterLightStripFence, breakCollider, interactLightStripFenceCollider } from "./light_strip_fence";
import { alterLightStripFenceGate, interactLightStripFenceGate } from "./light_strip_fence_gate";
import { interactLightStripTrapdoor } from "./light_strip_trapdoor";
import { alterBlock } from "./blocks";
import "./extensions/export";

world.afterEvents.playerPlaceBlock.subscribe(placeBlock);
world.beforeEvents.playerBreakBlock.subscribe(breakBlock);
world.beforeEvents.playerInteractWithBlock.subscribe(interactBlock);
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
    else alterBlock(block);
}

/**
 * @remarks Updates any light strips surrounding a light strip break event.
 * @param {PlayerBreakBlockBeforeEvent} event
 */
function breakBlock({block, player}) {
    const permutation = block.permutation;
    if (block.permutation.hasTag("light_strip"))
        system.run(() => {alterLightStrip(block, permutation, false)});
    else if (permutation.hasTag("light_strip_door"))
        system.run(() => {breakLightStripDoor(block, permutation)});
    else if (permutation.hasTag("light_strip_fence"))
        system.run(() => {alterLightStripFence(block, permutation, false)});
    else if (permutation.hasTag("light_strip_fence_collider")) system.run(() => {breakCollider(block, player)});
    else if (permutation.hasTag("light_strip_fence_gate"))
        system.run(() => {alterLightStripFenceGate(block, permutation, false)});
    else alterBlock(block);
}

/**
 * @remarks Updates any special blocks surrounding a block interaction event.
 * @param {PlayerInteractWithBlockAfterEvent} event
 */
function interactBlock(event) {
    alterBlock(event.block);
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