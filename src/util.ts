import { Vec3, Vector3 } from "@madlad3718/mcvec3";
import { Direction } from "@minecraft/server";

export const FENCE_TAG = "chroma_tech:fence_connect";
export const LIGHT_STRIP_TAG = "chroma_tech:wire_connect_light_strip";

/**
 * A cardinal direction acquired from the
 * `"minecraft:cardinal_direction"` or `"minecraft:block_face"`
 * block state.
 */
export enum StringDirection {
    Up = "up",
    Down = "down",
    North = "north",
    South = "south",
    East = "east",
    West = "west"
}

/**
 * Converts a string direction to a {@link Direction}.
 * @param d The string direction value.
 */
export function stringDirectionToDirection(d: string): Direction {
    switch (d) {
        case StringDirection.Up: return Direction.Up;
        case StringDirection.Down: return Direction.Down;
        case StringDirection.North: return Direction.North;
        case StringDirection.South: return Direction.South;
        case StringDirection.East: return Direction.East;
        case StringDirection.West: return Direction.West
    }
    throw new Error(`${d} is not a StringDirection.`);
}

/**
 * Converts a cardinal direction value to a unit vector. 
 * @param d The cardinal direction value.
 */
export function stringToVec(d: string): Vector3 {
    return Vec3.from(stringDirectionToDirection(d) as Direction);
}

/**
 * Converts a direction vector into a cardinal direction string.
 * @param v The specified vector.
 */
export function vecToString(v: Vector3) {
    return Vec3.toDirection(v).toLowerCase();
}
