import { EntityInventoryComponent, Player, Vector } from "@minecraft/server"

/**
 * @remarks Rotates an un-altered vector by a given block face.
 * @param {Vector} v 
 * @param {String} blockface 
 * @returns {Vector}
 */
export function rotateByBlockFace(v, blockface) {
    switch (blockface) {
        case "up": return v;
        case "down": return rotate180X(v);
        case "north": return rotate270X(v);
        case "south": return rotate90X(v);
        case "east": return rotate270Z(v);
        case "west": return rotate90Z(v);
        default: console.error(`rotateByBlockFace Error: incorrect type passed to blockface argument.`);
    }
}

/**
 * Rotates a vector by a given cardinal direction.
 * @param {Vector} v 
 * @param {String} direction 
 * @returns {Vector}
 */
export function rotateByCardinalDirection(v, direction) {
    switch (direction) {
        case "north": return v;
        case "south": return rotate180Y(v);
        case "east": return rotate90Y(v);
        case "west": return rotate270Y(v);
        default: console.error(`rotateByCardinalDirection Error: incorrect type passed to direction argument.`);
    }
}

/**
 * Returns a direction in block face string format.
 * @param {Vector} v 
 * @returns {String}
 */
export function toBlockFace(v) {
    if (v.equals(Vector.up)) return "up";
    if (v.equals(Vector.down)) return "down";
    if (v.equals(Vector.forward)) return "north";
    if (v.equals(Vector.back)) return "south";
    if (v.equals(Vector.left)) return "east";
    if (v.equals(Vector.right)) return "west";
    console.error(`toBlockFace Error: vector parameter is not a direction.\nVector: {${v.x}, ${v.y}, ${v.z}}`);
}

/**
 * Returns a direction in vector format.
 * @param {String} blockface 
 * @returns {Vector}
 */
export function toDirection(blockface) {
    blockface = blockface.toLowerCase()
    switch (blockface) {
        case "up": return Vector.up;
        case "down": return Vector.down;
        case "north": return Vector.forward;
        case "south": return Vector.back;
        case "east": return Vector.left;
        case "west": return Vector.right;
        default: console.error(`toDirection Error: incorrect type passed to blockface argument.`);
    }
}

/**
 * @remarks Rotates a vector 90° on the X axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate90X(v) {
    return new Vector(v.x, -v.z, v.y);
}
/**
 * @remarks Rotates a vector 180° on the X axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate180X(v) {
    return new Vector(v.x, -v.y, -v.z);
}
/**
 * @remarks Rotates a vector -90° on the X axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate270X(v) {
    return new Vector(v.x, v.z, -v.y);
}

/**
 * @remarks Rotates a vector 90° on the Y axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate90Y(v) {
    return new Vector(-v.z, v.y, v.x);
}
/**
 * @remarks Rotates a vector 180° on the Y axis.
 * @param {Vector} v
 * @returns {Vector}
 */
export function rotate180Y(v) {
    return new Vector(-v.x, v.y, -v.z);
}
/**
 * @remarks Rotates a vector -90° on the Y axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate270Y(v) {
    return new Vector(v.z, v.y, -v.x);
}

/**
 * @remarks Rotates a vector 90° on the Z axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate90Z(v) {
    return new Vector(-v.y, v.x, v.z);
}
/**
 * @remarks Rotates a vector 180° on the Z axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate180Z(v) {
    return new Vector(-v.x, -v.y, v.z);
}
/**
 * @remarks Rotates a vector -90° on the Z axis.
 * @param {Vector} v
 * @returns {Vector}
 */
function rotate270Z(v) {
    return new Vector(v.y, -v.x, v.z);
}

/**
 * Determines if a given player is in survival.
 * @param {Player} player 
 * @return {Boolean}
 */
export function inSurvival(player) {
    return player.runCommand("testfor @s[m=s]").successCount == 1;
}

/**
 * Converts a direction vector to a cardinal direction index.
 * @param {Vector} d 
 * @return {Number}
 */
export function dirToCardinalIdx(d) {
    const d_dot_n = dot(d, Vector.forward);
    const d_dot_s = dot(d, Vector.back);
    const d_dot_e = dot(d, Vector.left);
    const d_dot_w = dot(d, Vector.right);
    const facing = Math.max(d_dot_n, d_dot_s, d_dot_e, d_dot_w);
    if (facing == d_dot_s) return 1;
    if (facing == d_dot_e) return 2;
    if (facing == d_dot_w) return 3;
    return 0;
}

/** Maps cardinal direction indices to legacy direction indices. */
export const legacyIdx = [3,2,0,1];

/** Maps cardinal direction indices to weirdo direction indices. */
export const weirdoIdx = [2,3,1,0];

/** Maps cardinal direction indices to sculk direction indices. */
export const sculkIdx = [0,2,1,3];

/** Maps cardinal direction indices to facing direction indices. */
export const facingIdx = [2,3,5,4];

/** Maps cardinal direction indices to beehive direction indices. */
export const beehiveIdx = [2,0,3,1];

/** Maps cardinal direction indices to fence gate direction indices. */
export const gateIdx = [0,0,1,1];

/** Maps cardinal direction indices to cardinal direction strings. */
export const cardinalStr = ["north","south","east","west"];

/**
 * Converts a direction vector to a north-south cardinal direction string.
 * @param {Vector} d 
 * @return {String}
 */
export function dirToNorthSouthStr(d) {
    const d_dot_n = dot(d, Vector.forward);
    const d_dot_s = dot(d, Vector.back);
    const facing = Math.max(d_dot_n, d_dot_s);
    if (facing == d_dot_s) return "south";
    return "north";
}

/**
 * Converts a direction vector to an east-west cardinal direction string.
 * @param {Vector} d 
 * @return {String}
 */
export function dirToEastWestStr(d) {
    const d_dot_e = dot(d, Vector.left);
    const d_dot_w = dot(d, Vector.right);
    const facing = Math.max(d_dot_e, d_dot_w);
    if (facing == d_dot_w) return "west";
    return "east";
}

/**
 * Returns the dot product of two vectors.
 * @param {Vector} u 
 * @param {Vector} v 
 * @returns {Number}
 */
function dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
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