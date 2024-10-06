import { Block, BlockComponentPlayerInteractEvent, BlockCustomComponent, BlockPermutation } from "@minecraft/server";
import { Vec3, Mat3, Vector3 } from "@madlad3718/mcvec3";
import { stringToVec, vecToString } from "../util";

export const fenceGateComponent: BlockCustomComponent = {
    onPlace: event => alterFenceGateBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterFenceGateBlock(event.block, event.destroyedBlockPermutation, false),
    onPlayerInteract: toggleFenceGateBlock
}

function alterFenceGateBlock(block: Block, permutation: BlockPermutation, placed: boolean) {
    const normal = stringToVec(permutation.getState("minecraft:cardinal_direction") as string);
    const tnb = Mat3.buildTNB(normal), tangent = Mat3.col1(tnb);

    const block_l = block.offset(tangent);
    const block_r = block.offset(Vec3.neg(tangent));

    if (block_l?.hasTag("fence_connect")) {
        const dir = vecToString(Vec3.neg(tangent));
        block_l?.setPermutation(block_l?.permutation.withState(`chroma_tech:${dir}`, placed));
    }
    if (block_r?.hasTag("fence_connect")) {
        const dir = vecToString(tangent);
        block_r?.setPermutation(block_r?.permutation.withState(`chroma_tech:${dir}`, placed));
    }

    if (placed) block.setPermutation(permutation);
}


function toggleFenceGateBlock(event: BlockComponentPlayerInteractEvent) {
    const {block, player} = event, {permutation, dimension} = block;
    let open = block.permutation.getState("chroma_tech:open");
    if (open != 0) {
        open = 0;
        dimension.playSound("close.iron_trapdoor", block.center());
    } else {
        const direction = stringToVec(permutation.getState("minecraft:cardinal_direction") as string);
        open = Vec3.dot(direction, player?.getViewDirection() as Vector3) >= 0 ? 1 : 2;
        dimension.playSound("open.iron_trapdoor", block.center());
    }
    block.setPermutation(permutation.withState("chroma_tech:open", open));
}
