import { Block, BlockCustomComponent, BlockPermutation, world } from "@minecraft/server";
import { DOOR_TAG, FENCE_TAG, LIGHT_STRIP_TAG } from "../common";
import { Vec3 } from "@madlad3718/mcvec3";

export const fenceComponent: BlockCustomComponent = {
    onPlace: event => alterFenceBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterFenceBlock(event.block, event.destroyedBlockPermutation, false)
}

function alterFenceBlock(block: Block, permutation: BlockPermutation, placed: boolean) {
    const block_n = block.north();
    const block_s = block.south();
    const block_e = block.east();
    const block_w = block.west();
    const block_a = block.above();
    const block_b = block.below();

    if (!block_n?.hasTag(LIGHT_STRIP_TAG) && !block_n?.isAir && !block_n?.isLiquid && !block_n?.hasTag(DOOR_TAG)) {
        if (block_n?.hasTag(FENCE_TAG))
            block_n?.setPermutation(block_n?.permutation.withState("chroma_tech:south", placed));
        if (block_n?.hasTag("chroma_tech:fence_gate_connect")) {
            const direction = block_n?.permutation.getState("minecraft:cardinal_direction");
            if (direction == "east" || direction == "west")
                permutation = permutation.withState("chroma_tech:north", placed);
        }
        else permutation = permutation.withState("chroma_tech:north", placed);
    }
    if (!block_s?.hasTag(LIGHT_STRIP_TAG) && !block_s?.isAir && !block_s?.isLiquid && !block_s?.hasTag(DOOR_TAG)) {
        if (block_s?.hasTag(FENCE_TAG))
            block_s?.setPermutation(block_s?.permutation.withState("chroma_tech:north", placed));
        if (block_s?.hasTag("chroma_tech:fence_gate_connect")) {
            const direction = block_s?.permutation.getState("minecraft:cardinal_direction");
            if (direction == "east" || direction == "west")
                permutation = permutation.withState("chroma_tech:south", placed);
        }
        else permutation = permutation.withState("chroma_tech:south", placed);
    }
    if (!block_e?.hasTag(LIGHT_STRIP_TAG) && !block_e?.isAir && !block_e?.isLiquid && !block_e?.hasTag(DOOR_TAG)) {
        if (block_e?.hasTag(FENCE_TAG))
            block_e?.setPermutation(block_e?.permutation.withState("chroma_tech:west", placed));
        if (block_e?.hasTag("chroma_tech:fence_gate_connect")) {
            const direction = block_e?.permutation.getState("minecraft:cardinal_direction");
            if (direction == "north" || direction == "south")
                permutation = permutation.withState("chroma_tech:east", placed);
        }
        else permutation = permutation.withState("chroma_tech:east", placed);
    }
    if (!block_w?.hasTag(LIGHT_STRIP_TAG) && !block_w?.isAir && !block_w?.isLiquid && !block_w?.hasTag(DOOR_TAG)) {
        if (block_w?.hasTag(FENCE_TAG))
            block_w?.setPermutation(block_w?.permutation.withState("chroma_tech:east", placed));
        if (block_w?.hasTag("chroma_tech:fence_gate_connect")) {
            const direction = block_w?.permutation.getState("minecraft:cardinal_direction");
            if (direction == "north" || direction == "south")
                permutation = permutation.withState("chroma_tech:west", placed);
        }
        else permutation = permutation.withState("chroma_tech:west", placed);
    }
    if (!block_a?.hasTag(LIGHT_STRIP_TAG) && block_a?.hasTag(FENCE_TAG)) {
        permutation = permutation.withState("chroma_tech:above", placed);
        block_a?.setPermutation(block_a?.permutation.withState("chroma_tech:below", placed));
    }
    if (!block_b?.hasTag(LIGHT_STRIP_TAG) && block_b?.hasTag(FENCE_TAG)) {
        permutation = permutation.withState("chroma_tech:below", placed);
        block_b?.setPermutation(block_b?.permutation.withState("chroma_tech:above", placed));
    }

    const alternate = Vec3.dot(block.location, Vec3.sign(block.location)) % 2 == 1;
    if (placed) block.setPermutation(permutation.withState("chroma_tech:alternate", alternate));
}

world.afterEvents.playerBreakBlock.subscribe(event => alterBlock(event.block, false));
world.afterEvents.playerPlaceBlock.subscribe(event => alterBlock(event.block, true));

function alterBlock(block: Block, placed: boolean) {
    if (block.hasTag(FENCE_TAG) || block.hasTag(LIGHT_STRIP_TAG) || block.hasTag(DOOR_TAG)) return;

    const block_n = block.north();
    const block_s = block.south();
    const block_e = block.east();
    const block_w = block.west();

    if (block_n?.hasTag(FENCE_TAG))
        block_n?.setPermutation(block_n?.permutation.withState("chroma_tech:south", placed));
    if (block_s?.hasTag(FENCE_TAG))
        block_s?.setPermutation(block_s?.permutation.withState("chroma_tech:north", placed));
    if (block_e?.hasTag(FENCE_TAG))
        block_e?.setPermutation(block_e?.permutation.withState("chroma_tech:west", placed));
    if (block_w?.hasTag(FENCE_TAG))
        block_w?.setPermutation(block_w?.permutation.withState("chroma_tech:east", placed));
}
