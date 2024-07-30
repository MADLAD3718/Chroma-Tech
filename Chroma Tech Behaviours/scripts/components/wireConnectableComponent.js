import { Block, BlockPermutation, system, world } from "@minecraft/server";
import { equal, neg, strToDir, dirToStr, stringifyVec } from "../extensions/vectors";
import { adjugate, buildTNB, inverse, Matrix3, transpose } from "../extensions/matrices";
import { mmul } from "../extensions/matrices";

/** @type {import("@minecraft/server").BlockCustomComponent} */
export const wireConnectableComponent = {
    onPlace: event => alterWireConnectionBlock(event.block, event.block.permutation, true),
    onPlayerDestroy: event => alterWireConnectionBlock(event.block, event.destroyedBlockPermutation, false)
};

/**
 * @param {Block} block 
 * @param {BlockPermutation} permutation 
 * @param {Boolean} placed 
 */
function alterWireConnectionBlock(block, permutation, placed) {
    const tag = permutation.getTags().find(tag => tag.startsWith("wire_connect"));
    const normal = strToDir(permutation.getState("minecraft:block_face"));
    const tnb = buildTNB(normal);

    const block_n  = block.offset(neg(tnb.w));
    const block_s  = block.offset(tnb.w);
    const block_e  = block.offset(tnb.u);
    const block_w  = block.offset(neg(tnb.u));
    const block_a  = block.offset(tnb.v);
    const block_na = block_n.offset(tnb.v);
    const block_sa = block_s.offset(tnb.v);
    const block_ea = block_e.offset(tnb.v);
    const block_wa = block_w.offset(tnb.v);
    const block_nb = block_n.offset(neg(tnb.v));
    const block_sb = block_s.offset(neg(tnb.v));
    const block_eb = block_e.offset(neg(tnb.v));
    const block_wb = block_w.offset(neg(tnb.v));

    // Adjacent & Corner Connections
    if (block_n.hasTag(tag)) {
        const block_n_normal = strToDir(block_n.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_n_normal)) {
            permutation = permutation.withState("onyx:north", placed);
            block_n.setPermutation(block_n.permutation.withState("onyx:south", placed));
        }
        if (equal(tnb.w, block_n_normal)) {
            permutation = permutation.withState("onyx:north", placed);
            const direction = dirToStr(transpose(buildTNB(block_n_normal)).mul(neg(tnb.v)));
            block_n.setPermutation(block_n.permutation.withState(`onyx:above_${direction}`, placed));
        }
    }

    if (block_s.hasTag(tag)) {
        const block_s_normal = strToDir(block_s.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_s_normal)) {
            permutation = permutation.withState("onyx:south", placed);
            block_s.setPermutation(block_s.permutation.withState("onyx:north", placed));
        }
        if (equal(neg(tnb.w), block_s_normal)) {
            permutation = permutation.withState("onyx:south", placed);
            const direction = dirToStr(transpose(buildTNB(block_s_normal)).mul(neg(tnb.v)));
            block_s.setPermutation(block_s.permutation.withState(`onyx:above_${direction}`, placed));
        }
    }

    if (block_e.hasTag(tag)) {
        const block_e_normal = strToDir(block_e.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_e_normal)) {
            permutation = permutation.withState("onyx:east", placed);
            block_e.setPermutation(block_e.permutation.withState("onyx:west", placed));
        }
        if (equal(neg(tnb.u), block_e_normal)) {
            permutation = permutation.withState("onyx:east", placed);
            const direction = dirToStr(transpose(buildTNB(block_e_normal)).mul(neg(tnb.v)));
            block_e.setPermutation(block_e.permutation.withState(`onyx:above_${direction}`, placed));
        }
    }

    if (block_w.hasTag(tag)) {
        const block_w_normal = strToDir(block_w.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_w_normal)) {
            permutation = permutation.withState("onyx:west", placed);
            block_w.setPermutation(block_w.permutation.withState("onyx:east", placed));
        }
        if (equal(tnb.u, block_w_normal)) {
            permutation = permutation.withState("onyx:west", placed);
            const direction = dirToStr(transpose(buildTNB(block_w_normal)).mul(neg(tnb.v)));
            block_w.setPermutation(block_w.permutation.withState(`onyx:above_${direction}`, placed));
        }
    }

    // Step Below & Edge Connections
    if (block_nb.hasTag(tag)) {
        const block_nb_normal = strToDir(block_nb.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_nb_normal)) {
            permutation = permutation.withState("onyx:north", placed);
            block_nb.setPermutation(block_nb.permutation.withState("onyx:above_south", placed));
        }
        if (block_n.isAir && equal(neg(tnb.w), block_nb_normal)) {
            permutation = permutation.withState("onyx:north", placed);
            const direction = dirToStr(transpose(buildTNB(block_nb_normal)).mul(tnb.v));
            block_nb.setPermutation(block_nb.permutation.withState(`onyx:${direction}`, placed));
        }
    }

    if (block_sb.hasTag(tag)) {
        const normal = strToDir(block_sb.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, normal)) {
            permutation = permutation.withState("onyx:south", placed);
            block_sb.setPermutation(block_sb.permutation.withState("onyx:above_north", placed));
        }
        if (block_s.isAir && equal(tnb.w, normal)) {
            permutation = permutation.withState("onyx:south", placed);
            const direction = dirToStr(transpose(buildTNB(normal)).mul(tnb.v));
            block_sb.setPermutation(block_sb.permutation.withState(`onyx:${direction}`, placed));
        }
    }

    if (block_eb.hasTag(tag)) {
        const normal = strToDir(block_eb.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, normal)) {
            permutation = permutation.withState("onyx:east", placed);
            block_eb.setPermutation(block_eb.permutation.withState("onyx:above_west", placed));
        }
        if (block_e.isAir && equal(tnb.u, normal)) {
            permutation = permutation.withState("onyx:east", placed);
            const direction = dirToStr(transpose(buildTNB(normal)).mul(tnb.v));
            block_eb.setPermutation(block_eb.permutation.withState(`onyx:${direction}`, placed));
        }
    }

    if (block_wb.hasTag(tag)) {
        const normal = strToDir(block_wb.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, normal)) {
            permutation = permutation.withState("onyx:west", placed);
            block_wb.setPermutation(block_wb.permutation.withState("onyx:above_east", placed));
        }
        if (block_w.isAir && equal(neg(tnb.u), normal)) {
            permutation = permutation.withState("onyx:west", placed);
            const direction = dirToStr(transpose(buildTNB(normal)).mul(tnb.v));
            block_wb.setPermutation(block_wb.permutation.withState(`onyx:${direction}`, placed));
        }
    }

    // Step Above Connections
    if (block_na.hasTag(tag)) {
        const block_na_normal = strToDir(block_na.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_na_normal)) {
            permutation = permutation.withState("onyx:above_north", placed);
            block_na.setPermutation(block_na.permutation.withState("onyx:south", placed));
        }
    }

    if (block_sa.hasTag(tag)) {
        const block_sa_normal = strToDir(block_sa.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_sa_normal)) {
            permutation = permutation.withState("onyx:above_south", placed);
            block_sa.setPermutation(block_sa.permutation.withState("onyx:north", placed));
        }
    }

    if (block_ea.hasTag(tag)) {
        const block_ea_normal = strToDir(block_ea.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_ea_normal)) {
            permutation = permutation.withState("onyx:above_east", placed);
            block_ea.setPermutation(block_ea.permutation.withState("onyx:west", placed));
        }
    }

    if (block_wa.hasTag(tag)) {
        const block_wa_normal = strToDir(block_wa.permutation.getState("minecraft:block_face"));
        if (equal(tnb.v, block_wa_normal)) {
            permutation = permutation.withState("onyx:above_west", placed);
            block_wa.setPermutation(block_wa.permutation.withState("onyx:east", placed));
        }
    }

    // Above Corner Connections
    if (block_a.hasTag(tag)) {
        const block_a_normal = strToDir(block_a.permutation.getState("minecraft:block_face"));
        if (equal(tnb.w, block_a_normal)) {
            permutation = permutation.withState("onyx:above_north", placed);
            const direction = dirToStr(transpose(buildTNB(block_a_normal)).mul(neg(tnb.v)));
            block_a.setPermutation(block_a.permutation.withState(`onyx:${direction}`, placed));
        }
        if (equal(neg(tnb.w), block_a_normal)) {
            permutation = permutation.withState("onyx:above_south", placed);
            const direction = dirToStr(transpose(buildTNB(block_a_normal)).mul(neg(tnb.v)));
            block_a.setPermutation(block_a.permutation.withState(`onyx:${direction}`, placed));
        }
        if (equal(neg(tnb.u), block_a_normal)) {
            permutation = permutation.withState("onyx:above_east", placed);
            const direction = dirToStr(transpose(buildTNB(block_a_normal)).mul(neg(tnb.v)));
            block_a.setPermutation(block_a.permutation.withState(`onyx:${direction}`, placed));
        }
        if (equal(tnb.u, block_a_normal)) {
            permutation = permutation.withState("onyx:above_west", placed);
            const direction = dirToStr(transpose(buildTNB(block_a_normal)).mul(neg(tnb.v)));
            block_a.setPermutation(block_a.permutation.withState(`onyx:${direction}`, placed));
        }
    }

    permutation = permutation.withState("onyx:placed", placed);
    if (placed) block.setPermutation(permutation);
}

world.afterEvents.blockExplode.subscribe(event => {
    if (event.explodedBlockPermutation.getTags().find(tag => tag.startsWith("wire_connect")))
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

    if (block_n.getTags().find(tag => tag.startsWith("wire_connect"))) {
        const permutation = block_n.permutation;
        if (permutation.getState("minecraft:block_face") == "north")
            system.run(() => alterWireConnectionBlock(block_n, permutation, false));
    }
    if (block_s.getTags().find(tag => tag.startsWith("wire_connect"))) {
        const permutation = block_s.permutation;
        if (permutation.getState("minecraft:block_face") == "south")
            system.run(() => alterWireConnectionBlock(block_s, permutation, false));
    }
    if (block_e.getTags().find(tag => tag.startsWith("wire_connect"))) {
        const permutation = block_e.permutation;
        if (permutation.getState("minecraft:block_face") == "east")
            system.run(() => alterWireConnectionBlock(block_e, permutation, false));
    }
    if (block_w.getTags().find(tag => tag.startsWith("wire_connect"))) {
        const permutation = block_w.permutation;
        if (permutation.getState("minecraft:block_face") == "west")
            system.run(() => alterWireConnectionBlock(block_w, permutation, false));
    }
    if (block_a.getTags().find(tag => tag.startsWith("wire_connect"))) {
        const permutation = block_a.permutation;
        if (permutation.getState("minecraft:block_face") == "up")
            system.run(() => alterWireConnectionBlock(block_a, permutation, false));
    }
    if (block_b.getTags().find(tag => tag.startsWith("wire_connect"))) {
        const permutation = block_b.permutation;
        if (permutation.getState("minecraft:block_face") == "down")
            system.run(() => alterWireConnectionBlock(block_b, permutation, false));
    }
});
