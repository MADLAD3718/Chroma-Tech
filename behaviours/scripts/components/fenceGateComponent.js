import { Block, BlockComponentPlayerInteractEvent, BlockPermutation } from "@minecraft/server";
import { dirToStr, dot, neg, strToDir } from "../extensions/vectors";
import { buildTNB } from "../extensions/matrices";

/** @type {import("@minecraft/server").BlockCustomComponent} */
export const fenceGateComponent = {
    onPlace: event => alterFenceGateBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterFenceGateBlock(event.block, event.destroyedBlockPermutation, false),
    onPlayerInteract: toggleFenceGateBlock
}

/**
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
function alterFenceGateBlock(block, permutation, placed) {
    const direction = strToDir(permutation.getState("minecraft:cardinal_direction"));
    const tnb = buildTNB(direction);

    const block_l = block.offset(tnb.u);
    const block_r = block.offset(neg(tnb.u));

    if (block_l.hasTag("fence_connect")) {
        const dir = dirToStr(neg(tnb.u));
        block_l.setPermutation(block_l.permutation.withState(`onyx:${dir}`, placed));
    }
    if (block_r.hasTag("fence_connect")) {
        const dir = dirToStr(tnb.u);
        block_r.setPermutation(block_r.permutation.withState(`onyx:${dir}`, placed));
    }

    if (placed) block.setPermutation(permutation);
}

/**
 * @param {BlockComponentPlayerInteractEvent} event 
 */
function toggleFenceGateBlock(event) {
    const {block, player} = event;
    let open = block.permutation.getState("onyx:open");
    if (open != 0) {
        open = 0;
        block.dimension.playSound("close.iron_trapdoor", block.center());
    }
    else {
        const direction = strToDir(block.permutation.getState("minecraft:cardinal_direction"));
        open = dot(direction, player.getViewDirection()) >= 0 ? 1 : 2;
        block.dimension.playSound("open.iron_trapdoor", block.center());
    }
    block.setPermutation(block.permutation.withState("onyx:open", open));
}
