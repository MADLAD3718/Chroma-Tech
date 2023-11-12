import { Block, BlockPermutation, ItemStack, BlockTypes, Player, world } from "@minecraft/server";
import { breakLightStripFenceGate, interactLightStripFenceGate } from "./light_strip_fence_gate";
import { blockFaceToDirection, dot, toVec } from "./vectors";
import { decrementStack, inSurvival } from "./util";

/**
 * Handles the placement or removal of new light strip fences.
 * @param {Block} block 
 * @param {BlockPermutation} permutation
 * @param {Boolean} placed
 */
export function alterLightStripFence(block, permutation, placed) {
    const {dimension, location} = block;
    
    const block_n = block.north();
    if (block_n.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:north", placed);
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:south", placed));
        block_n.setPermutation(block_n.permutation.withState("chroma_tech:center", hasCenter(block_n)));
        placeCollider(block_n);
    }
    else if (placed) {
        if (block_n.isSolid) permutation = permutation.withState("chroma_tech:north", true);
        else if (block_n.hasTag("light_strip_fence_gate")) {
            const direction = blockFaceToDirection(block_n.permutation.getState("minecraft:cardinal_direction"));
            if (Math.abs(direction.x) == 1)
                permutation = permutation.withState("chroma_tech:north", true);
        }
    }

    const block_s = block.south();
    if (block_s.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:south", placed);
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:north", placed));
        block_s.setPermutation(block_s.permutation.withState("chroma_tech:center", hasCenter(block_s)));
        placeCollider(block_s);
    }
    else if (placed) {
        if (block_s.isSolid) permutation = permutation.withState("chroma_tech:south", true);
        else if (block_s.hasTag("light_strip_fence_gate")) {
            const direction = blockFaceToDirection(block_s.permutation.getState("minecraft:cardinal_direction"));
            if (Math.abs(direction.x) == 1)
                permutation = permutation.withState("chroma_tech:south", true);
        }
    }

    const block_e = block.east();
    if (block_e.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:east", placed);
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:west", placed));
        block_e.setPermutation(block_e.permutation.withState("chroma_tech:center", hasCenter(block_e)));
        placeCollider(block_e);
    }
    else if (placed) {
        if (block_e.isSolid) permutation = permutation.withState("chroma_tech:east", true);
        else if (block_e.hasTag("light_strip_fence_gate")) {
            const direction = blockFaceToDirection(block_e.permutation.getState("minecraft:cardinal_direction"));
            if (Math.abs(direction.z) == 1)
                permutation = permutation.withState("chroma_tech:east", true);
        }
    }
    
    const block_w = block.west();
    if (block_w.hasTag("light_strip_fence")) {
        permutation = permutation.withState("chroma_tech:west", placed);
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:east", placed));
        block_w.setPermutation(block_w.permutation.withState("chroma_tech:center", hasCenter(block_w)));
        placeCollider(block_w);
    }
    else if (placed) {
        if (block_w.isSolid) permutation = permutation.withState("chroma_tech:west", true);
        else if (block_w.hasTag("light_strip_fence_gate")) {
            const direction = blockFaceToDirection(block_w.permutation.getState("minecraft:cardinal_direction"));
            if (Math.abs(direction.z) == 1)
                permutation = permutation.withState("chroma_tech:west", true);
        }
    }
    
    if (location.y + 1 < dimension.heightRange.max) {
        const block_a = block.above();
        if (block_a.hasTag("light_strip_fence")) {
            const block_aa = block_a.above();
            if (!block_aa.hasTag("light_strip_fence") && hasDouble(block_a.permutation))
                block_a.setPermutation(block_a.permutation.withState("chroma_tech:center", placed));
        }
    }
    
    if (location.y - 1 > dimension.heightRange.min) {
        const block_b = block.below();
        if (block_b.hasTag("light_strip_fence")) {
            const block_bb = block_b.below();
            if (!block_bb.hasTag("light_strip_fence") && hasDouble(block_b.permutation))
                block_b.setPermutation(block_b.permutation.withState("chroma_tech:center", placed));
            if (!placed) placeCollider(block_b);
        }
    }

    if (location.y > dimension.heightRange.min && location.y < dimension.heightRange.max) {
        const block_a = block.above(), block_b = block.below();
        if (placed) {
            if (hasDouble(permutation) && !block_a.hasTag("light_strip_fence") && !block_b.hasTag("light_strip_fence"))
                permutation = permutation.withState("chroma_tech:center", false);
            permutation = permutation.withState("chroma_tech:alternate", dot(location, toVec(1)) % 2 == 1);
            block.setPermutation(permutation);
            if (block_a.isAir || block_a.hasTag("light_strip_fence_collider")) placeCollider(block, permutation);
        }
        else if (block_a.hasTag("light_strip_fence_collider")) block_a.setType(BlockTypes.get("air"));
    }
}

/**
 * Determines if a fence should have the center piece.
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @returns {Boolean}
 */
export function hasCenter(block) {
    const {permutation} = block;
    const block_a = block.above();
    const block_b = block.below();
    return block_a.hasTag("light_strip_fence") || block_b.hasTag("light_strip_fence") || !hasDouble(permutation);
}

/**
 * Determines if a fence block has a double connection.
 * @param {BlockPermutation} permutation 
 * @returns {Boolean}
 */
function hasDouble(permutation) {
    const north = permutation.getState("chroma_tech:north");
    const south = permutation.getState("chroma_tech:south");
    const east = permutation.getState("chroma_tech:east");
    const west = permutation.getState("chroma_tech:west");
    return ((north && south) || (east && west))
         && !(north && south && east && west);
}

/**
 * Places a fence collider block in the given block location according to the provided fence permutation.
 * @param {Block} block
 */
export function placeCollider(block) {
    const {permutation, location} = block;
    const block_a = block.above();
    if (!block_a.isAir && !block_a.hasTag("light_strip_fence_collider")) return;
    const north = permutation.getState("chroma_tech:north");
    const south = permutation.getState("chroma_tech:south");
    const east = permutation.getState("chroma_tech:east");
    const west = permutation.getState("chroma_tech:west");
    const alternate = dot(location, toVec(1)) % 2 == 0;
    block_a.setPermutation(BlockPermutation.resolve("chroma_tech:light_strip_fence_collider", {
        "chroma_tech:north": north, "chroma_tech:south": south, "chroma_tech:east": east, "chroma_tech:west": west, "chroma_tech:alt": alternate
    }));
}

/**
 * Handles the removal of a fence collider block.
 * @param {Block} block 
 * @param {Player} player
 */
export function breakCollider(block, player) {
    const block_b = block.below();
    if (block_b.hasTag("light_strip_fence")) breakLightStripFence(block_b, inSurvival(player));
    else if (block_b.hasTag("light_strip_fence_gate")) breakLightStripFenceGate(block_b, inSurvival(player));
}

/**
 * Destroys a light strip fence as if it were broken.
 * @param {Block} block 
 * @param {Boolean} inSurvival
 */
function breakLightStripFence(block, inSurvival) {
    const {dimension, location, permutation} = block;
    alterLightStripFence(block, permutation, false);
    if (inSurvival) dimension.spawnItem(new ItemStack(block.typeId), location);
    block.setType(BlockTypes.get("air"));
    const block_b = block.below();
    if (block_b.hasTag("light_strip_fence") || block_b.hasTag("light_strip_fence_gate"))
        placeCollider(block_b);
}

/**
 * Handles light strip fence placement in a space that is occupied by a fence collider.
 * @param {Block} block 
 * @param {ItemStack} item
 * @param {Player} player
 */
export function interactLightStripFenceCollider(block, item, player) {
    const {location} = block;
    const block_b = block.below();
    if (block_b.hasTag("light_strip_fence_gate")) interactLightStripFenceGate(block_b, player);
    else if (item?.typeId.endsWith("light_strip_fence")) {
        const permutation = BlockPermutation.resolve(item.typeId);
        block.setPermutation(permutation);
        world.playSound("dig.stone", location);
        alterLightStripFence(block, permutation, true);
        if (inSurvival(player)) decrementStack(player);
    }
}