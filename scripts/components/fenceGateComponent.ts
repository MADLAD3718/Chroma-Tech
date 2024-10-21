import { Block, BlockComponentPlayerInteractEvent, BlockCustomComponent, BlockPermutation, Vector3 } from "@minecraft/server";
import { Vec3, Mat3 } from "@madlad3718/mcvec3";

export const fenceGateComponent: BlockCustomComponent = {
    onPlace: event => alterFenceGateBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterFenceGateBlock(event.block, event.destroyedBlockPermutation, false),
    onPlayerInteract: toggleFenceGateBlock
}

function alterFenceGateBlock(block: Block, permutation: BlockPermutation, placed: boolean) {
    const normal = Vec3.fromBlockFace(permutation.getState("minecraft:cardinal_direction") as string);
    const tnb = Mat3.buildTNB(normal), tangent = Mat3.c1(tnb);

    const block_l = block.offset(tangent);
    const block_r = block.offset(Vec3.neg(tangent));

    if (block_l?.hasTag("fence_connect")) {
        const direction = Vec3.toDirection(Vec3.neg(tangent)).toLowerCase();
        block_l?.setPermutation(block_l?.permutation.withState(`chroma_tech:${direction}`, placed));
    }
    if (block_r?.hasTag("fence_connect")) {
        const direction = Vec3.toDirection(tangent).toLowerCase();
        block_r?.setPermutation(block_r?.permutation.withState(`chroma_tech:${direction}`, placed));
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
        const direction = Vec3.fromBlockFace(permutation.getState("minecraft:cardinal_direction") as string);
        open = Vec3.dot(direction, player?.getViewDirection() as Vector3) >= 0 ? 1 : 2;
        dimension.playSound("open.iron_trapdoor", block.center());
    }
    block.setPermutation(permutation.withState("chroma_tech:open", open));
}
