// src/main.ts
import { world as world4 } from "@minecraft/server";

// src/components/doorComponent.ts
import { world } from "@minecraft/server";

// node_modules/@madlad3718/mcvec3/dist/index.js
import { Direction } from "@minecraft/server";
var Vec3;
((Vec32) => {
  Vec32.Zero = { x: 0, y: 0, z: 0 };
  Vec32.Up = { x: 0, y: 1, z: 0 };
  Vec32.Down = { x: 0, y: -1, z: 0 };
  Vec32.North = { x: 0, y: 0, z: -1 };
  Vec32.South = { x: 0, y: 0, z: 1 };
  Vec32.East = { x: 1, y: 0, z: 0 };
  Vec32.West = { x: -1, y: 0, z: 0 };
  function isVector3(v) {
    return typeof v === "object" && "x" in v && "y" in v && "z" in v;
  }
  Vec32.isVector3 = isVector3;
  function isDirection(x) {
    return typeof x === "string";
  }
  function from(x, y, z) {
    if (isDirection(x)) {
      switch (x) {
        case Direction.Up:
          return Vec32.Up;
        case Direction.Down:
          return Vec32.Down;
        case Direction.North:
          return Vec32.North;
        case Direction.South:
          return Vec32.South;
        case Direction.East:
          return Vec32.East;
        case Direction.West:
          return Vec32.West;
      }
    }
    if (typeof x === "number") return {
      x,
      y: y ?? x,
      z: z ?? x
    };
    if (Array.isArray(x)) return {
      x: x[0],
      y: x[1],
      z: x[2]
    };
    throw new Error("Invalid input values for vector construction.");
  }
  Vec32.from = from;
  function toDirection(v) {
    const a = abs(v), s = sign(v);
    const max2 = Math.max(a.x, a.y, a.z);
    if (max2 === a.x)
      return s.x >= 0 ? Direction.East : Direction.West;
    else if (max2 === a.y)
      return s.y >= 0 ? Direction.Up : Direction.Down;
    else return s.z >= 0 ? Direction.South : Direction.North;
  }
  Vec32.toDirection = toDirection;
  function toArray(v) {
    const { x, y, z } = v;
    return [x, y, z];
  }
  Vec32.toArray = toArray;
  function toString(v) {
    const { x, y, z } = v;
    return [x, y, z].join(" ");
  }
  Vec32.toString = toString;
  function parse(s) {
    const [x, y, z] = s.split(" ").map(Number);
    return { x, y, z };
  }
  Vec32.parse = parse;
  function isnan(v) {
    return Number.isNaN(v.x) || Number.isNaN(v.y) || Number.isNaN(v.z);
  }
  Vec32.isnan = isnan;
  function isinf(v) {
    return !isinf(v);
  }
  Vec32.isinf = isinf;
  function isfinite(v) {
    return Number.isFinite(v.x) && Number.isFinite(v.y) && Number.isFinite(v.z);
  }
  Vec32.isfinite = isfinite;
  function equal(u, v) {
    return u.x === v.x && u.y === v.y && u.z === v.z;
  }
  Vec32.equal = equal;
  function min(u, v) {
    return {
      x: Math.min(u.x, v.x),
      y: Math.min(u.y, v.y),
      z: Math.min(u.z, v.z)
    };
  }
  Vec32.min = min;
  function max(u, v) {
    return {
      x: Math.max(u.x, v.x),
      y: Math.max(u.y, v.y),
      z: Math.max(u.z, v.z)
    };
  }
  Vec32.max = max;
  function clamp(v, min2, max2) {
    return {
      x: Math.min(Math.max(v.x, min2.x), max2.x),
      y: Math.min(Math.max(v.y, min2.y), max2.y),
      z: Math.min(Math.max(v.z, min2.z), max2.z)
    };
  }
  Vec32.clamp = clamp;
  function sign(v) {
    return {
      x: Math.sign(v.x),
      y: Math.sign(v.y),
      z: Math.sign(v.z)
    };
  }
  Vec32.sign = sign;
  function floor(v) {
    return {
      x: Math.floor(v.x),
      y: Math.floor(v.y),
      z: Math.floor(v.z)
    };
  }
  Vec32.floor = floor;
  function ceil(v) {
    return {
      x: Math.ceil(v.x),
      y: Math.ceil(v.y),
      z: Math.ceil(v.z)
    };
  }
  Vec32.ceil = ceil;
  function frac(v) {
    return {
      x: v.x - Math.floor(v.x),
      y: v.y - Math.floor(v.y),
      z: v.z - Math.floor(v.z)
    };
  }
  Vec32.frac = frac;
  function round(v) {
    return {
      x: Math.round(v.x),
      y: Math.round(v.y),
      z: Math.round(v.z)
    };
  }
  Vec32.round = round;
  function mod(u, v) {
    return {
      x: u.x % v.x,
      y: u.y % v.y,
      z: u.z % v.z
    };
  }
  Vec32.mod = mod;
  function neg(v) {
    return {
      x: -v.x,
      y: -v.y,
      z: -v.z
    };
  }
  Vec32.neg = neg;
  function abs(v) {
    return {
      x: Math.abs(v.x),
      y: Math.abs(v.y),
      z: Math.abs(v.z)
    };
  }
  Vec32.abs = abs;
  function add(u, v) {
    return {
      x: u.x + v.x,
      y: u.y + v.y,
      z: u.z + v.z
    };
  }
  Vec32.add = add;
  function sub(u, v) {
    return {
      x: u.x - v.x,
      y: u.y - v.y,
      z: u.z - v.z
    };
  }
  Vec32.sub = sub;
  function mul(v, m) {
    if (isVector3(m)) return {
      x: v.x * m.x,
      y: v.y * m.y,
      z: v.z * m.z
    };
    else return {
      x: v.x * m,
      y: v.y * m,
      z: v.z * m
    };
  }
  Vec32.mul = mul;
  function div(v, m) {
    if (isVector3(m)) return {
      x: v.x / m.x,
      y: v.y / m.y,
      z: v.z / m.z
    };
    else return {
      x: v.x / m,
      y: v.x / m,
      z: v.x / m
    };
  }
  Vec32.div = div;
  function sqrt(v) {
    return {
      x: Math.sqrt(v.x),
      y: Math.sqrt(v.y),
      z: Math.sqrt(v.z)
    };
  }
  Vec32.sqrt = sqrt;
  function exp(v) {
    return {
      x: Math.exp(v.x),
      y: Math.exp(v.y),
      z: Math.exp(v.z)
    };
  }
  Vec32.exp = exp;
  function exp2(v) {
    return {
      x: Math.pow(2, v.x),
      y: Math.pow(2, v.y),
      z: Math.pow(2, v.z)
    };
  }
  Vec32.exp2 = exp2;
  function log(v) {
    return {
      x: Math.log(v.x),
      y: Math.log(v.y),
      z: Math.log(v.z)
    };
  }
  Vec32.log = log;
  function log2(v) {
    return {
      x: Math.log2(v.x),
      y: Math.log2(v.y),
      z: Math.log2(v.z)
    };
  }
  Vec32.log2 = log2;
  function log10(v) {
    return {
      x: Math.log10(v.x),
      y: Math.log10(v.y),
      z: Math.log10(v.z)
    };
  }
  Vec32.log10 = log10;
  function pow(v, p) {
    if (isVector3(p)) return {
      x: Math.pow(v.x, p.x),
      y: Math.pow(v.y, p.y),
      z: Math.pow(v.z, p.z)
    };
    else return {
      x: Math.pow(v.x, p),
      y: Math.pow(v.y, p),
      z: Math.pow(v.z, p)
    };
  }
  Vec32.pow = pow;
  function sin(v) {
    return {
      x: Math.sin(v.x),
      y: Math.sin(v.y),
      z: Math.sin(v.z)
    };
  }
  Vec32.sin = sin;
  function asin(v) {
    return {
      x: Math.asin(v.x),
      y: Math.asin(v.y),
      z: Math.asin(v.z)
    };
  }
  Vec32.asin = asin;
  function sinh(v) {
    return {
      x: Math.sinh(v.x),
      y: Math.sinh(v.y),
      z: Math.sinh(v.z)
    };
  }
  Vec32.sinh = sinh;
  function asinh(v) {
    return {
      x: Math.asinh(v.x),
      y: Math.asinh(v.y),
      z: Math.asinh(v.z)
    };
  }
  Vec32.asinh = asinh;
  function cos(v) {
    return {
      x: Math.cos(v.x),
      y: Math.cos(v.y),
      z: Math.cos(v.z)
    };
  }
  Vec32.cos = cos;
  function acos(v) {
    return {
      x: Math.acos(v.x),
      y: Math.acos(v.y),
      z: Math.acos(v.z)
    };
  }
  Vec32.acos = acos;
  function cosh(v) {
    return {
      x: Math.cosh(v.x),
      y: Math.cosh(v.y),
      z: Math.cosh(v.z)
    };
  }
  Vec32.cosh = cosh;
  function acosh(v) {
    return {
      x: Math.acosh(v.x),
      y: Math.acosh(v.y),
      z: Math.acosh(v.z)
    };
  }
  Vec32.acosh = acosh;
  function tan(v) {
    return {
      x: Math.tan(v.x),
      y: Math.tan(v.y),
      z: Math.tan(v.z)
    };
  }
  Vec32.tan = tan;
  function atan(v) {
    return {
      x: Math.atan(v.x),
      y: Math.atan(v.y),
      z: Math.atan(v.z)
    };
  }
  Vec32.atan = atan;
  function tanh(v) {
    return {
      x: Math.tanh(v.x),
      y: Math.tanh(v.y),
      z: Math.tanh(v.z)
    };
  }
  Vec32.tanh = tanh;
  function atanh(v) {
    return {
      x: Math.atanh(v.x),
      y: Math.atanh(v.y),
      z: Math.atanh(v.z)
    };
  }
  Vec32.atanh = atanh;
  function above(v, s = 1) {
    return add(v, mul(Vec32.Up, s));
  }
  Vec32.above = above;
  function below(v, s = 1) {
    return add(v, mul(Vec32.Down, s));
  }
  Vec32.below = below;
  function north(v, s = 1) {
    return add(v, mul(Vec32.North, s));
  }
  Vec32.north = north;
  function south(v, s = 1) {
    return add(v, mul(Vec32.South, s));
  }
  Vec32.south = south;
  function east(v, s = 1) {
    return add(v, mul(Vec32.East, s));
  }
  Vec32.east = east;
  function west(v, s = 1) {
    return add(v, mul(Vec32.West, s));
  }
  Vec32.west = west;
  function dot(u, v) {
    return u.x * v.x + u.y * v.y + u.z * v.z;
  }
  Vec32.dot = dot;
  function cross(u, v) {
    return {
      x: u.y * v.z - u.z * v.y,
      y: u.z * v.x - u.x * v.z,
      z: u.x * v.y - u.y * v.x
    };
  }
  Vec32.cross = cross;
  function length(v) {
    return Math.hypot(v.x, v.y, v.z);
  }
  Vec32.length = length;
  function normalize(v) {
    return div(v, length(v));
  }
  Vec32.normalize = normalize;
  function distance(u, v) {
    return length(sub(u, v));
  }
  Vec32.distance = distance;
  function project(u, v) {
    return mul(v, dot(u, v) / dot(v, v));
  }
  Vec32.project = project;
  function reject(u, v) {
    return sub(u, project(u, v));
  }
  Vec32.reject = reject;
  function reflect(i, n) {
    return sub(i, mul(n, 2 * dot(n, i)));
  }
  Vec32.reflect = reflect;
  function refract(i, n, e) {
    const cosi = -dot(i, n);
    const sin2t = e * e * (1 - cosi * cosi);
    const cost = Math.sqrt(1 - sin2t);
    return add(mul(i, e), mul(n, e * cosi - cost));
  }
  Vec32.refract = refract;
  function lerp(u, v, t) {
    if (t === 0) return u;
    if (t === 1) return v;
    return {
      x: u.x + t * (v.x - u.x),
      y: u.y + t * (v.y - u.y),
      z: u.z + t * (v.z - u.z)
    };
  }
  Vec32.lerp = lerp;
  function slerp(u, v, t) {
    const cost = dot(u, v);
    const theta = Math.acos(cost);
    const sint = Math.sqrt(1 - cost * cost);
    const tu = Math.sin((1 - t) * theta) / sint;
    const tv = Math.sin(t * theta) / sint;
    return add(mul(u, tu), mul(v, tv));
  }
  Vec32.slerp = slerp;
  function rotate(v, k, t) {
    const cost = Math.cos(t), sint = Math.sin(t);
    const par = mul(k, dot(v, k)), per = sub(v, par), kxv = cross(k, v);
    return add(par, add(mul(per, cost), mul(kxv, sint)));
  }
  Vec32.rotate = rotate;
})(Vec3 || (Vec3 = {}));
var Mat3;
((Mat32) => {
  Mat32.Identity = {
    ux: 1,
    vx: 0,
    wx: 0,
    uy: 0,
    vy: 1,
    wy: 0,
    uz: 0,
    vz: 0,
    wz: 1
  };
  function isMatrix3(m) {
    return typeof m === "object" && "ux" in m && "vx" in m && "wx" in m && "uy" in m && "vy" in m && "wy" in m && "uz" in m && "vz" in m && "wz" in m;
  }
  Mat32.isMatrix3 = isMatrix3;
  function from(u, v, w) {
    return {
      ux: u.x,
      vx: v.x,
      wx: w.x,
      uy: u.y,
      vy: v.y,
      wy: w.y,
      uz: u.z,
      vz: v.z,
      wz: w.z
    };
  }
  Mat32.from = from;
  function col1(m) {
    return {
      x: m.ux,
      y: m.uy,
      z: m.uz
    };
  }
  Mat32.col1 = col1;
  function col2(m) {
    return {
      x: m.vx,
      y: m.vy,
      z: m.vz
    };
  }
  Mat32.col2 = col2;
  function col3(m) {
    return {
      x: m.wx,
      y: m.wy,
      z: m.wz
    };
  }
  Mat32.col3 = col3;
  function row1(m) {
    return {
      x: m.ux,
      y: m.vx,
      z: m.wx
    };
  }
  Mat32.row1 = row1;
  function row2(m) {
    return {
      x: m.uy,
      y: m.vy,
      z: m.wy
    };
  }
  Mat32.row2 = row2;
  function row3(m) {
    return {
      x: m.uz,
      y: m.vz,
      z: m.wz
    };
  }
  Mat32.row3 = row3;
  function transpose(m) {
    return {
      ux: m.ux,
      vx: m.uy,
      wx: m.uz,
      uy: m.vx,
      vy: m.vy,
      wy: m.vz,
      uz: m.wx,
      vz: m.wy,
      wz: m.wz
    };
  }
  Mat32.transpose = transpose;
  function mul(m, t) {
    if (isMatrix3(t)) return {
      ux: Vec3.dot(row1(m), col1(t)),
      vx: Vec3.dot(row1(m), col2(t)),
      wx: Vec3.dot(row1(m), col3(t)),
      uy: Vec3.dot(row2(m), col1(t)),
      vy: Vec3.dot(row2(m), col2(t)),
      wy: Vec3.dot(row2(m), col3(t)),
      uz: Vec3.dot(row3(m), col1(t)),
      vz: Vec3.dot(row3(m), col2(t)),
      wz: Vec3.dot(row3(m), col3(t))
    };
    else if (Vec3.isVector3(t)) return {
      x: Vec3.dot(row1(m), t),
      y: Vec3.dot(row2(m), t),
      z: Vec3.dot(row3(m), t)
    };
    else return {
      ux: m.ux * t,
      vx: m.vx * t,
      wx: m.wx * t,
      uy: m.uy * t,
      vy: m.vy * t,
      wy: m.wy * t,
      uz: m.uz * t,
      vz: m.vz * t,
      wz: m.wz * t
    };
  }
  Mat32.mul = mul;
  function trace(m) {
    return m.ux + m.vy + m.wz;
  }
  Mat32.trace = trace;
  function determinant(m) {
    return m.ux * m.vy * m.wz + m.uy * m.vz * m.wx + m.uz * m.vx * m.wy - m.wx * m.vy * m.uz - m.wy * m.vz * m.ux - m.wz * m.vx * m.uy;
  }
  Mat32.determinant = determinant;
  function cofactor(m) {
    return {
      ux: m.vy * m.wz - m.wy * m.vz,
      vx: m.wy * m.uz - m.uy * m.wz,
      wx: m.uy * m.vz - m.vy * m.uz,
      uy: m.wx * m.vz - m.vx * m.wz,
      vy: m.ux * m.wz - m.wx * m.uz,
      wy: m.vx * m.uz - m.ux * m.vz,
      uz: m.vx * m.wy - m.wx * m.vy,
      vz: m.wx * m.uy - m.ux * m.wy,
      wz: m.ux * m.vy - m.vx * m.uy
    };
  }
  Mat32.cofactor = cofactor;
  function adjugate(m) {
    return {
      ux: m.vy * m.wz - m.wy * m.vz,
      vx: m.wx * m.vz - m.vx * m.wz,
      wx: m.vx * m.wy - m.wx * m.vy,
      uy: m.wy * m.uz - m.uy * m.wz,
      vy: m.ux * m.wz - m.wx * m.uz,
      wy: m.wx * m.uy - m.ux * m.wy,
      uz: m.uy * m.vz - m.vy * m.uz,
      vz: m.vx * m.uz - m.ux * m.vz,
      wz: m.ux * m.vy - m.vx * m.uy
    };
  }
  Mat32.adjugate = adjugate;
  function inverse(m) {
    const det = determinant(m);
    if (det === 0) throw new Error("Matrix is not invertible.");
    return mul(adjugate(m), 1 / det);
  }
  Mat32.inverse = inverse;
  function buildTNB(n) {
    const u = Math.abs(n.y) === 1 ? Vec3.West : Vec3.normalize(Vec3.from(n.z, 0, -n.x));
    const w = Vec3.cross(n, u);
    return from(u, n, w);
  }
  Mat32.buildTNB = buildTNB;
})(Mat3 || (Mat3 = {}));

// src/util.ts
import { Direction as Direction2 } from "@minecraft/server";
var FENCE_TAG = "chroma_tech:fence_connect";
var LIGHT_STRIP_TAG = "chroma_tech:wire_connect_light_strip";
function stringDirectionToDirection(d) {
  switch (d) {
    case "up" /* Up */:
      return Direction2.Up;
    case "down" /* Down */:
      return Direction2.Down;
    case "north" /* North */:
      return Direction2.North;
    case "south" /* South */:
      return Direction2.South;
    case "east" /* East */:
      return Direction2.East;
    case "west" /* West */:
      return Direction2.West;
  }
  throw new Error(`${d} is not a StringDirection.`);
}
function stringToVec(d) {
  return Vec3.from(stringDirectionToDirection(d));
}
function vecToString(v) {
  return Vec3.toDirection(v).toLowerCase();
}

// src/components/doorComponent.ts
var doorComponent = {
  onPlace: ({ block }) => {
    var _a, _b;
    const { permutation } = block;
    const states = permutation.getAllStates();
    if (states["chroma_tech:top"]) return;
    const normal = stringToVec(states["minecraft:cardinal_direction"]);
    const tnb = Mat3.buildTNB(normal);
    if ((_a = block.offset(Mat3.col1(tnb))) == null ? void 0 : _a.typeId.endsWith("door"))
      block.setPermutation(permutation.withState("chroma_tech:flipped", true));
    (_b = block.above()) == null ? void 0 : _b.setPermutation(permutation.withState("chroma_tech:top", true));
  },
  onPlayerInteract: (event) => {
    var _a, _b;
    const { block, dimension } = event, { permutation } = block;
    const open = !permutation.getState("chroma_tech:open");
    block.setPermutation(permutation.withState("chroma_tech:open", open));
    if (permutation.getState("chroma_tech:top"))
      (_a = block.below()) == null ? void 0 : _a.setPermutation(permutation.withState("chroma_tech:top", false));
    else (_b = block.above()) == null ? void 0 : _b.setPermutation(permutation.withState("chroma_tech:top", true));
    dimension.playSound(open ? "open.iron_door" : "close.iron_door", block.center());
  },
  beforeOnPlayerPlace: (event) => {
    var _a;
    event.cancel = !((_a = event.block.above()) == null ? void 0 : _a.isAir);
  },
  onPlayerDestroy: (event) => breakDoor(event.block, event.destroyedBlockPermutation)
};
function breakDoor(block, permutation) {
  var _a, _b;
  if (permutation.getState("chroma_tech:top"))
    (_a = block.below()) == null ? void 0 : _a.setType("minecraft:air");
  else (_b = block.above()) == null ? void 0 : _b.setType("minecraft:air");
}
world.afterEvents.blockExplode.subscribe((event) => {
  if (!event.explodedBlockPermutation.hasTag("door")) return;
  breakDoor(event.block, event.explodedBlockPermutation);
});

// src/components/fenceComponent.ts
import { world as world2 } from "@minecraft/server";
var fenceComponent = {
  onPlace: (event) => alterFenceBlock(event.block, event.block.permutation, true),
  onPlayerDestroy: (event) => alterFenceBlock(event.block, event.destroyedBlockPermutation, false)
};
function alterFenceBlock(block, permutation, placed) {
  const block_n = block.north();
  const block_s = block.south();
  const block_e = block.east();
  const block_w = block.west();
  const block_a = block.above();
  const block_b = block.below();
  if (!(block_n == null ? void 0 : block_n.hasTag(LIGHT_STRIP_TAG)) && !(block_n == null ? void 0 : block_n.isAir) && !(block_n == null ? void 0 : block_n.isLiquid)) {
    if (block_n == null ? void 0 : block_n.hasTag(FENCE_TAG))
      block_n == null ? void 0 : block_n.setPermutation(block_n == null ? void 0 : block_n.permutation.withState("chroma_tech:south", placed));
    if (block_n == null ? void 0 : block_n.hasTag("fence_gate_connect")) {
      const direction = block_n == null ? void 0 : block_n.permutation.getState("minecraft:cardinal_direction");
      if (direction == "east" || direction == "west")
        permutation = permutation.withState("chroma_tech:north", placed);
    } else permutation = permutation.withState("chroma_tech:north", placed);
  }
  if (!(block_s == null ? void 0 : block_s.hasTag(LIGHT_STRIP_TAG)) && !(block_s == null ? void 0 : block_s.isAir) && !(block_s == null ? void 0 : block_s.isLiquid)) {
    if (block_s == null ? void 0 : block_s.hasTag(FENCE_TAG))
      block_s == null ? void 0 : block_s.setPermutation(block_s == null ? void 0 : block_s.permutation.withState("chroma_tech:north", placed));
    if (block_s == null ? void 0 : block_s.hasTag("fence_gate_connect")) {
      const direction = block_s == null ? void 0 : block_s.permutation.getState("minecraft:cardinal_direction");
      if (direction == "east" || direction == "west")
        permutation = permutation.withState("chroma_tech:south", placed);
    } else permutation = permutation.withState("chroma_tech:south", placed);
  }
  if (!(block_e == null ? void 0 : block_e.hasTag(LIGHT_STRIP_TAG)) && !(block_e == null ? void 0 : block_e.isAir) && !(block_e == null ? void 0 : block_e.isLiquid)) {
    if (block_e == null ? void 0 : block_e.hasTag(FENCE_TAG))
      block_e == null ? void 0 : block_e.setPermutation(block_e == null ? void 0 : block_e.permutation.withState("chroma_tech:west", placed));
    if (block_e == null ? void 0 : block_e.hasTag("fence_gate_connect")) {
      const direction = block_e == null ? void 0 : block_e.permutation.getState("minecraft:cardinal_direction");
      if (direction == "north" || direction == "south")
        permutation = permutation.withState("chroma_tech:east", placed);
    } else permutation = permutation.withState("chroma_tech:east", placed);
  }
  if (!(block_w == null ? void 0 : block_w.hasTag(LIGHT_STRIP_TAG)) && !(block_w == null ? void 0 : block_w.isAir) && !(block_w == null ? void 0 : block_w.isLiquid)) {
    if (block_w == null ? void 0 : block_w.hasTag(FENCE_TAG))
      block_w == null ? void 0 : block_w.setPermutation(block_w == null ? void 0 : block_w.permutation.withState("chroma_tech:east", placed));
    if (block_w == null ? void 0 : block_w.hasTag("fence_gate_connect")) {
      const direction = block_w == null ? void 0 : block_w.permutation.getState("minecraft:cardinal_direction");
      if (direction == "north" || direction == "south")
        permutation = permutation.withState("chroma_tech:west", placed);
    } else permutation = permutation.withState("chroma_tech:west", placed);
  }
  if (!(block_a == null ? void 0 : block_a.hasTag(LIGHT_STRIP_TAG)) && (block_a == null ? void 0 : block_a.hasTag(FENCE_TAG))) {
    permutation = permutation.withState("chroma_tech:above", placed);
    block_a == null ? void 0 : block_a.setPermutation(block_a == null ? void 0 : block_a.permutation.withState("chroma_tech:below", placed));
  }
  if (!(block_b == null ? void 0 : block_b.hasTag(LIGHT_STRIP_TAG)) && (block_b == null ? void 0 : block_b.hasTag(FENCE_TAG))) {
    permutation = permutation.withState("chroma_tech:below", placed);
    block_b == null ? void 0 : block_b.setPermutation(block_b == null ? void 0 : block_b.permutation.withState("chroma_tech:above", placed));
  }
  const alternate = Vec3.dot(block.location, Vec3.sign(block.location)) % 2 == 1;
  if (placed) block.setPermutation(permutation.withState("chroma_tech:alternate", alternate));
}
world2.afterEvents.playerBreakBlock.subscribe((event) => alterBlock(event.block, false));
world2.afterEvents.playerPlaceBlock.subscribe((event) => alterBlock(event.block, true));
function alterBlock(block, placed) {
  if (block.hasTag(FENCE_TAG) || block.hasTag(LIGHT_STRIP_TAG)) return;
  const block_n = block.north();
  const block_s = block.south();
  const block_e = block.east();
  const block_w = block.west();
  if (block_n == null ? void 0 : block_n.hasTag(FENCE_TAG))
    block_n == null ? void 0 : block_n.setPermutation(block_n == null ? void 0 : block_n.permutation.withState("chroma_tech:south", placed));
  if (block_s == null ? void 0 : block_s.hasTag(FENCE_TAG))
    block_s == null ? void 0 : block_s.setPermutation(block_s == null ? void 0 : block_s.permutation.withState("chroma_tech:north", placed));
  if (block_e == null ? void 0 : block_e.hasTag(FENCE_TAG))
    block_e == null ? void 0 : block_e.setPermutation(block_e == null ? void 0 : block_e.permutation.withState("chroma_tech:west", placed));
  if (block_w == null ? void 0 : block_w.hasTag(FENCE_TAG))
    block_w == null ? void 0 : block_w.setPermutation(block_w == null ? void 0 : block_w.permutation.withState("chroma_tech:east", placed));
}

// src/components/trapdoorComponent.ts
var trapdoorComponent = {
  onPlayerInteract: ({ block }) => {
    const { dimension, permutation } = block;
    const open = permutation.getState("chroma_tech:open");
    block.setPermutation(permutation.withState("chroma_tech:open", !open));
    dimension.playSound(open ? "close.iron_trapdoor" : "open.iron_trapdoor", block.center());
  }
};

// src/components/fenceGateComponent.ts
var fenceGateComponent = {
  onPlace: (event) => alterFenceGateBlock(event.block, event.block.permutation, true),
  onPlayerDestroy: (event) => alterFenceGateBlock(event.block, event.destroyedBlockPermutation, false),
  onPlayerInteract: toggleFenceGateBlock
};
function alterFenceGateBlock(block, permutation, placed) {
  const normal = stringToVec(permutation.getState("minecraft:cardinal_direction"));
  const tnb = Mat3.buildTNB(normal), tangent = Mat3.col1(tnb);
  const block_l = block.offset(tangent);
  const block_r = block.offset(Vec3.neg(tangent));
  if (block_l == null ? void 0 : block_l.hasTag("fence_connect")) {
    const dir = vecToString(Vec3.neg(tangent));
    block_l == null ? void 0 : block_l.setPermutation(block_l == null ? void 0 : block_l.permutation.withState(`chroma_tech:${dir}`, placed));
  }
  if (block_r == null ? void 0 : block_r.hasTag("fence_connect")) {
    const dir = vecToString(tangent);
    block_r == null ? void 0 : block_r.setPermutation(block_r == null ? void 0 : block_r.permutation.withState(`chroma_tech:${dir}`, placed));
  }
  if (placed) block.setPermutation(permutation);
}
function toggleFenceGateBlock(event) {
  const { block, player } = event, { permutation, dimension } = block;
  let open = block.permutation.getState("chroma_tech:open");
  if (open != 0) {
    open = 0;
    dimension.playSound("close.iron_trapdoor", block.center());
  } else {
    const direction = stringToVec(permutation.getState("minecraft:cardinal_direction"));
    open = Vec3.dot(direction, player == null ? void 0 : player.getViewDirection()) >= 0 ? 1 : 2;
    dimension.playSound("open.iron_trapdoor", block.center());
  }
  block.setPermutation(permutation.withState("chroma_tech:open", open));
}

// src/components/wireConnectableComponent.ts
import { system, world as world3 } from "@minecraft/server";
var wireConnectableComponent = {
  onPlace: (event) => alterWireConnectionBlock(event.block, event.block.permutation, true),
  onPlayerDestroy: (event) => alterWireConnectionBlock(event.block, event.destroyedBlockPermutation, false)
};
function alterWireConnectionBlock(block, permutation, placed) {
  const normal = stringToVec(permutation.getState("minecraft:block_face"));
  const tnb = Mat3.buildTNB(normal), tangent = Mat3.col1(tnb), binormal = Mat3.col3(tnb);
  const block_n = block.offset(Vec3.neg(binormal));
  const block_s = block.offset(binormal);
  const block_e = block.offset(tangent);
  const block_w = block.offset(Vec3.neg(tangent));
  const block_a = block.offset(normal);
  const block_na = block_n == null ? void 0 : block_n.offset(normal);
  const block_sa = block_s == null ? void 0 : block_s.offset(normal);
  const block_ea = block_e == null ? void 0 : block_e.offset(normal);
  const block_wa = block_w == null ? void 0 : block_w.offset(normal);
  const block_nb = block_n == null ? void 0 : block_n.offset(Vec3.neg(normal));
  const block_sb = block_s == null ? void 0 : block_s.offset(Vec3.neg(normal));
  const block_eb = block_e == null ? void 0 : block_e.offset(Vec3.neg(normal));
  const block_wb = block_w == null ? void 0 : block_w.offset(Vec3.neg(normal));
  if (block_n == null ? void 0 : block_n.hasTag(LIGHT_STRIP_TAG)) {
    const block_n_normal = stringToVec(block_n == null ? void 0 : block_n.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_n_normal)) {
      permutation = permutation.withState("chroma_tech:north", placed);
      block_n == null ? void 0 : block_n.setPermutation(block_n == null ? void 0 : block_n.permutation.withState("chroma_tech:south", placed));
    }
    if (Vec3.equal(binormal, block_n_normal)) {
      permutation = permutation.withState("chroma_tech:north", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_n_normal)), Vec3.neg(normal)));
      block_n == null ? void 0 : block_n.setPermutation(block_n == null ? void 0 : block_n.permutation.withState(`chroma_tech:above_${direction}`, placed));
    }
  }
  if (block_s == null ? void 0 : block_s.hasTag(LIGHT_STRIP_TAG)) {
    const block_s_normal = stringToVec(block_s == null ? void 0 : block_s.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_s_normal)) {
      permutation = permutation.withState("chroma_tech:south", placed);
      block_s == null ? void 0 : block_s.setPermutation(block_s == null ? void 0 : block_s.permutation.withState("chroma_tech:north", placed));
    }
    if (Vec3.equal(Vec3.neg(binormal), block_s_normal)) {
      permutation = permutation.withState("chroma_tech:south", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_s_normal)), Vec3.neg(normal)));
      block_s == null ? void 0 : block_s.setPermutation(block_s == null ? void 0 : block_s.permutation.withState(`chroma_tech:above_${direction}`, placed));
    }
  }
  if (block_e == null ? void 0 : block_e.hasTag(LIGHT_STRIP_TAG)) {
    const block_e_normal = stringToVec(block_e == null ? void 0 : block_e.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_e_normal)) {
      permutation = permutation.withState("chroma_tech:east", placed);
      block_e == null ? void 0 : block_e.setPermutation(block_e == null ? void 0 : block_e.permutation.withState("chroma_tech:west", placed));
    }
    if (Vec3.equal(Vec3.neg(tangent), block_e_normal)) {
      permutation = permutation.withState("chroma_tech:east", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_e_normal)), Vec3.neg(normal)));
      block_e == null ? void 0 : block_e.setPermutation(block_e == null ? void 0 : block_e.permutation.withState(`chroma_tech:above_${direction}`, placed));
    }
  }
  if (block_w == null ? void 0 : block_w.hasTag(LIGHT_STRIP_TAG)) {
    const block_w_normal = stringToVec(block_w == null ? void 0 : block_w.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_w_normal)) {
      permutation = permutation.withState("chroma_tech:west", placed);
      block_w == null ? void 0 : block_w.setPermutation(block_w == null ? void 0 : block_w.permutation.withState("chroma_tech:east", placed));
    }
    if (Vec3.equal(tangent, block_w_normal)) {
      permutation = permutation.withState("chroma_tech:west", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_w_normal)), Vec3.neg(normal)));
      block_w == null ? void 0 : block_w.setPermutation(block_w == null ? void 0 : block_w.permutation.withState(`chroma_tech:above_${direction}`, placed));
    }
  }
  if (block_nb == null ? void 0 : block_nb.hasTag(LIGHT_STRIP_TAG)) {
    const block_nb_normal = stringToVec(block_nb == null ? void 0 : block_nb.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_nb_normal)) {
      permutation = permutation.withState("chroma_tech:north", placed);
      block_nb == null ? void 0 : block_nb.setPermutation(block_nb == null ? void 0 : block_nb.permutation.withState("chroma_tech:above_south", placed));
    }
    if ((block_n == null ? void 0 : block_n.isAir) && Vec3.equal(Vec3.neg(binormal), block_nb_normal)) {
      permutation = permutation.withState("chroma_tech:north", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_nb_normal)), normal));
      block_nb == null ? void 0 : block_nb.setPermutation(block_nb == null ? void 0 : block_nb.permutation.withState(`chroma_tech:${direction}`, placed));
    }
  }
  if (block_sb == null ? void 0 : block_sb.hasTag(LIGHT_STRIP_TAG)) {
    const normal2 = stringToVec(block_sb == null ? void 0 : block_sb.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal2, normal2)) {
      permutation = permutation.withState("chroma_tech:south", placed);
      block_sb == null ? void 0 : block_sb.setPermutation(block_sb == null ? void 0 : block_sb.permutation.withState("chroma_tech:above_north", placed));
    }
    if ((block_s == null ? void 0 : block_s.isAir) && Vec3.equal(binormal, normal2)) {
      permutation = permutation.withState("chroma_tech:south", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(normal2)), normal2));
      block_sb == null ? void 0 : block_sb.setPermutation(block_sb == null ? void 0 : block_sb.permutation.withState(`chroma_tech:${direction}`, placed));
    }
  }
  if (block_eb == null ? void 0 : block_eb.hasTag(LIGHT_STRIP_TAG)) {
    const normal2 = stringToVec(block_eb == null ? void 0 : block_eb.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal2, normal2)) {
      permutation = permutation.withState("chroma_tech:east", placed);
      block_eb == null ? void 0 : block_eb.setPermutation(block_eb == null ? void 0 : block_eb.permutation.withState("chroma_tech:above_west", placed));
    }
    if ((block_e == null ? void 0 : block_e.isAir) && Vec3.equal(tangent, normal2)) {
      permutation = permutation.withState("chroma_tech:east", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(normal2)), normal2));
      block_eb == null ? void 0 : block_eb.setPermutation(block_eb == null ? void 0 : block_eb.permutation.withState(`chroma_tech:${direction}`, placed));
    }
  }
  if (block_wb == null ? void 0 : block_wb.hasTag(LIGHT_STRIP_TAG)) {
    const normal2 = stringToVec(block_wb == null ? void 0 : block_wb.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal2, normal2)) {
      permutation = permutation.withState("chroma_tech:west", placed);
      block_wb == null ? void 0 : block_wb.setPermutation(block_wb == null ? void 0 : block_wb.permutation.withState("chroma_tech:above_east", placed));
    }
    if ((block_w == null ? void 0 : block_w.isAir) && Vec3.equal(Vec3.neg(tangent), normal2)) {
      permutation = permutation.withState("chroma_tech:west", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(normal2)), normal2));
      block_wb == null ? void 0 : block_wb.setPermutation(block_wb == null ? void 0 : block_wb.permutation.withState(`chroma_tech:${direction}`, placed));
    }
  }
  if (block_na == null ? void 0 : block_na.hasTag(LIGHT_STRIP_TAG)) {
    const block_na_normal = stringToVec(block_na == null ? void 0 : block_na.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_na_normal)) {
      permutation = permutation.withState("chroma_tech:above_north", placed);
      block_na == null ? void 0 : block_na.setPermutation(block_na == null ? void 0 : block_na.permutation.withState("chroma_tech:south", placed));
    }
  }
  if (block_sa == null ? void 0 : block_sa.hasTag(LIGHT_STRIP_TAG)) {
    const block_sa_normal = stringToVec(block_sa == null ? void 0 : block_sa.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_sa_normal)) {
      permutation = permutation.withState("chroma_tech:above_south", placed);
      block_sa == null ? void 0 : block_sa.setPermutation(block_sa == null ? void 0 : block_sa.permutation.withState("chroma_tech:north", placed));
    }
  }
  if (block_ea == null ? void 0 : block_ea.hasTag(LIGHT_STRIP_TAG)) {
    const block_ea_normal = stringToVec(block_ea == null ? void 0 : block_ea.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_ea_normal)) {
      permutation = permutation.withState("chroma_tech:above_east", placed);
      block_ea == null ? void 0 : block_ea.setPermutation(block_ea == null ? void 0 : block_ea.permutation.withState("chroma_tech:west", placed));
    }
  }
  if (block_wa == null ? void 0 : block_wa.hasTag(LIGHT_STRIP_TAG)) {
    const block_wa_normal = stringToVec(block_wa == null ? void 0 : block_wa.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(normal, block_wa_normal)) {
      permutation = permutation.withState("chroma_tech:above_west", placed);
      block_wa == null ? void 0 : block_wa.setPermutation(block_wa == null ? void 0 : block_wa.permutation.withState("chroma_tech:east", placed));
    }
  }
  if (block_a == null ? void 0 : block_a.hasTag(LIGHT_STRIP_TAG)) {
    const block_a_normal = stringToVec(block_a == null ? void 0 : block_a.permutation.getState("minecraft:block_face"));
    if (Vec3.equal(binormal, block_a_normal)) {
      permutation = permutation.withState("chroma_tech:above_north", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
      block_a == null ? void 0 : block_a.setPermutation(block_a == null ? void 0 : block_a.permutation.withState(`chroma_tech:${direction}`, placed));
    }
    if (Vec3.equal(Vec3.neg(binormal), block_a_normal)) {
      permutation = permutation.withState("chroma_tech:above_south", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
      block_a == null ? void 0 : block_a.setPermutation(block_a == null ? void 0 : block_a.permutation.withState(`chroma_tech:${direction}`, placed));
    }
    if (Vec3.equal(Vec3.neg(tangent), block_a_normal)) {
      permutation = permutation.withState("chroma_tech:above_east", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
      block_a == null ? void 0 : block_a.setPermutation(block_a == null ? void 0 : block_a.permutation.withState(`chroma_tech:${direction}`, placed));
    }
    if (Vec3.equal(tangent, block_a_normal)) {
      permutation = permutation.withState("chroma_tech:above_west", placed);
      const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
      block_a == null ? void 0 : block_a.setPermutation(block_a == null ? void 0 : block_a.permutation.withState(`chroma_tech:${direction}`, placed));
    }
  }
  permutation = permutation.withState("chroma_tech:placed", placed);
  if (placed) block.setPermutation(permutation);
}
world3.afterEvents.blockExplode.subscribe((event) => {
  if (event.explodedBlockPermutation.hasTag(LIGHT_STRIP_TAG))
    alterWireConnectionBlock(event.block, event.explodedBlockPermutation, false);
});
world3.beforeEvents.playerBreakBlock.subscribe(({ block }) => {
  if (!block.typeId.startsWith("minecraft")) return;
  const block_n = block.north();
  const block_s = block.south();
  const block_e = block.east();
  const block_w = block.west();
  const block_a = block.above();
  const block_b = block.below();
  if (block_n == null ? void 0 : block_n.hasTag(LIGHT_STRIP_TAG)) {
    const permutation = block_n == null ? void 0 : block_n.permutation;
    if (permutation.getState("minecraft:block_face") == "north")
      system.run(() => alterWireConnectionBlock(block_n, permutation, false));
  }
  if (block_s == null ? void 0 : block_s.hasTag(LIGHT_STRIP_TAG)) {
    const permutation = block_s == null ? void 0 : block_s.permutation;
    if (permutation.getState("minecraft:block_face") == "south")
      system.run(() => alterWireConnectionBlock(block_s, permutation, false));
  }
  if (block_e == null ? void 0 : block_e.hasTag(LIGHT_STRIP_TAG)) {
    const permutation = block_e == null ? void 0 : block_e.permutation;
    if (permutation.getState("minecraft:block_face") == "east")
      system.run(() => alterWireConnectionBlock(block_e, permutation, false));
  }
  if (block_w == null ? void 0 : block_w.hasTag(LIGHT_STRIP_TAG)) {
    const permutation = block_w == null ? void 0 : block_w.permutation;
    if (permutation.getState("minecraft:block_face") == "west")
      system.run(() => alterWireConnectionBlock(block_w, permutation, false));
  }
  if (block_a == null ? void 0 : block_a.hasTag(LIGHT_STRIP_TAG)) {
    const permutation = block_a == null ? void 0 : block_a.permutation;
    if (permutation.getState("minecraft:block_face") == "up")
      system.run(() => alterWireConnectionBlock(block_a, permutation, false));
  }
  if (block_b == null ? void 0 : block_b.hasTag(LIGHT_STRIP_TAG)) {
    const permutation = block_b == null ? void 0 : block_b.permutation;
    if (permutation.getState("minecraft:block_face") == "down")
      system.run(() => alterWireConnectionBlock(block_b, permutation, false));
  }
});

// src/components/preventUnderwaterPlacementComponent.ts
var preventUnderwaterPlacementComponent = {
  beforeOnPlayerPlace: (event) => {
    event.cancel = event.block.isLiquid;
  }
};

// src/main.ts
world4.beforeEvents.worldInitialize.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("chroma_tech:door", doorComponent);
  blockComponentRegistry.registerCustomComponent("chroma_tech:fence", fenceComponent);
  blockComponentRegistry.registerCustomComponent("chroma_tech:trapdoor", trapdoorComponent);
  blockComponentRegistry.registerCustomComponent("chroma_tech:fence_gate", fenceGateComponent);
  blockComponentRegistry.registerCustomComponent("chroma_tech:connectable_wire", wireConnectableComponent);
  blockComponentRegistry.registerCustomComponent("chroma_tech:prevent_underwater_placement", preventUnderwaterPlacementComponent);
});
//# sourceMappingURL=main.js.map