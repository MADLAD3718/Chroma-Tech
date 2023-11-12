import { Block, BlockPermutation, BlockTypes, ItemStack, Dimension, world } from "@minecraft/server";
import { add, blockFaceToDirection, directionToBlockFace, equal, neg } from "./vectors";
import { Basis, inverse } from "./basis";

/**
 * Handles the addition or removal of a light strip block.
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
export function alterLightStrip(block, permutation, placed) {
    const {dimension, location} = block;
    const blockface = permutation.getState("minecraft:block_face");
    const basis = new Basis(blockFaceToDirection(blockface));
    
    const block_n = dimension.getBlock(add(location, neg(basis.w)));
    const block_s = dimension.getBlock(add(location, basis.w));
    const block_e = dimension.getBlock(add(location, basis.u));
    const block_w = dimension.getBlock(add(location, neg(basis.u)));
    const block_nb = dimension.getBlock(add(block_n.location, neg(basis.v)));
    const block_sb = dimension.getBlock(add(block_s.location, neg(basis.v)));
    const block_eb = dimension.getBlock(add(block_e.location, neg(basis.v)));
    const block_wb = dimension.getBlock(add(block_w.location, neg(basis.v)));
    const block_na = dimension.getBlock(add(block_n.location, basis.v));
    const block_sa = dimension.getBlock(add(block_s.location, basis.v));
    const block_ea = dimension.getBlock(add(block_e.location, basis.v));
    const block_wa = dimension.getBlock(add(block_w.location, basis.v));
    const block_a = dimension.getBlock(add(location, basis.v));

    // Adjacent & Corner Connections
    if (block_n.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_n.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            block_n.setPermutation(block_n.permutation.withState("chroma_tech:edge_south", placed));
        }
        if (block_nb.isSolid && equal(basis.w, normal)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_n.setPermutation(block_n.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }
    
    if (block_s.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_s.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            block_s.setPermutation(block_s.permutation.withState("chroma_tech:edge_north", placed));
        }
        if (block_sb.isSolid && equal(neg(basis.w), normal)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_s.setPermutation(block_s.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }
    
    if (block_e.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_e.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            block_e.setPermutation(block_e.permutation.withState("chroma_tech:edge_west", placed));
        }
        if (block_eb.isSolid && equal(neg(basis.u), normal)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_e.setPermutation(block_e.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }
    
    if (block_w.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_w.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            block_w.setPermutation(block_w.permutation.withState("chroma_tech:edge_east", placed));
        }
        if (block_wb.isSolid && equal(basis.u, normal)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_w.setPermutation(block_w.permutation.withState("chroma_tech:extend_" + direction, placed));
        }
    }

    // Step Below & Edge Connections
    if (block_nb.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_nb.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            block_nb.setPermutation(block_nb.permutation.withState("chroma_tech:extend_south", placed));
        }
        if (!block_n.isSolid && equal(neg(basis.w), normal)) {
            permutation = permutation.withState("chroma_tech:edge_north", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(basis.v));
            block_nb.setPermutation(block_nb.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
    }

    if (block_sb.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_sb.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            block_sb.setPermutation(block_sb.permutation.withState("chroma_tech:extend_north", placed));
        }
        if (!block_s.isSolid && equal(basis.w, normal)) {
            permutation = permutation.withState("chroma_tech:edge_south", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(basis.v));
            block_sb.setPermutation(block_sb.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
    }

    if (block_eb.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_eb.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            block_eb.setPermutation(block_eb.permutation.withState("chroma_tech:extend_west", placed));
        }
        if (!block_e.isSolid && equal(basis.u, normal)) {
            permutation = permutation.withState("chroma_tech:edge_east", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(basis.v));
            block_eb.setPermutation(block_eb.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
    }

    if (block_wb.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_wb.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            block_wb.setPermutation(block_wb.permutation.withState("chroma_tech:extend_east", placed));
        }
        if (!block_w.isSolid && equal(neg(basis.u), normal)) {
            permutation = permutation.withState("chroma_tech:edge_west", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(basis.v));
            block_wb.setPermutation(block_wb.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
    }

    // Step Above Connections
    if (block_na.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_na.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:extend_north", placed);
            block_na.setPermutation(block_na.permutation.withState("chroma_tech:edge_south", placed));
        }
    }

    if (block_sa.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_sa.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:extend_south", placed);
            block_sa.setPermutation(block_sa.permutation.withState("chroma_tech:edge_north", placed));
        }
    }

    if (block_ea.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_ea.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:extend_east", placed);
            block_ea.setPermutation(block_ea.permutation.withState("chroma_tech:edge_west", placed));
        }
    }

    if (block_wa.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_wa.permutation.getState("minecraft:block_face"));
        if (equal(basis.v, normal)) {
            permutation = permutation.withState("chroma_tech:extend_west", placed);
            block_wa.setPermutation(block_wa.permutation.withState("chroma_tech:edge_east", placed));
        }
    }

    // Above Corner Connections
    if (block_a.hasTag("light_strip")) {
        const normal = blockFaceToDirection(block_a.permutation.getState("minecraft:block_face"));
        if (block_n.isSolid && equal(basis.w, normal)) {
            permutation = permutation.withState("chroma_tech:extend_north", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
        if (block_s.isSolid && equal(neg(basis.w), normal)) {
            permutation = permutation.withState("chroma_tech:extend_south", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
        if (block_e.isSolid && equal(neg(basis.u), normal)) {
            permutation = permutation.withState("chroma_tech:extend_east", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
            block_a.setPermutation(block_a.permutation.withState("chroma_tech:edge_" + direction, placed));
        }
        if (block_w.isSolid && equal(basis.u, normal)) {
            permutation = permutation.withState("chroma_tech:extend_west", placed);
            const direction = directionToBlockFace(inverse(new Basis(normal)).localize(neg(basis.v)));
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
    const {dimension, location, permutation, typeId} = block;
    alterLightStrip(block, permutation, false);
    world.playSound("dig.stone", location);
    dimension.spawnItem(new ItemStack(typeId.replace("_block", "")), location);
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
    const {location, dimension} = block;
    const place_block = dimension.getBlock(add(location, blockFaceToDirection(blockface)));
    return !place_block.isLiquid;
}