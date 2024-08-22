import { BlockComponentPlayerInteractEvent } from "@minecraft/server";

/** @type {import("@minecraft/server").BlockCustomComponent} */
export const trapdoorComponent = {
    onPlayerInteract: toggleTrapdoor
}

/**
 * @param {BlockComponentPlayerInteractEvent} event 
 */
function toggleTrapdoor({block}) {
    const open = block.permutation.getState("onyx:open");
    block.setPermutation(block.permutation.withState("onyx:open", !open));
    block.dimension.playSound(open ? "close.iron_trapdoor" : "open.iron_trapdoor", block.center());
}
