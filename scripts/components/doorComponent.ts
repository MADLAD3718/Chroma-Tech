import { Block, BlockCustomComponent, BlockPermutation, world } from "@minecraft/server";
import { Mat3, Vec3 } from "@madlad3718/mcvec3";
import { DOOR_TAG } from "../common";

export const doorComponent: BlockCustomComponent = {
    onPlace({block}) {
        const {permutation} = block;
        const states = permutation.getAllStates();
        if (states["chroma_tech:top"]) return;
        const normal = Vec3.fromBlockFace(states["minecraft:cardinal_direction"] as string);
        const tnb = Mat3.buildTNB(normal);
        if (block.offset(Mat3.c1(tnb))?.typeId.endsWith("door"))
            block.setPermutation(permutation.withState("chroma_tech:flipped", true));
        block.above()?.setPermutation(block.permutation.withState("chroma_tech:top", true));
    },

    onPlayerInteract(event) {
        const {block, dimension} = event, {permutation} = block;
        const open = !permutation.getState("chroma_tech:open")
        block.setPermutation(permutation.withState("chroma_tech:open", open));
        if (permutation.getState("chroma_tech:top"))
            block.below()?.setPermutation(block.permutation.withState("chroma_tech:top", false));
        else block.above()?.setPermutation(block.permutation.withState("chroma_tech:top", true));
        dimension.playSound(open ? "open.iron_door" : "close.iron_door", block.center());
    },

    beforeOnPlayerPlace(event) {
        event.cancel = !event.block.above()?.isAir;
    },

    onPlayerDestroy: event => breakDoor(event.block, event.destroyedBlockPermutation)
}

function breakDoor(block: Block, permutation: BlockPermutation) {
    if (permutation.getState("chroma_tech:top"))
        block.below()?.setType("minecraft:air");
    else block.above()?.setType("minecraft:air");
}

world.afterEvents.blockExplode.subscribe(event => {
    if (!event.explodedBlockPermutation.hasTag(DOOR_TAG)) return;
    breakDoor(event.block, event.explodedBlockPermutation);
});
