export const Directions = Object.freeze({
    Up: { x: 0, y: 1, z: 0 },
    Down: { x: 0, y: -1, z: 0 },
    North: { x: 0, y: 0, z: -1 },
    South: { x: 0, y: 0, z: 1 },
    East: { x: 1, y: 0, z: 0 },
    West: { x: -1, y: 0, z: 0 }
});

export function strToDir(dir) {
    switch (dir.toLowerCase()) {
        case "up": return Directions.Up;
        case "down": return Directions.Down;
        case "north": return Directions.North;
        case "south": return Directions.South;
        case "east": return Directions.East;
        case "west": return Directions.West;
    }
}

export function dirToStr(dir) {
    if (equal(dir, Directions.Up)) return "up";
    if (equal(dir, Directions.Down)) return "down";
    if (equal(dir, Directions.North)) return "north";
    if (equal(dir, Directions.South)) return "south";
    if (equal(dir, Directions.East)) return "east";
    if (equal(dir, Directions.West)) return "west";
}

export function toVec(x) {
    return { x: x, y: x, z: x };
}

export function stringifyVec(v) {
    const { x, y, z } = v;
    return `${x} ${y} ${z}`;
}

export function parseVec(s) {
    const [x, y, z] = s.split(" ").map(Number);
    return { x, y, z };
}

export function any(v) {
    return v.x || v.y || v.z;
}

export function all(v) {
    return v.x && v.y && v.z;
}

export function isnan(v) {
    return v.x == NaN || v.y == NaN || v.z == NaN;
}

export function isinf(v) {
    v = abs(v);
    return v.x == Infinity || v.y == Infinity || v.z == Infinity;
}

export function isfinite(v) {
    return !isinf(v);
}

export function equal(u, v) {
    return u.x == v.x && u.y == v.y && u.z == v.z;
}

export function min(u, v) {
    return {
        x: Math.min(u.x, v.x),
        y: Math.min(u.y, v.y),
        z: Math.min(u.z, v.z)
    };
}

export function max(u, v) {
    return {
        x: Math.max(u.x, v.x),
        y: Math.max(u.y, v.y),
        z: Math.max(u.z, v.z)
    };
}

export function clamp(v, min, max) {
    return {
        x: Math.min(Math.max(v.x, min.x), max.x),
        y: Math.min(Math.max(v.y, min.y), max.y),
        z: Math.min(Math.max(v.z, min.z), max.z)
    };
}

export function sign(v) {
    return {
        x: Math.sign(v.x),
        y: Math.sign(v.y),
        z: Math.sign(v.z)
    };
}

export function floor(v) {
    return {
        x: Math.floor(v.x),
        y: Math.floor(v.y),
        z: Math.floor(v.z)
    };
}

export function ceil(v) {
    return {
        x: Math.ceil(v.x),
        y: Math.ceil(v.y),
        z: Math.ceil(v.z)
    };
}

export function frac(v) {
    return {
        x: v.x - Math.floor(v.x),
        y: v.y - Math.floor(v.y),
        z: v.z - Math.floor(v.z)
    };
}

export function round(v) {
    return {
        x: Math.round(v.x),
        y: Math.round(v.y),
        z: Math.round(v.z)
    };
}

export function mod(u, v) {
    return {
        x: u.x % v.x,
        y: u.y % v.y,
        z: u.z % v.z
    };
}

export function neg(v) {
    return {
        x: -v.x,
        y: -v.y,
        z: -v.z
    };
}

export function abs(v) {
    return {
        x: Math.abs(v.x),
        y: Math.abs(v.y),
        z: Math.abs(v.z)
    };
}

export function add(u, v) {
    return {
        x: u.x + v.x,
        y: u.y + v.y,
        z: u.z + v.z
    };
}

export function sub(u, v) {
    return {
        x: u.x - v.x,
        y: u.y - v.y,
        z: u.z - v.z
    };
}

export function mul(u, v) {
    if (typeof v == "number") v = toVec(v);
    return {
        x: u.x * v.x,
        y: u.y * v.y,
        z: u.z * v.z
    };
}

export function div(u, v) {
    if (typeof v == "number") v = toVec(v);
    return {
        x: u.x / v.x,
        y: u.y / v.y,
        z: u.z / v.z
    };
}

export function sqrt(v) {
    return {
        x: Math.sqrt(v.x),
        y: Math.sqrt(v.y),
        z: Math.sqrt(v.z)
    };
}

export function exp(v) {
    return {
        x: Math.exp(v.x),
        y: Math.exp(v.y),
        z: Math.exp(v.z)
    };
}

export function exp2(v) {
    return {
        x: Math.pow(2, v.x),
        y: Math.pow(2, v.y),
        z: Math.pow(2, v.z)
    };
}

export function pow(v, p) {
    if (typeof p == "number") p = toVec(e);
    return {
        x: Math.pow(v.x, p),
        y: Math.pow(v.y, p),
        z: Math.pow(v.z, p)
    };
}

export function log(v) {
    return {
        x: Math.log(v.x),
        y: Math.log(v.y),
        z: Math.log(v.z)
    };
}

export function log2(v) {
    return {
        x: Math.log2(v.x),
        y: Math.log2(v.y),
        z: Math.log2(v.z)
    };
}

export function log10(v) {
    return {
        x: Math.log10(v.x),
        y: Math.log10(v.y),
        z: Math.log10(v.z)
    };
}

export function sin(v) {
    return {
        x: Math.sin(v.x),
        y: Math.sin(v.y),
        z: Math.sin(v.z)
    };
}

export function cos(v) {
    return {
        x: Math.cos(v.x),
        y: Math.cos(v.y),
        z: Math.cos(v.z)
    };
}

export function tan(v) {
    return {
        x: Math.tan(v.x),
        y: Math.tan(v.y),
        z: Math.tan(v.z)
    };
}

export function asin(v) {
    return {
        x: Math.asin(v.x),
        y: Math.asin(v.y),
        z: Math.asin(v.z)
    };
}

export function acos(v) {
    return {
        x: Math.acos(v.x),
        y: Math.acos(v.y),
        z: Math.acos(v.z)
    };
}

export function atan(v) {
    return {
        x: Math.atan(v.x),
        y: Math.atan(v.y),
        z: Math.atan(v.z)
    };
}

export function sinh(v) {
    return {
        x: Math.sinh(v.x),
        y: Math.sinh(v.y),
        z: Math.sinh(v.z)
    };
}

export function cosh(v) {
    return {
        x: Math.cosh(v.x),
        y: Math.cosh(v.y),
        z: Math.cosh(v.z)
    };
}

export function tanh(v) {
    return {
        x: Math.tanh(v.x),
        y: Math.tanh(v.y),
        z: Math.tanh(v.z)
    };
}

export function asinh(v) {
    return {
        x: Math.asinh(v.x),
        y: Math.asinh(v.y),
        z: Math.asinh(v.z)
    };
}

export function acosh(v) {
    return {
        x: Math.acosh(v.x),
        y: Math.acosh(v.y),
        z: Math.acosh(v.z)
    };
}

export function atanh(v) {
    return {
        x: Math.atanh(v.x),
        y: Math.atanh(v.y),
        z: Math.atanh(v.z)
    };
}

export function dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
}

export function cross(u, v) {
    return {
        x: u.y * v.z - u.z * v.y,
        y: u.z * v.x - u.x * v.z,
        z: u.x * v.y - u.y * v.x
    };
}

export function length(v) {
    return Math.hypot(v.x, v.y, v.z);
}

export function normalize(v) {
    return div(v, length(v));
}

export function project(u, v) {
    return mul(v, dot(u, v) / dot(v, v));
}

export function reject(u, v) {
    return sub(u, project(u, v));
}

export function reflect(i, n) {
    return sub(i, mul(n, 2 * dot(n, i)));
}

export function refract(i, n, eta) {
    const cosi = -dot(i, n);
    const sin2t = eta * eta * (1 - cosi * cosi);
    const cost = Math.sqrt(1 - sin2t);
    return add(mul(i, eta), mul(n, eta * cosi - cost));
}

export function rotate(k, t, v) {
    const cos = Math.cos(t);
    const sin = Math.sin(t);
    const par = mul(k, dot(v, k));
    const perp = sub(v, par);
    const kv = cross(k, perp);
    return add(par, add(mul(perp, cos), mul(kv, sin)));
}

export function lerp(u, v, t) {
    return add(u, mul(sub(v, u), t));
}

export function slerp(u, v, t) {
    const omega = Math.acos(dot(u, v));
    return add(mul(u, Math.sin((1 - t) * omega)), mul(v, Math.sin(t * omega)));
}

export function cardinalAngle(v) {
    const cos = dot(v, Directions.South);
    const sin = dot(cross(v, Directions.South), Directions.Up);
    return Math.atan2(sin, cos);
}
