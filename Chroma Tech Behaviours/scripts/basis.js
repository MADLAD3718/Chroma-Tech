import { Directions, add, cross, mul, norm } from "./vectors";

/** @typedef {{x: Number, y: Number, z: Number}} Vector3 */

export class Basis {
    u;
    v;
    w;
    /**
     * Creates a new axis-aligned orthonormal Basis.
     * @param {Vector3} n 
     */
    constructor(n) {
        this.v = n;
        if (Math.abs(n.y) == 1) this.u = Directions.West;
        else this.u = norm({x: n.z, y: 0, z: -n.x});
        this.w = cross(n, this.u);
    }
    /**
     * Localizes `v` to the basis.
     * @param {Vector3} v 
     * @returns {Vector3}
     */
    localize(v) {
        const a = mul(this.u, v.x);
        const b = mul(this.v, v.y);
        const c = mul(this.w, v.z);
        return add(a, add(b, c));
    }
}

/**
 * Returns the inverse of an orthonormal basis.
 * @param {Basis} basis 
 * @returns {Basis}
 */
export function inverse(basis) {
    const u = basis.u;
    const v = basis.v;
    const w = basis.w;
    basis.u = {x: u.x, y: v.x, z: w.x};
    basis.v = {x: u.y, y: v.y, z: w.y};
    basis.w = {x: u.z, y: v.z, z: w.z};
    return basis;
}