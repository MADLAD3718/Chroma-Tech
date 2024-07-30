import { add, cross, Directions, dot, mul, normalize } from "./vectors";

export class Matrix3 {
    u = {x: 1, y: 0, z: 0};
    v = {x: 0, y: 1, z: 0};
    w = {x: 0, y: 0, z: 1};
    mul(x) {
        if (typeof x == "number") {
            const m = new Matrix3;
            m.u = mul(this.u, x);
            m.v = mul(this.v, x);
            m.w = mul(this.w, x);
            return m;
        }
        const a = mul(this.u, x.x);
        const b = mul(this.v, x.y);
        const c = mul(this.w, x.z);
        return add(a, add(b, c));
    }
}

export function buildTNB(n) {
    const m = new Matrix3;
    m.v = n;
    if (Math.abs(n.y) == 1) m.u = Directions.West;
    else m.u = normalize({x: n.z, y: 0, z: -n.x});
    m.w = cross(n, m.u);
    return m;
}

export function transpose(m) {
    const {u, v, w} = m;
    const tra = new Matrix3;
    tra.u = {x: u.x, y: v.x, z: w.x};
    tra.v = {x: u.y, y: v.y, z: w.y};
    tra.w = {x: u.z, y: v.z, z: w.z};
    return tra;
}

export function determinant(m) {
    const {u, v, w} = m;
    return u.x * v.y * w.z + u.y * v.z * w.x + u.z * v.x * w.y
         - w.x * v.y * u.z - w.y * v.z * u.x - w.z * v.x * u.y;
}

export function trace(m) {
    return m.u.x + m.v.y + m.w.z;
}

export function adjugate(m) {
    const {u, v, w} = m;
    const adj = new Matrix3;
    adj.u.x = v.y * w.z - w.y * v.z;
    adj.u.y = w.y * u.z - u.y * w.z;
    adj.u.z = u.y * v.z - v.y * u.z;
    adj.v.x = w.x * v.z - v.x * w.z;
    adj.v.y = u.x * w.z - w.x * u.z;
    adj.v.z = v.x * u.z - u.x * v.z;
    adj.w.x = v.x * w.y - w.x * v.y;
    adj.w.y = w.x * u.y - u.x * w.y;
    adj.w.z = u.x * v.y - v.x * u.y;
    return adj;
}

export function inverse(m) {
    return adjugate(m).mul(1 / determinant(m));
}
