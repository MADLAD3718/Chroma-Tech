import { BlockLocation, Location, Vector } from "@minecraft/server";

function getRelativeBlock(dimension, position, offsetX, offsetY, offsetZ) {
    return dimension.getBlock(new BlockLocation(position.x + offsetX, position.y + offsetY, position.z + offsetZ));
}

function getRayCastRelativeBlock(dimension, position, direction) {
    const location = new Location(position.x + 0.5 + Vector[direction].x, position.y + 0.7 + (Vector[direction].y * 0.8), position.z + 0.5 + Vector[direction].z);
    const rayCast = {
        includeLiquidBlocks: false,
        includePassableBlocks: false,
        maxDistance: 1        
    }
    const block = dimension.getBlockFromRay(location, Vector[direction], rayCast);
    if (block !== null) {
        const distanceFromCollision = Math.sqrt(Math.pow(block.location.x - position.x, 2) + Math.pow(block.location.y - position.y, 2) + Math.pow(block.location.z - position.z, 2));
        if (distanceFromCollision > 1) {
            return null;
        } else {
            return block;
        }
    } else {
        return block;
    }
}

let position;
let dimension;
let newBlockPerm;

export class FenceUpdater {
    constructor(dimensionInput, positionInput) {
        this.position = positionInput;
        this.dimension = dimensionInput;
        this.block = dimensionInput.getBlock(positionInput);
        this.updateAll();
    }
    updateAll() {
        position = this.position;
        dimension = this.dimension;
        newBlockPerm = this.block.permutation;
        this.normal.update();
        this.alt_corner.update();
        this.special.update();
        this.block.setPermutation(newBlockPerm);
    }
    special = {
        update: function () {
            const topBlock = getRelativeBlock(dimension, position, 0, 1, 0);
            const bottomBlock = getRelativeBlock(dimension, position, 0, -1, 0);
            if (
                (
                    !(newBlockPerm.getProperty("chroma_tech:north").value === 1 && newBlockPerm.getProperty("chroma_tech:south").value === 1)
                ) && (
                    !(newBlockPerm.getProperty("chroma_tech:east").value === 1 && newBlockPerm.getProperty("chroma_tech:west").value === 1)
                ) || (topBlock.hasTag('fence') || bottomBlock.hasTag('fence'))
            ) {
                newBlockPerm.getProperty("chroma_tech:mid").value = 0;
            } else {
                newBlockPerm.getProperty("chroma_tech:mid").value = 1;
            }
        }
    }
    normal = {
        update: function () {
            this.north();
            this.south();
            this.east();
            this.west();
        },
        north: function () {
            const northBlock = getRelativeBlock(dimension, position, 0, 0, -1);
            // Check to see if the block is an impassable block
            const northBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
            if ((northBlockCheck !== null || northBlock.hasTag('eastwest')) && !northBlock.hasTag('northsouth') && !northBlock.hasTag('rgb')) {
                newBlockPerm.getProperty("chroma_tech:north").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:north").value = 0;
            }
        },
        south: function () {
            const southBlock = getRelativeBlock(dimension, position, 0, 0, 1);
            const southBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
            if ((southBlockCheck !== null || southBlock.hasTag('eastwest')) && !southBlock.hasTag('northsouth') && !southBlock.hasTag('rgb')) {
                newBlockPerm.getProperty("chroma_tech:south").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:south").value = 0;
            }
        },
        east: function () {
            const eastBlock = getRelativeBlock(dimension, position, 1, 0, 0);
            const eastBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
            if ((eastBlockCheck !== null || eastBlock.hasTag('northsouth')) && !eastBlock.hasTag('eastwest') && !eastBlock.hasTag('rgb')) {
                newBlockPerm.getProperty("chroma_tech:east").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:east").value = 0;
            }
        },
        west: function () {
            const westBlock = getRelativeBlock(dimension, position, -1, 0, 0);
            const westBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
            if ((westBlockCheck !== null || westBlock.hasTag('northsouth')) && !westBlock.hasTag('eastwest') && !westBlock.hasTag('rgb')) {
                newBlockPerm.getProperty("chroma_tech:west").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:west").value = 0;
            }
        }
    }
    alt_corner = {
        update: function () {
            this.ne();
            this.se();
            this.nw();
            this.sw();
        },
        ne: function () {
            const eastBlock = getRelativeBlock(dimension, position, 1, 0, 0);
            if (eastBlock.hasTag('sw') &&
                (newBlockPerm.getProperty("chroma_tech:north").value === 1 && newBlockPerm.getProperty("chroma_tech:east").value === 1)
            ) {
                newBlockPerm.getProperty("chroma_tech:alt_ne_corner").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:alt_ne_corner").value = 0;
            }
        },
        se: function () {
            const southBlock = getRelativeBlock(dimension, position, 0, 0, 1);
            if (southBlock.hasTag('nw') &&
                (newBlockPerm.getProperty("chroma_tech:south").value === 1 && newBlockPerm.getProperty("chroma_tech:east").value === 1)
            ) {
                newBlockPerm.getProperty("chroma_tech:alt_se_corner").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:alt_se_corner").value = 0;
            }
        },
        nw: function () {
            const northBlock = getRelativeBlock(dimension, position, 0, 0, -1);
            if (northBlock.hasTag('se') &&
                (newBlockPerm.getProperty("chroma_tech:north").value === 1 && newBlockPerm.getProperty("chroma_tech:west").value === 1)
            ) {
                newBlockPerm.getProperty("chroma_tech:alt_nw_corner").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:alt_nw_corner").value = 0;
            }
        },
        sw: function () {
            const westBlock = getRelativeBlock(dimension, position, -1, 0, 0);
            if (westBlock.hasTag('ne') &&
                (newBlockPerm.getProperty("chroma_tech:south").value === 1 && newBlockPerm.getProperty("chroma_tech:west").value === 1)
            ) {
                newBlockPerm.getProperty("chroma_tech:alt_sw_corner").value = 1;
            } else {
                newBlockPerm.getProperty("chroma_tech:alt_sw_corner").value = 0;
            }
        }
    }
}