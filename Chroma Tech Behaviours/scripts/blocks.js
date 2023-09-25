import { Block, Vector } from "@minecraft/server";
import { popLightStrip } from "./light_strip";
import { rotateByBlockFace, toBlockFace } from "./util";
import { popLightStripDoor } from "./light_strip_door";
import { hasCenter, placeCollider } from "./light_strip_fence";
import { placeColliderOnGate } from "./light_strip_fence_gate";

/**
 * Handles the addition or removal of a solid block.
 * @param {Block} block 
 * @param {Boolean} placed 
 */
export function alterSolidBlock(block, placed) {
    const {dimension, location} = block;

    const block_a = dimension.getBlock(Vector.add(location, Vector.up));
    const block_b = dimension.getBlock(Vector.add(location, Vector.down));
    const block_n = dimension.getBlock(Vector.add(location, Vector.forward));
    const block_s = dimension.getBlock(Vector.add(location, Vector.back));
    const block_e = dimension.getBlock(Vector.add(location, Vector.left));
    const block_w = dimension.getBlock(Vector.add(location, Vector.right));

    if (block_a.hasTag("light_strip")) {
        const block_a_face = block_a.permutation.getState("minecraft:block_face");
        if (block_a_face == "up" && !placed) popLightStrip(block_a);
        else if (block_a_face != "up" && block_a_face != "down") {
            const block_a_dir = rotateByBlockFace(Vector.up, block_a_face);
            const c_block = dimension.getBlock(Vector.add(block_a.location, block_a_dir));
            if (c_block.hasTag("light_strip")) {
                const e_dir = toBlockFace(rotateByBlockFace(Vector.down, toBlockFace(block_a_dir)));
                block_a.setPermutation(block_a.permutation.withState("chroma_tech:extend_" + e_dir, placed));
                const c_dir = toBlockFace(rotateByBlockFace(Vector.multiply(block_a_dir, -1), "up"));
                c_block.setPermutation(c_block.permutation.withState("chroma_tech:edge_" + c_dir, placed));
            }
        }
    }
    else if (block_a.hasTag("light_strip_door")) popLightStripDoor(block_a);

    if (block_b.hasTag("light_strip")) {
        const block_b_face = block_b.permutation.getState("minecraft:block_face");
        if (block_b_face == "down" && !placed) popLightStrip(block_b);
        else if (block_b_face != "down" && block_b_face != "up") {
            const block_b_dir = rotateByBlockFace(Vector.up, block_b_face);
            const c_block = dimension.getBlock(Vector.add(block_b.location, block_b_dir));
            if (c_block.hasTag("light_strip")) {
                const e_dir = toBlockFace(rotateByBlockFace(Vector.up, toBlockFace(block_b_dir)));
                block_b.setPermutation(block_b.permutation.withState("chroma_tech:extend_" + e_dir, placed));
                const c_dir = toBlockFace(rotateByBlockFace(Vector.multiply(block_b_dir, -1), "down"));
                c_block.setPermutation(c_block.permutation.withState("chroma_tech:edge_" + c_dir, placed));
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

    if (block_n.hasTag("light_strip")) {
        const block_n_face = block_n.permutation.getState("minecraft:block_face");
        if (block_n_face == "south" && !placed) popLightStrip(block_n);
        else if (block_n_face != "north" && block_n_face != "south") {
            const block_n_dir = rotateByBlockFace(Vector.up, block_n_face);
            const c_block = dimension.getBlock(Vector.add(block_n.location, block_n_dir));
            if (c_block.hasTag("light_strip")) {
                const e_dir = toBlockFace(rotateByBlockFace(Vector.back, toBlockFace(block_n_dir)));
                block_n.setPermutation(block_n.permutation.withState("chroma_tech:extend_" + e_dir, placed));
                const c_dir = toBlockFace(rotateByBlockFace(Vector.multiply(block_n_dir, -1), "north"));
                c_block.setPermutation(c_block.permutation.withState("chroma_tech:edge_" + c_dir, placed));
            }
        }
    }
    else if (block_n.hasTag("light_strip_fence")) {
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:north", placed));
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:center", hasCenter(block_n)));
        placeCollider(block_n);
    }

    if (block_s.hasTag("light_strip")) {
        const block_s_face = block_s.permutation.getState("minecraft:block_face");
        if (block_s_face == "north" && !placed) popLightStrip(block_s);
        else if (block_s_face != "south" && block_s_face != "north") {
            const block_s_dir = rotateByBlockFace(Vector.up, block_s_face);
            const c_block = dimension.getBlock(Vector.add(block_s.location, block_s_dir));
            if (c_block.hasTag("light_strip")) {
                const e_dir = toBlockFace(rotateByBlockFace(Vector.forward, toBlockFace(block_s_dir)));
                block_s.setPermutation(block_s.permutation.withState("chroma_tech:extend_" + e_dir, placed));
                const c_dir = toBlockFace(rotateByBlockFace(Vector.multiply(block_s_dir, -1), "south"));
                c_block.setPermutation(c_block.permutation.withState("chroma_tech:edge_" + c_dir, placed));
            }
        }
    }
    else if (block_s.hasTag("light_strip_fence")) {
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:south", placed));
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:center", hasCenter(block_s)));
        placeCollider(block_s);
    }

    if (block_e.hasTag("light_strip")) {
        const block_e_face = block_e.permutation.getState("minecraft:block_face");
        if (block_e_face == "west" && !placed) popLightStrip(block_e);
        else if (block_e_face != "east" && block_e_face != "west") {
            const block_e_dir = rotateByBlockFace(Vector.up, block_e_face);
            const c_block = dimension.getBlock(Vector.add(block_e.location, block_e_dir));
            if (c_block.hasTag("light_strip")) {
                const e_dir = toBlockFace(rotateByBlockFace(Vector.right, toBlockFace(block_e_dir)));
                block_e.setPermutation(block_e.permutation.withState("chroma_tech:extend_" + e_dir, placed));
                const c_dir = toBlockFace(rotateByBlockFace(Vector.multiply(block_e_dir, -1), "east"));
                c_block.setPermutation(c_block.permutation.withState("chroma_tech:edge_" + c_dir, placed));
            }
        }
    }
    else if (block_e.hasTag("light_strip_fence")) {
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:east", placed));
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
        placeCollider(block_e);
    }

    if (block_w.hasTag("light_strip")) {
        const block_w_face = block_w.permutation.getState("minecraft:block_face");
        if (block_w_face == "east" && !placed) popLightStrip(block_w);
        else if (block_w_face != "west" && block_w_face != "east") {
            const block_w_dir = rotateByBlockFace(Vector.up, block_w_face);
            const c_block = dimension.getBlock(Vector.add(block_w.location, block_w_dir));
            if (c_block.hasTag("light_strip")) {
                const e_dir = toBlockFace(rotateByBlockFace(Vector.left, toBlockFace(block_w_dir)));
                block_w.setPermutation(block_w.permutation.withState("chroma_tech:extend_" + e_dir, placed));
                const c_dir = toBlockFace(rotateByBlockFace(Vector.multiply(block_w_dir, -1), "west"));
                c_block.setPermutation(c_block.permutation.withState("chroma_tech:edge_" + c_dir, placed));
            }
        }
    }
    else if (block_w.hasTag("light_strip_fence")) {
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:west", placed));
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
        placeCollider(block_w);
    }
}