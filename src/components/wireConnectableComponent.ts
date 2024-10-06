import { Block, BlockCustomComponent, BlockPermutation, system, world } from "@minecraft/server";
import { stringToVec, LIGHT_STRIP_TAG, vecToString } from "../util";
import { Mat3, Vec3 } from "@madlad3718/mcvec3";

export const wireConnectableComponent: BlockCustomComponent = {
    onPlace: event => alterWireConnectionBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterWireConnectionBlock(event.block, event.destroyedBlockPermutation, false)
};

function alterWireConnectionBlock(block: Block, permutation: BlockPermutation, placed: boolean) {
    const normal = stringToVec(permutation.getState("minecraft:block_face") as string);
    const tnb = Mat3.buildTNB(normal), tangent = Mat3.col1(tnb), binormal = Mat3.col3(tnb);

    const block_n  = block.offset(Vec3.neg(binormal));
    const block_s  = block.offset(binormal);
    const block_e  = block.offset(tangent);
    const block_w  = block.offset(Vec3.neg(tangent));
    const block_a  = block.offset(normal);
    const block_na = block_n?.offset(normal);
    const block_sa = block_s?.offset(normal);
    const block_ea = block_e?.offset(normal);
    const block_wa = block_w?.offset(normal);
    const block_nb = block_n?.offset(Vec3.neg(normal));
    const block_sb = block_s?.offset(Vec3.neg(normal));
    const block_eb = block_e?.offset(Vec3.neg(normal));
    const block_wb = block_w?.offset(Vec3.neg(normal));

    // Adjacent & Corner Connections
    if (block_n?.hasTag(LIGHT_STRIP_TAG)) {
        const block_n_normal = stringToVec(block_n?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_n_normal)) {
            permutation = permutation.withState("chroma_tech:north", placed);
            block_n?.setPermutation(block_n?.permutation.withState("chroma_tech:south", placed));
        }
        if (Vec3.equal(binormal, block_n_normal)) {
            permutation = permutation.withState("chroma_tech:north", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_n_normal)), Vec3.neg(normal)));
            block_n?.setPermutation(block_n?.permutation.withState(`chroma_tech:above_${direction}`, placed));
        }
    }

    if (block_s?.hasTag(LIGHT_STRIP_TAG)) {
        const block_s_normal = stringToVec(block_s?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_s_normal)) {
            permutation = permutation.withState("chroma_tech:south", placed);
            block_s?.setPermutation(block_s?.permutation.withState("chroma_tech:north", placed));
        }
        if (Vec3.equal(Vec3.neg(binormal), block_s_normal)) {
            permutation = permutation.withState("chroma_tech:south", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_s_normal)), Vec3.neg(normal)));
            block_s?.setPermutation(block_s?.permutation.withState(`chroma_tech:above_${direction}`, placed));
        }
    }

    if (block_e?.hasTag(LIGHT_STRIP_TAG)) {
        const block_e_normal = stringToVec(block_e?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_e_normal)) {
            permutation = permutation.withState("chroma_tech:east", placed);
            block_e?.setPermutation(block_e?.permutation.withState("chroma_tech:west", placed));
        }
        if (Vec3.equal(Vec3.neg(tangent), block_e_normal)) {
            permutation = permutation.withState("chroma_tech:east", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_e_normal)), Vec3.neg(normal)));
            block_e?.setPermutation(block_e?.permutation.withState(`chroma_tech:above_${direction}`, placed));
        }
    }

    if (block_w?.hasTag(LIGHT_STRIP_TAG)) {
        const block_w_normal = stringToVec(block_w?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_w_normal)) {
            permutation = permutation.withState("chroma_tech:west", placed);
            block_w?.setPermutation(block_w?.permutation.withState("chroma_tech:east", placed));
        }
        if (Vec3.equal(tangent, block_w_normal)) {
            permutation = permutation.withState("chroma_tech:west", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_w_normal)), Vec3.neg(normal)));
            block_w?.setPermutation(block_w?.permutation.withState(`chroma_tech:above_${direction}`, placed));
        }
    }

    // Step Below & Edge Connections
    if (block_nb?.hasTag(LIGHT_STRIP_TAG)) {
        const block_nb_normal = stringToVec(block_nb?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_nb_normal)) {
            permutation = permutation.withState("chroma_tech:north", placed);
            block_nb?.setPermutation(block_nb?.permutation.withState("chroma_tech:above_south", placed));
        }
        if (block_n?.isAir && Vec3.equal(Vec3.neg(binormal), block_nb_normal)) {
            permutation = permutation.withState("chroma_tech:north", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_nb_normal)), normal));
            block_nb?.setPermutation(block_nb?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
    }

    if (block_sb?.hasTag(LIGHT_STRIP_TAG)) {
        const normal = stringToVec(block_sb?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, normal)) {
            permutation = permutation.withState("chroma_tech:south", placed);
            block_sb?.setPermutation(block_sb?.permutation.withState("chroma_tech:above_north", placed));
        }
        if (block_s?.isAir && Vec3.equal(binormal, normal)) {
            permutation = permutation.withState("chroma_tech:south", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(normal)), normal));
            block_sb?.setPermutation(block_sb?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
    }

    if (block_eb?.hasTag(LIGHT_STRIP_TAG)) {
        const normal = stringToVec(block_eb?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, normal)) {
            permutation = permutation.withState("chroma_tech:east", placed);
            block_eb?.setPermutation(block_eb?.permutation.withState("chroma_tech:above_west", placed));
        }
        if (block_e?.isAir && Vec3.equal(tangent, normal)) {
            permutation = permutation.withState("chroma_tech:east", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(normal)), normal));
            block_eb?.setPermutation(block_eb?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
    }

    if (block_wb?.hasTag(LIGHT_STRIP_TAG)) {
        const normal = stringToVec(block_wb?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, normal)) {
            permutation = permutation.withState("chroma_tech:west", placed);
            block_wb?.setPermutation(block_wb?.permutation.withState("chroma_tech:above_east", placed));
        }
        if (block_w?.isAir && Vec3.equal(Vec3.neg(tangent), normal)) {
            permutation = permutation.withState("chroma_tech:west", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(normal)), normal));
            block_wb?.setPermutation(block_wb?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
    }

    // Step Above Connections
    if (block_na?.hasTag(LIGHT_STRIP_TAG)) {
        const block_na_normal = stringToVec(block_na?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_na_normal)) {
            permutation = permutation.withState("chroma_tech:above_north", placed);
            block_na?.setPermutation(block_na?.permutation.withState("chroma_tech:south", placed));
        }
    }

    if (block_sa?.hasTag(LIGHT_STRIP_TAG)) {
        const block_sa_normal = stringToVec(block_sa?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_sa_normal)) {
            permutation = permutation.withState("chroma_tech:above_south", placed);
            block_sa?.setPermutation(block_sa?.permutation.withState("chroma_tech:north", placed));
        }
    }

    if (block_ea?.hasTag(LIGHT_STRIP_TAG)) {
        const block_ea_normal = stringToVec(block_ea?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_ea_normal)) {
            permutation = permutation.withState("chroma_tech:above_east", placed);
            block_ea?.setPermutation(block_ea?.permutation.withState("chroma_tech:west", placed));
        }
    }

    if (block_wa?.hasTag(LIGHT_STRIP_TAG)) {
        const block_wa_normal = stringToVec(block_wa?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(normal, block_wa_normal)) {
            permutation = permutation.withState("chroma_tech:above_west", placed);
            block_wa?.setPermutation(block_wa?.permutation.withState("chroma_tech:east", placed));
        }
    }

    // Above Corner Connections
    if (block_a?.hasTag(LIGHT_STRIP_TAG)) {
        const block_a_normal = stringToVec(block_a?.permutation.getState("minecraft:block_face") as string);
        if (Vec3.equal(binormal, block_a_normal)) {
            permutation = permutation.withState("chroma_tech:above_north", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
            block_a?.setPermutation(block_a?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
        if (Vec3.equal(Vec3.neg(binormal), block_a_normal)) {
            permutation = permutation.withState("chroma_tech:above_south", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
            block_a?.setPermutation(block_a?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
        if (Vec3.equal(Vec3.neg(tangent), block_a_normal)) {
            permutation = permutation.withState("chroma_tech:above_east", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
            block_a?.setPermutation(block_a?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
        if (Vec3.equal(tangent, block_a_normal)) {
            permutation = permutation.withState("chroma_tech:above_west", placed);
            const direction = vecToString(Mat3.mul(Mat3.transpose(Mat3.buildTNB(block_a_normal)), Vec3.neg(normal)));
            block_a?.setPermutation(block_a?.permutation.withState(`chroma_tech:${direction}`, placed));
        }
    }

    permutation = permutation.withState("chroma_tech:placed", placed);
    if (placed) block.setPermutation(permutation);
}

world.afterEvents.blockExplode.subscribe(event => {
    if (event.explodedBlockPermutation.hasTag(LIGHT_STRIP_TAG))
        alterWireConnectionBlock(event.block, event.explodedBlockPermutation, false);
});

world.beforeEvents.playerBreakBlock.subscribe(({block}) => {
    if (!block.typeId.startsWith("minecraft")) return;

    const block_n = block.north();
    const block_s = block.south();
    const block_e = block.east();
    const block_w = block.west();
    const block_a = block.above();
    const block_b = block.below();

    if (block_n?.hasTag(LIGHT_STRIP_TAG)) {
        const permutation = block_n?.permutation;
        if (permutation.getState("minecraft:block_face") == "north")
            system.run(() => alterWireConnectionBlock(block_n, permutation, false));
    }
    if (block_s?.hasTag(LIGHT_STRIP_TAG)) {
        const permutation = block_s?.permutation;
        if (permutation.getState("minecraft:block_face") == "south")
            system.run(() => alterWireConnectionBlock(block_s, permutation, false));
    }
    if (block_e?.hasTag(LIGHT_STRIP_TAG)) {
        const permutation = block_e?.permutation;
        if (permutation.getState("minecraft:block_face") == "east")
            system.run(() => alterWireConnectionBlock(block_e, permutation, false));
    }
    if (block_w?.hasTag(LIGHT_STRIP_TAG)) {
        const permutation = block_w?.permutation;
        if (permutation.getState("minecraft:block_face") == "west")
            system.run(() => alterWireConnectionBlock(block_w, permutation, false));
    }
    if (block_a?.hasTag(LIGHT_STRIP_TAG)) {
        const permutation = block_a?.permutation;
        if (permutation.getState("minecraft:block_face") == "up")
            system.run(() => alterWireConnectionBlock(block_a, permutation, false));
    }
    if (block_b?.hasTag(LIGHT_STRIP_TAG)) {
        const permutation = block_b?.permutation;
        if (permutation.getState("minecraft:block_face") == "down")
            system.run(() => alterWireConnectionBlock(block_b, permutation, false));
    }
});
