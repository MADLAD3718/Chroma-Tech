import { Block, system } from "@minecraft/server";
import { alterLightStrip, popLightStrip } from "./light_strip";
import { popLightStripDoor } from "./light_strip_door";
import { hasCenter, placeCollider } from "./light_strip_fence";
import { placeColliderOnGate } from "./light_strip_fence_gate";
import { Directions, add, toDirection, toBlockFace, equal, neg } from "./vectors";
import { Basis, inverse } from "./basis";

/**
 * Handles the alteration of a block.
 * @param {Block} block 
 */
export function alterBlock(block) {
    const {dimension, location} = block;
    
    const block_n = block.north();
    if (block_n.hasTag("light_strip")) {
        const permutation = block_n.permutation;
        const normal = toDirection(permutation.getState("minecraft:block_face"));
        system.run(() => {
            const support = block.getSupportedFaces();
            if (!support.north && equal(normal, Directions.North)) alterLightStrip(block_n, permutation, false);
            else if (Math.abs(normal.z) != 1) {
                const adjacent_block = dimension.getBlock(add(block_n.location, normal));
                if (adjacent_block.hasTag("light_strip")) {
                    const adjacent_normal = toDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                    if (equal(adjacent_normal, Directions.North)) {
                        const extend_dir = toBlockFace(inverse(new Basis(normal)).localize(Directions.South));
                        block_n.setPermutation(block_n.permutation.withState("chroma_tech:extend_" + extend_dir, support.north));
                        const edge_dir = toBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                        adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, support.north));
                    }
                }
            }
        });
    }
    else if (block_n.hasTag("light_strip_fence")) {
        system.run(() => {
            const support = block.getSupportedFaces();
            block_n.setPermutation(block_n.permutation.withState("chroma_tech:south", support.north));
            block_n.setPermutation(block_n.permutation.withState("chroma_tech:center", hasCenter(block_n)));
            placeCollider(block_n);
        });
    }

    const block_s = block.south();
    if (block_s.hasTag("light_strip")) {
        const permutation = block_s.permutation;
        const normal = toDirection(permutation.getState("minecraft:block_face"));
        system.run(() => {
            const support = block.getSupportedFaces();
            if (!support.south && equal(normal, Directions.South)) alterLightStrip(block_s, permutation, false);
            else if (Math.abs(normal.z) != 1) {
                const adjacent_block = dimension.getBlock(add(block_s.location, normal));
                if (adjacent_block.hasTag("light_strip")) {
                    const adjacent_normal = toDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                    if (equal(adjacent_normal, Directions.South)) {
                        const extend_dir = toBlockFace(inverse(new Basis(normal)).localize(Directions.North));
                        block_s.setPermutation(block_s.permutation.withState("chroma_tech:extend_" + extend_dir, support.south));
                        const edge_dir = toBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                        adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, support.south));
                    }
                }
            }

        });
    }
    else if (block_s.hasTag("light_strip_fence")) {
        system.run(() => {
            const support = block.getSupportedFaces();
            block_s.setPermutation(block_s.permutation.withState("chroma_tech:north", support.south));
            block_s.setPermutation(block_s.permutation.withState("chroma_tech:center", hasCenter(block_s)));
            placeCollider(block_s);
        });
    }

    const block_e = block.east();
    if (block_e.hasTag("light_strip")) {
        const permutation = block_e.permutation;
        const normal = toDirection(block_e.permutation.getState("minecraft:block_face"));
        system.run(() => {
            const support = block.getSupportedFaces();
            if (!support.east && equal(normal, Directions.East)) alterLightStrip(block_e, permutation, false);
            else if (Math.abs(normal.x) != 1) {
                const adjacent_block = dimension.getBlock(add(block_e.location, normal));
                if (adjacent_block.hasTag("light_strip")) {
                    const adjacent_normal = toDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                    if (equal(adjacent_normal, Directions.East)) {
                        const extend_dir = toBlockFace(inverse(new Basis(normal)).localize(Directions.West));
                        block_e.setPermutation(block_e.permutation.withState("chroma_tech:extend_" + extend_dir, support.east));
                        const edge_dir = toBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                        adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, support.east));
                    }
                }
            }
        });
    }
    else if (block_e.hasTag("light_strip_fence")) {
        system.run(() => {
            const support = block.getSupportedFaces();
            block_e.setPermutation(block_e.permutation.withState("chroma_tech:west", support.east));
            block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
            placeCollider(block_e);
        });
    }

    const block_w = block.west();
    if (block_w.hasTag("light_strip")) {
        const permutation = block_w.permutation;
        const normal = toDirection(block_w.permutation.getState("minecraft:block_face"));
        system.run(() => {
            const support = block.getSupportedFaces();
            if (!support.west && equal(normal, Directions.West)) alterLightStrip(block_w, permutation, false);
            else if (Math.abs(normal.x) != 1) {
                const adjacent_block = dimension.getBlock(add(block_w.location, normal));
                if (adjacent_block.hasTag("light_strip")) {
                    const adjacent_normal = toDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                    if (equal(adjacent_normal, Directions.West)) {
                        const extend_dir = toBlockFace(inverse(new Basis(normal)).localize(Directions.East));
                        block_w.setPermutation(block_w.permutation.withState("chroma_tech:extend_" + extend_dir, support.west));
                        const edge_dir = toBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                        adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, support.west));
                    }
                }
            }
        });
    }
    else if (block_w.hasTag("light_strip_fence")) {
        system.run(() => {
           const support = block.getSupportedFaces();
           block_w.setPermutation(block_w.permutation.withState("chroma_tech:east", support.west));
           block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
           placeCollider(block_w);
        });
    }

    if (location.y < dimension.heightRange.max) {
        const block_a = block.above();
        if (block_a.hasTag("light_strip")) {
            const permutation = block_a.permutation;
            const normal = toDirection(block_a.permutation.getState("minecraft:block_face"));
            system.run(() => {
                const support = block.getSupportedFaces();
                if (!support.up && equal(normal, Directions.Up)) alterLightStrip(block_a, permutation, false);
                else if (Math.abs(normal.y) != 1) {
                    const adjacent_block = dimension.getBlock(add(block_a.location, normal));
                    if (adjacent_block.hasTag("light_strip")) {
                        const adjacent_normal = toDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                        if (equal(adjacent_normal, Directions.Up)) {
                            const extend_dir = toBlockFace(inverse(new Basis(normal)).localize(Directions.Down));
                            block_a.setPermutation(block_a.permutation.withState("chroma_tech:extend_" + extend_dir, support.up));
                            const edge_dir = toBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                            adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, support.up));
                        }
                    }
                }
            });
        }
        else if (block_a.hasTag("light_strip_door")) popLightStripDoor(block_a);
    }

    if (location.y > dimension.heightRange.min) {
        const block_b = block.below();
        if (block_b.hasTag("light_strip")) {
            const permutation = block_b.permutation;
            const normal = toDirection(block_b.permutation.getState("minecraft:block_face"));
            system.run(() => {
                const support = block.getSupportedFaces();
                if (!support.down && equal(normal, Directions.Down)) alterLightStrip(block_b, permutation, false);
                else if (Math.abs(normal.y) != 1) {
                    const adjacent_block = dimension.getBlock(add(block_b.location, normal));
                    if (adjacent_block.hasTag("light_strip")) {
                        const adjacent_normal = toDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                        if (equal(adjacent_normal, Directions.Down)) {
                            const extend_dir = toBlockFace(inverse(new Basis(normal)).localize(Directions.Up));
                            block_b.setPermutation(block_b.permutation.withState("chroma_tech:extend_" + extend_dir, support.down));
                            const edge_dir = toBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                            adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, support.down));
                        }
                    }
                }
            });
        }
        else system.run(() => {
            const support = block.getSupportedFaces();
            if (!support.down) {
                if (block_b.hasTag("light_strip_fence")) placeCollider(block_b);
                if (block_b.hasTag("light_strip_fence_gate") && block_b.permutation.getState("chroma_tech:opened") == 0) {
                    const block_b_dir = block_b.permutation.getState("minecraft:cardinal_direction");
                    placeColliderOnGate(block, block_b_dir);
                }
            }
        });
    }
}