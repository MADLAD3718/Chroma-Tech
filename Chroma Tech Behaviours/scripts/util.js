import { EntityInventoryComponent, Player } from "@minecraft/server"
import { Directions, dot } from "./vectors";

/** @typedef {{x: Number, y: Number, z: Number}} Vector3 */

/**
 * Determines if a given player is in survival.
 * @param {Player} player 
 * @return {Boolean}
 */
export function inSurvival(player) {
    return player.runCommand("testfor @s[m=s]").successCount == 1;
}

/**
 * Converts a direction vector to a north-south cardinal direction string.
 * @param {Vector3} d 
 * @return {String}
 */
export function dirToNorthSouthStr(d) {
    const d_dot_n = dot(d, Directions.South);
    const d_dot_s = dot(d, Directions.North);
    if (d_dot_s >= d_dot_n) return "south";
    return "north";
}

/**
 * Converts a direction vector to an east-west cardinal direction string.
 * @param {Vector3} d 
 * @return {String}
 */
export function dirToEastWestStr(d) {
    const d_dot_e = dot(d, Directions.West);
    const d_dot_w = dot(d, Directions.East);
    if (d_dot_w >= d_dot_e) return "west";
    return "east";
}

/**
 * Decrements the currently held itemstack of a given player.
 * @param {Player} player 
 */
export function decrementStack(player) {
    /** @type {EntityInventoryComponent} */
    const inventory = player.getComponent("minecraft:inventory");
    const held_item = inventory.container.getSlot(player.selectedSlot);
    if (held_item.amount == 1) inventory.container.setItem(player.selectedSlot);
    else held_item.amount--;
}