import { BlockCustomComponent } from "@minecraft/server";

export const trapdoorComponent: BlockCustomComponent = {
    onPlayerInteract({block}) {
        const {dimension, permutation} = block;
        const open = permutation.getState("chroma_tech:open");
        block.setPermutation(permutation.withState("chroma_tech:open", !open));
        dimension.playSound(open ? "close.iron_trapdoor" : "open.iron_trapdoor", block.center());
    }
}
