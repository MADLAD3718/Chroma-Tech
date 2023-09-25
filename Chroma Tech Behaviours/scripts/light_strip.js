import { Block, BlockPermutation, Vector, BlockTypes, ItemStack, Dimension } from "@minecraft/server";
import { rotate180Y, rotateByBlockFace, toBlockFace, toDirection } from "./util";

/**
 * Handles the addition or removal of a light strip block.
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
export function alterLightStrip(block, permutation, placed) {
    const { dimension, location } = block;
    const blockface = permutation.getState("minecraft:block_face");
    
    // Get relative direction vectors
    const rUp = rotateByBlockFace(Vector.up, blockface);
    const rDown = rotateByBlockFace(Vector.down, blockface);
    const rNorth = rotateByBlockFace(Vector.forward, blockface);
    const rSouth = rotateByBlockFace(Vector.back, blockface);
    const rEast = rotateByBlockFace(Vector.left, blockface);
    const rWest = rotateByBlockFace(Vector.right, blockface);
    
    // Lookup relevant nearby blocks
    const block_a = dimension.getBlock(Vector.add(location, rUp));
    const block_n = dimension.getBlock(Vector.add(location, rNorth));
    const block_s = dimension.getBlock(Vector.add(location, rSouth));
    const block_e = dimension.getBlock(Vector.add(location, rEast));
    const block_w = dimension.getBlock(Vector.add(location, rWest));
    const block_nb = dimension.getBlock(Vector.add(block_n.location, rDown));
    const block_sb = dimension.getBlock(Vector.add(block_s.location, rDown));
    const block_eb = dimension.getBlock(Vector.add(block_e.location, rDown));
    const block_wb = dimension.getBlock(Vector.add(block_w.location, rDown));
    const block_na = dimension.getBlock(Vector.add(block_n.location, rUp));
    const block_sa = dimension.getBlock(Vector.add(block_s.location, rUp));
    const block_ea = dimension.getBlock(Vector.add(block_e.location, rUp));
    const block_wa = dimension.getBlock(Vector.add(block_w.location, rUp));
    
    // Similar Plane + Corner Connections
    if (block_n.hasTag("light_strip")) {
        const block_n_dir = rotateByBlockFace(Vector.up, block_n.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_n_dir)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            block_n.setPermutation(block_n.permutation.withState("chroma_tech:edge_south", placed));
        }
        else if (rSouth.equals(block_n_dir) && block_nb.isSolid) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_n_dir)));
            block_n.setPermutation(block_n.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }

    if (block_s.hasTag("light_strip")) {
        const block_s_dir = rotateByBlockFace(Vector.up, block_s.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_s_dir)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            block_s.setPermutation(block_s.permutation.withState("chroma_tech:edge_north", placed));
        }
        else if (rNorth.equals(block_s_dir) && block_sb.isSolid) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_s_dir)));
            block_s.setPermutation(block_s.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }

    if (block_e.hasTag("light_strip")) {
        const block_e_dir = rotateByBlockFace(Vector.up, block_e.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_e_dir)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            block_e.setPermutation(block_e.permutation.withState("chroma_tech:edge_west", placed));
        }
        else if (rWest.equals(block_e_dir) && block_eb.isSolid) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_e_dir)));
            block_e.setPermutation(block_e.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }

    if (block_w.hasTag("light_strip")) {
        const block_w_dir = rotateByBlockFace(Vector.up, block_w.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_w_dir)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            block_w.setPermutation(block_w.permutation.withState("chroma_tech:edge_east", placed));
        }
        else if (rEast.equals(block_w_dir) && block_wb.isSolid) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_w_dir)));
            block_w.setPermutation(block_w.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }

    // Below Plane + Edge Connections
    if (block_nb.hasTag("light_strip") && !block_n.isSolid) {
        const block_nb_dir = rotateByBlockFace(Vector.up, block_nb.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_nb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            block_nb.setPermutation(block_nb.permutation.withState("chroma_tech:extend_south", placed));
        }
        else if (rNorth.equals(block_nb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            const direction = toBlockFace(rotateByBlockFace(rUp, toBlockFace(block_nb_dir)));
            block_nb.setPermutation(block_nb.permutation.withState("chroma_tech:edge_" + direction, placed));
            if (!placed) block_nb.setPermutation(block_nb.permutation.withState("chroma_tech:edge_" + direction, false));
        }
    }

    if (block_sb.hasTag("light_strip") && !block_s.isSolid) {
        const block_sb_dir = rotateByBlockFace(Vector.up, block_sb.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_sb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            block_sb.setPermutation(block_sb.permutation.withState("chroma_tech:extend_north", placed));
        }
        else if (rSouth.equals(block_sb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            const direction = toBlockFace(rotateByBlockFace(rUp, toBlockFace(block_sb_dir)));
            block_sb.setPermutation(block_sb.permutation.withState("chroma_tech:edge_" + direction, placed));
            if (!placed) block_sb.setPermutation(block_sb.permutation.withState("chroma_tech:edge_" + direction, false));
        }
    }

    if (block_eb.hasTag("light_strip") && !block_e.isSolid) {
        const block_eb_dir = rotateByBlockFace(Vector.up, block_eb.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_eb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            block_eb.setPermutation(block_eb.permutation.withState("chroma_tech:extend_west", placed));
        }
        else if (rEast.equals(block_eb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            const direction = toBlockFace(rotateByBlockFace(rUp, toBlockFace(block_eb_dir)));
            block_eb.setPermutation(block_eb.permutation.withState("chroma_tech:edge_" + direction, placed));
            if (!placed) block_eb.setPermutation(block_eb.permutation.withState("chroma_tech:edge_" + direction, false));
        }
    }

    if (block_wb.hasTag("light_strip") && !block_w.isSolid) {
        const block_wb_dir = rotateByBlockFace(Vector.up, block_wb.permutation.getState("minecraft:block_face"));
        if (rUp.equals(block_wb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            block_wb.setPermutation(block_wb.permutation.withState("chroma_tech:extend_east", placed));
        }
        else if (rWest.equals(block_wb_dir)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            const direction = toBlockFace(rotateByBlockFace(rUp, toBlockFace(block_wb_dir)));
            block_wb.setPermutation(block_wb.permutation.withState("chroma_tech:edge_" + direction, placed));
            if (!placed) block_wb.setPermutation(block_wb.permutation.withState("chroma_tech:edge_" + direction, false));
        }
    }

    // Above Plane Connections
    if (!block_a.isSolid) {
        if (block_na.hasTag("light_strip") && blockface == block_na.permutation.getState("minecraft:block_face")) {
            permutation = permutation.withState("chroma_tech:extend_north", placed);
            block_na.setPermutation(block_na.permutation.withState("chroma_tech:edge_south", placed));
        }
    
        if (block_sa.hasTag("light_strip") && blockface == block_sa.permutation.getState("minecraft:block_face")) {
            permutation = permutation.withState("chroma_tech:extend_south", placed);
            block_sa.setPermutation(block_sa.permutation.withState("chroma_tech:edge_north", placed));
        }
    
        if (block_ea.hasTag("light_strip") && blockface == block_ea.permutation.getState("minecraft:block_face")) {
            permutation = permutation.withState("chroma_tech:extend_east", placed);
            block_ea.setPermutation(block_ea.permutation.withState("chroma_tech:edge_west", placed));
        }
    
        if (block_wa.hasTag("light_strip") && blockface == block_wa.permutation.getState("minecraft:block_face")) {
            permutation = permutation.withState("chroma_tech:extend_west", placed);
            block_wa.setPermutation(block_wa.permutation.withState("chroma_tech:edge_east", placed));
        }
    }

    // Direct Above Connections
    if (block_a.hasTag("light_strip")) {
        const block_a_dir = rotateByBlockFace(Vector.up, block_a.permutation.getState("minecraft:block_face"));
        if (rNorth.equals(block_a_dir) && block_s.isSolid) {
            permutation = permutation.withState("chroma_tech:extend_south", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_a_dir)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
        else if (rSouth.equals(block_a_dir) && block_n.isSolid) {
            permutation = permutation.withState("chroma_tech:extend_north", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_a_dir)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
        else if (rEast.equals(block_a_dir) && block_w.isSolid) {
            permutation = permutation.withState("chroma_tech:extend_west", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_a_dir)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
        else if (rWest.equals(block_a_dir) && block_e.isSolid) {
            permutation = permutation.withState("chroma_tech:extend_east", placed);
            const direction = toBlockFace(rotateByBlockFace(rDown, toBlockFace(block_a_dir)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
    }

    if (placed) block.setPermutation(permutation);
}

/**
 * Pops a lightstrip as if it were broken.
 * @param {Dimension} dimension
 * @param {Block} block 
 */
export function popLightStrip(block) {
    const {dimension, location, permutation} = block;
    alterLightStrip(block, permutation, false);
    dimension.spawnItem(new ItemStack(block.typeId.replace("_block", "")), location);
    block.setType(BlockTypes.get("air"));
}

/**
 * Filters light strip placement for valid locations.
 * @param {Block} block
 * @param {String} blockface
 * @returns {Boolean} `true` if the placement is valid.
 */
export function validLightStripPlacement(block, blockface) {
    if (!block.isSolid) return false;
    const place_block = block.dimension.getBlock(Vector.add(block.location, rotate180Y(toDirection(blockface))));
    return !place_block.isLiquid;
}