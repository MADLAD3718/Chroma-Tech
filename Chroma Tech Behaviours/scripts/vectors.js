/** @typedef {{x: Number, y: Number, z: Number}} Vector3 */

/**
 * Enum for directions.
 * @enum {Vector3}
 */
export const Directions = {
    /** @type {Vector3} @readonly */
    Up: {x: 0, y: 1, z: 0},
    /** @type {Vector3} @readonly */
    Down: {x: 0, y: -1, z: 0},
    /** @type {Vector3} @readonly */
    North: {x: 0, y: 0, z: -1},
    /** @type {Vector3} @readonly */
    South: {x: 0, y: 0, z: 1},
    /** @type {Vector3} @readonly */
    East: {x: 1, y: 0, z: 0},
    /** @type {Vector3} @readonly */
    West: {x: -1, y: 0, z: 0}
};

/**
 * Returns the vector equivalent of the blockface.
 * @param {String} blockface 
 * @returns {Vector3}
 */
export function toDirection(blockface) {
    switch (blockface.toLowerCase()) {
        case "up": return Directions.Up;
        case "down": return Directions.Down;
        case "north": return Directions.North;
        case "south": return Directions.South;
        case "east": return Directions.East;
        case "west": return Directions.West;
    }
}

/**
 * Returns the blockface equivalent of the direction vector.
 * @param {Vector3} direction 
 * @returns {String}
 */
export function toBlockFace(direction) {
    if (equal(direction, Directions.Up)) return "up";
    if (equal(direction, Directions.Down)) return "down";
    if (equal(direction, Directions.North)) return "north";
    if (equal(direction, Directions.South)) return "south";
    if (equal(direction, Directions.East)) return "east";
    if (equal(direction, Directions.West)) return "west";
}

/**
 * Stringifies a vector.
 * @param {Vector3} v 
 * @returns {String}
 */
export function stringifyVec(v) {
    const {x, y, z} = v;
    return [x,y,z].join(" ");
}

/**
 * Parses a stringified vector.
 * @param {String} s 
 * @returns {Vector3}
 */
export function parseVec(s) {
    const s1 = s.indexOf(" ");
    const s2 = s.indexOf(" ", s1 + 1);
    return {
        x: parseFloat(s.slice(0, s1)),
        y: parseFloat(s.slice(s1 + 1, s2)),
        z: parseFloat(s.slice(s2 + 1))
    };
}

/**
 * Returns a `Vector3` with all components equal to `x`.
 * @param {Number} x 
 * @returns {Vector3}
 */
export function toVec(x) {
    return {x: x, y: x, z: x};
}

/**
 * Returns `true` if `u` and `v` are equal.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Boolean}
 */
export function equal(u, v) {
    return u.x == v.x && u.y == v.y && u.z == v.z;
}

/**
 * Returns the negation of `v`.
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function neg(v) {
    return {
        x: -v.x,
        y: -v.y,
        z: -v.z
    };
}

/**
 * Returns the floor of the components of `v`.
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function floor(v) {
    return {
        x: Math.floor(v.x),
        y: Math.floor(v.y),
        z: Math.floor(v.z)
    };
}

/**
 * Returns the ceiling of the components of `v`.
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function ceil(v) {
    return {
        x: Math.ceil(v.x),
        y: Math.ceil(v.y),
        z: Math.ceil(v.z)
    };
}

/**
 * Returns the vector addition `u` + `v`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function add(u, v) {
    return {
        x: u.x + v.x,
        y: u.y + v.y,
        z: u.z + v.z
    };
}

/**
 * Returns the vector subtraction `u` - `v`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function sub(u, v) {
    return {
        x: u.x - v.x,
        y: u.y - v.y,
        z: u.z - v.z
    };
}

/**
 * Returns the component-wise multiplication of `u` and `v`.
 * @param {Vector3} u 
 * @param {Vector3 | Number} v 
 * @returns {Vector3}
 */
export function mul(u, v) {
    if (typeof v == "number") return {
        x: u.x * v,
        y: u.y * v,
        z: u.z * v
    };
    return {
        x: u.x * v.x,
        y: u.y * v.y,
        z: u.z * v.z
    };
}

/**
 * Returns the component-wise division of `u` and `v`.
 * @param {Vector3} u 
 * @param {Vector3 | Number} v 
 * @returns {Vector3}
 */
export function div(u, v) {
    if (typeof v == "number") return {
        x: u.x / v,
        y: u.y / v,
        z: u.z / v
    };
    return {
        x: u.x / v.x,
        y: u.y / v.y,
        z: u.z / v.z
    };
}

/**
 * Returns the dot product of `u` and `v`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Number}
 */
export function dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
}

/**
 * Returns the cross product of `u` and `v`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function cross(u, v) {
    return {
        x: u.y * v.z - u.z * v.y,
        y: u.z * v.x - u.x * v.z,
        z: u.x * v.y - u.y * v.x
    };
}

/**
 * Returns the magnitude of `v`.
 * @param {Vector3} v 
 * @returns {Number}
 */
export function length(v) {
    return Math.hypot(v.x, v.y, v.z);
}

/**
 * Returns the distance between `u` and `v`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Number}
 */
export function dist(u, v) {
    return length(sub(u, v));
}

/**
 * Returns the determinant of a matrix formed by `u`, `v` and `w`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @param {Vector3} w 
 * @returns {Number}
 */
export function det(u, v, w) {
    return dot(u, cross(v, w));
}

/**
 * Returns a normalized `v`.
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function norm(v) {
    return div(v, length(v));
}

/**
 * Returns the projection of `u` onto `v`;
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function project(u, v) {
    return mul(v, dot(u, v) / dot(v, v));
}

/**
 * Returns the rejection of `u` from `v`.
 * @param {Vector3} u 
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function reject(u, v) {
    return sub(u, project(u, v));
}

/**
 * Rotates a vector `v` by angle `t` across an axis `k`.
 * @param {Vector3} k 
 * @param {Number} t 
 * @param {Vector3} v 
 * @returns {Vector3}
 */
export function rot(k, t, v) {
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const par = mul(k, dot(v, k));
    const perp = sub(v, par);
    const kv = cross(k, perp);
    return add(par, add(mul(perp, cos), mul(kv, sin)));
}