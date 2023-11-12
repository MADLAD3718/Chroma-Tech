import { Block } from "@minecraft/server";
import { popLightStrip } from "./light_strip";
import { popLightStripDoor } from "./light_strip_door";
import { hasCenter, placeCollider } from "./light_strip_fence";
import { placeColliderOnGate } from "./light_strip_fence_gate";
import { Directions, add, blockFaceToDirection, directionToBlockFace, equal, neg } from "./vectors";
import { Basis, inverse } from "./basis";

/**
 * Handles the addition or removal of a solid block.
 * @param {Block} block 
 * @param {Boolean} placed 
 */
export function alterSolidBlock(block, placed) {
    const {dimension, location} = block;
    
    const block_n = block.north();
    if (block_n.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_n.permutation.getState("minecraft:block_face"));
        if (!placed && equal(normal, Directions.North)) popLightStrip(block_n);
        else if (Math.abs(normal.z) != 1) {
            const adjacent_block = dimension.getBlock(add(block_n.location, normal));
            if (adjacent_block.hasTag("light_strip")) {
                const adjacent_normal = blockFaceToDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                if (equal(adjacent_normal, Directions.North)) {
                    const extend_dir = directionToBlockFace(inverse(new Basis(normal)).localize(Directions.South));
                    block_n.setPermutation(block_n.permutation.withState("chroma_tech:extend_" + extend_dir, placed));
                    const edge_dir = directionToBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                    adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, placed));
                }
            }
        }
    }
    else if (block_n.hasTag("light_strip_fence")) {
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:south", placed));
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:center", hasCenter(block_n)));
        placeCollider(block_n);
    }

    const block_s = block.south();
    if (block_s.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_s.permutation.getState("minecraft:block_face"));
        if (!placed && equal(normal, Directions.South)) popLightStrip(block_s);
        else if (Math.abs(normal.z) != 1) {
            const adjacent_block = dimension.getBlock(add(block_s.location, normal));
            if (adjacent_block.hasTag("light_strip")) {
                const adjacent_normal = blockFaceToDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                if (equal(adjacent_normal, Directions.South)) {
                    const extend_dir = directionToBlockFace(inverse(new Basis(normal)).localize(Directions.North));
                    block_s.setPermutation(block_s.permutation.withState("chroma_tech:extend_" + extend_dir, placed));
                    const edge_dir = directionToBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                    adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, placed));
                }
            }
        }
    }
    else if (block_s.hasTag("light_strip_fence")) {
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:north", placed));
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:center", hasCenter(block_s)));
        placeCollider(block_s);
    }

    const block_e = block.east();
    if (block_e.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_e.permutation.getState("minecraft:block_face"));
        if (!placed && equal(normal, Directions.West)) popLightStrip(block_e);
        else if (Math.abs(normal.x) != 1) {
            const adjacent_block = dimension.getBlock(add(block_e.location, normal));
            if (adjacent_block.hasTag("light_strip")) {
                const adjacent_normal = blockFaceToDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                if (equal(adjacent_normal, Directions.East)) {
                    const extend_dir = directionToBlockFace(inverse(new Basis(normal)).localize(Directions.West));
                    block_e.setPermutation(block_e.permutation.withState("chroma_tech:extend_" + extend_dir, placed));
                    const edge_dir = directionToBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                    adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, placed));
                }
            }
        }
    }
    else if (block_e.hasTag("light_strip_fence")) {
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:west", placed));
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
        placeCollider(block_e);
    }

    const block_w = block.west();
    if (block_w.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_w.permutation.getState("minecraft:block_face"));
        if (!placed && equal(normal, Directions.East)) popLightStrip(block_w);
        else if (Math.abs(normal.x) != 1) {
            const adjacent_block = dimension.getBlock(add(block_w.location, normal));
            if (adjacent_block.hasTag("light_strip")) {
                const adjacent_normal = blockFaceToDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                if (equal(adjacent_normal, Directions.West)) {
                    const extend_dir = directionToBlockFace(inverse(new Basis(normal)).localize(Directions.East));
                    block_w.setPermutation(block_w.permutation.withState("chroma_tech:extend_" + extend_dir, placed));
                    const edge_dir = directionToBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                    adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, placed));
                }
            }
        }
    }
    else if (block_w.hasTag("light_strip_fence")) {
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:east", placed));
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
        placeCollider(block_w);
    }

    if (location.y < dimension.heightRange.max) {
        const block_a = block.above();
        if (block_a.hasTag("light_strip")) {
            const normal = blockFaceToDirection(block_a.permutation.getState("minecraft:block_face"));
            if (!placed && equal(normal, Directions.Up)) popLightStrip(block_a);
            else if (Math.abs(normal.y) != 1) {
                const adjacent_block = dimension.getBlock(add(block_a.location, normal));
                if (adjacent_block.hasTag("light_strip")) {
                    const adjacent_normal = blockFaceToDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                    if (equal(adjacent_normal, Directions.Up)) {
                        const extend_dir = directionToBlockFace(inverse(new Basis(normal)).localize(Directions.Down));
                        block_a.setPermutation(block_a.permutation.withState("chroma_tech:extend_" + extend_dir, placed));
                        const edge_dir = directionToBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                        adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, placed));
                    }
                }
            }
        }
        else if (block_a.hasTag("light_strip_door")) popLightStripDoor(block_a);
    }

    if (location.y > dimension.heightRange.min) {
        const block_b = block.below();
        if (block_b.hasTag("light_strip")) {
            const normal = blockFaceToDirection(block_b.permutation.getState("minecraft:block_face"));
            if (!placed && equal(normal, Directions.Down)) popLightStrip(block_b);
            else if (Math.abs(normal.y) != 1) {
                const adjacent_block = dimension.getBlock(add(block_b.location, normal));
                if (adjacent_block.hasTag("light_strip")) {
                    const adjacent_normal = blockFaceToDirection(adjacent_block.permutation.getState("minecraft:block_face"));
                    if (equal(adjacent_normal, Directions.Down)) {
                        const extend_dir = directionToBlockFace(inverse(new Basis(normal)).localize(Directions.Up));
                        block_b.setPermutation(block_b.permutation.withState("chroma_tech:extend_" + extend_dir, placed));
                        const edge_dir = directionToBlockFace(inverse(new Basis(adjacent_normal)).localize(neg(normal)));
                        adjacent_block.setPermutation(adjacent_block.permutation.withState("chroma_tech:edge_" + edge_dir, placed));
                    }
                }
            }
        }
        else if (!placed) {
            if (block_b.hasTag("light_strip_fence")) placeCollider(block_b);
            if (block_b.hasTag("light_strip_fence_gate") && block_b.permutation.getState("chroma_tech:opened") == 0) {
                const block_b_dir = block_b.permutation.getState("minecraft:cardinal_direction");
                placeColliderOnGate(block, block_b_dir);
            }
        }
    }
}