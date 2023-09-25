import { Block, world } from "@minecraft/server";

/**
 * Handles interactions with light strip trapdoors.
 * @param {Block} block 
 */
export function interactLightStripTrapdoor(block) {
    const {location, permutation} = block;
    if (permutation.getState("chroma_tech:open_t")) world.playSound("open.iron_trapdoor", location);
    else world.playSound("close.iron_trapdoor", location);
}