import { Block, BlockPermutation, world } from "@minecraft/server";
import { dot, sign } from "../extensions/vectors";

/** @type {import("@minecraft/server").BlockCustomComponent} */
export const fenceComponent = {
    onPlace: event => alterFenceBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterFenceBlock(event.block, event.destroyedBlockPermutation, false)
}

/**
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
function alterFenceBlock(block, permutation, placed) {
    const block_n = block.north();
    const block_s = block.south();
    const block_e = block.east();
    const block_w = block.west();
    const block_a = block.above();
    const block_b = block.below();

    if (!block_n.isAir && !block_n.isLiquid) {
        if (block_n.hasTag("fence_connect"))
            block_n.setPermutation(block_n.permutation.withState("onyx:south", placed));
        if (block_n.hasTag("fence_gate_connect")) {
            const direction = block_n.permutation.getState("minecraft:cardinal_direction");
            if (direction == "east" || direction == "west")
                permutation = permutation.withState("onyx:north", placed);
        }
        else permutation = permutation.withState("onyx:north", placed);
    }
    if (!block_s.isAir && !block_s.isLiquid) {
        if (block_s.hasTag("fence_connect"))
            block_s.setPermutation(block_s.permutation.withState("onyx:north", placed));
        if (block_s.hasTag("fence_gate_connect")) {
            const direction = block_s.permutation.getState("minecraft:cardinal_direction");
            if (direction == "east" || direction == "west")
                permutation = permutation.withState("onyx:south", placed);
        }
        else permutation = permutation.withState("onyx:south", placed);
    }
    if (!block_e.isAir && !block_e.isLiquid) {
        if (block_e.hasTag("fence_connect"))
            block_e.setPermutation(block_e.permutation.withState("onyx:west", placed));
        if (block_e.hasTag("fence_gate_connect")) {
            const direction = block_e.permutation.getState("minecraft:cardinal_direction");
            if (direction == "north" || direction == "south")
                permutation = permutation.withState("onyx:east", placed);
        }
        else permutation = permutation.withState("onyx:east", placed);
    }
    if (!block_w.isAir && !block_w.isLiquid) {
        if (block_w.hasTag("fence_connect"))
            block_w.setPermutation(block_w.permutation.withState("onyx:east", placed));
        if (block_w.hasTag("fence_gate_connect")) {
            const direction = block_w.permutation.getState("minecraft:cardinal_direction");
            if (direction == "north" || direction == "south")
                permutation = permutation.withState("onyx:west", placed);
        }
        else permutation = permutation.withState("onyx:west", placed);
    }
    if (block_a.hasTag("fence_connect")) {
        permutation = permutation.withState("onyx:above", placed);
        block_a.setPermutation(block_a.permutation.withState("onyx:below", placed));
    }
    if (block_b.hasTag("fence_connect")) {
        permutation = permutation.withState("onyx:below", placed);
        block_b.setPermutation(block_b.permutation.withState("onyx:above", placed));
    }

    const alternate = dot(block.location, sign(block.location)) % 2 == 1;
    if (placed) block.setPermutation(permutation.withState("onyx:alternate", alternate));
}

world.afterEvents.playerBreakBlock.subscribe(event => alterBlock(event.block, false));
world.afterEvents.playerPlaceBlock.subscribe(event => alterBlock(event.block, true));

/**
 * @param {Block} block 
 * @param {Boolean} placed 
 */
function alterBlock(block, placed) {
    if (block.hasTag("fence_connect")) return;

    const block_n = block.north();
    const block_s = block.south();
    const block_e = block.east();
    const block_w = block.west();

    if (block_n.hasTag("fence_connect"))
        block_n.setPermutation(block_n.permutation.withState("onyx:south", placed));
    if (block_s.hasTag("fence_connect"))
        block_s.setPermutation(block_s.permutation.withState("onyx:north", placed));
    if (block_e.hasTag("fence_connect"))
        block_e.setPermutation(block_e.permutation.withState("onyx:west", placed));
    if (block_w.hasTag("fence_connect"))
        block_w.setPermutation(block_w.permutation.withState("onyx:east", placed));
}
