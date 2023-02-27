import { BlockLocation, Location, Vector, MinecraftBlockTypes, ItemStack, Items, world, Dimension, Block } from "@minecraft/server";

/**
 * @param {Dimension} dimension 
 * @param {Location} position 
 * @param {Number} offsetX 
 * @param {Number} offsetY 
 * @param {Number} offsetZ 
 * @returns {Block}
 */
function getRelativeBlock(dimension, position, offsetX, offsetY, offsetZ) {
    return dimension.getBlock(new BlockLocation(position.x + offsetX, position.y + offsetY, position.z + offsetZ));
}

function getRayCastRelativeBlock(dimension, position, direction) {
    const location = new Location(position.x + 0.5 + Vector[direction].x, position.y + 0.5 + (Vector[direction].y * 0.8), position.z + 0.5 + Vector[direction].z);
    const rayCast = {
        includeLiquidBlocks: false,
        includePassableBlocks: false,
        maxDistance: 1        
    }
    const block = dimension.getBlockFromRay(location, Vector[direction], rayCast);
    if (block === null) return block;
    const distanceFromCollision = Math.sqrt(Math.pow(block.location.x - position.x, 2) + Math.pow(block.location.y - position.y, 2) + Math.pow(block.location.z - position.z, 2));
    if (distanceFromCollision > 1) return null;
    return block;
}

function createSound(soundID, blockPosition) {
    const soundOptions = {
        location: new Location(blockPosition.x + 0.5, blockPosition.y + 0.5, blockPosition.z + 0.5),
        pitch: 1.0,
        volume: 1.0        
    }
    world.playSound(soundID, soundOptions);
}

let newBlockPerm;
let dimension;
let position;
let breakBlock;

export class LightStripUpdater {
    constructor(dimensionInput, positionInput) {
        this.position = positionInput;
        this.dimension = dimensionInput;
        this.block = dimensionInput.getBlock(positionInput);
        this.updateAll();
    }
    updateAll() {
        breakBlock = false;
        position = this.position;
        dimension = this.dimension;
        newBlockPerm = this.block.permutation;
        switch (newBlockPerm.getProperty("chroma_tech:facing_direction").value) {
            case 0:
                this.ceiling.update(this.position);
                break;
            case 1:
                this.ground.update(this.position);
                break;
            case 2:
                this.north.update(this.position);
                break;
            case 3:
                this.south.update(this.position);
                break;
            case 4:
                this.west.update(this.position);
                break;
            case 5:
                this.east.update(this.position);
        }
        if (breakBlock === false) {
            this.block.setPermutation(newBlockPerm);
        } else {
            const specialLocation = new Location(position.x + 0.5, position.y + 0.5, position.z + 0.5)
            dimension.getBlock(position).setType(MinecraftBlockTypes.air);
            dimension.spawnItem(new ItemStack(Items.get(newBlockPerm.type.id)), specialLocation);
            createSound('dig.stone', specialLocation);
            createSound('lightstrip.break', specialLocation);
            // For every block around the event in particular
            const startPosition = new BlockLocation(position.x - 1, position.y - 1, position.z - 1)
            const endPosition = new BlockLocation(position.x + 1, position.y + 1, position.z + 1);
            for (const blockPosition of startPosition.blocksBetween(endPosition)) {
                if (dimension.getBlock(blockPosition).permutation.hasTag('light_strip')) new LightStripUpdater(dimension, blockPosition);
            }
        }
    }
    ground = {
        update: function () {
            if (getRelativeBlock(dimension, position, 0, -1, 0).typeId !== "minecraft:air" && getRelativeBlock(dimension, position, 0, -1, 0).typeId !== "minecraft:water") {
                this.topEdge.update();
                this.corner.update();
                this.adjacent.update();
            } else {
                breakBlock = true;
            }
        },
        topEdge: {
            update: function () {
                this.north();
                this.south();
                this.east();
                this.west();
            },
            north: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 1);
                // Make sure there is actually an open path to make the connection
                const northBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                if ((firstBlock.hasTag('south') || firstBlock.hasTag('floor')) && northBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 0;
                }
            },
            south: function () {
                const southTopEdgeBlock = getRelativeBlock(dimension, position, 0, -1, -1);
                const southBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                if ((southTopEdgeBlock.hasTag('north') || southTopEdgeBlock.hasTag('floor')) && southBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 0;
                }
            },
            east: function () {
                const eastTopEdgeBlock = getRelativeBlock(dimension, position, -1, -1, 0);
                const eastBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                if ((eastTopEdgeBlock.hasTag('west') || eastTopEdgeBlock.hasTag('floor')) && eastBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 0;
                }
            },
            west: function () {
                const westTopEdgeBlock = getRelativeBlock(dimension, position, 1, -1, 0);
                const westBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                if ((westTopEdgeBlock.hasTag('east') || westTopEdgeBlock.hasTag('floor')) && westBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 0;
                }
            }
        },
        corner: {
            update: function () {
                this.north();
                this.south();
                this.east();
                this.west();
            },
            north: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, 0, 1, 1);
                if (firstBlock.hasTag('north') || (secondBlock.hasTag('floor') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 0;
                }
            },
            south: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, 0, 1, -1);
                if (firstBlock.hasTag('south') || (secondBlock.hasTag('floor') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 0;
                }
            },
            east: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, -1, 1, 0);
                if (firstBlock.hasTag('east') || (secondBlock.hasTag('floor') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 0;
                }
            },
            west: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, 1, 1, 0);
                if (firstBlock.hasTag('west') || (secondBlock.hasTag('floor') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 0;
                }
            }
        },
        adjacent: {
            update: function () {
                this.north();
                this.south();
                this.east();
                this.west();
            },
            north: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                if (firstBlock.hasTag('floor') || firstBlock.hasTag('north') || newBlockPerm.getProperty("chroma_tech:topedge_north").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_north").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 0;
                }
            },
            south: function () {
                const southAdjacentBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                if (southAdjacentBlock.hasTag('floor') || southAdjacentBlock.hasTag('south') || newBlockPerm.getProperty("chroma_tech:topedge_south").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_south").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 0;
                }
            },
            east: function () {
                const eastAdjacentBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                if (eastAdjacentBlock.hasTag('floor') || eastAdjacentBlock.hasTag('east') || newBlockPerm.getProperty("chroma_tech:topedge_east").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_east").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 0;
                }
            },
            west: function () {
                const westAdjacentBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                if (westAdjacentBlock.hasTag('floor') || westAdjacentBlock.hasTag('west') || newBlockPerm.getProperty("chroma_tech:topedge_west").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_west").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 0;
                }
            }
        }
    }

    north = {
        update: function () {
            if (getRelativeBlock(dimension, position, 0, 0, 1).typeId !== "minecraft:air" && getRelativeBlock(dimension, position, 0, 0, 1).typeId !== "minecraft:water") {
                this.topEdge.update();
                this.corner.update();
                this.adjacent.update();
            } else {
                breakBlock = true;
            }
        },
        topEdge: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 1);
                const topBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                if (firstBlock.hasTag('north') && topBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 0;
                }
            },
            bottom: function () {
                const bottomTopedgeBlock = getRelativeBlock(dimension, position, 0, -1, 1);
                const bottomBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                if (bottomTopedgeBlock.hasTag('north') && bottomBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 0;
                }
            },
            left: function () {
                const leftTopedgeBlock = getRelativeBlock(dimension, position, 1, 0, 1);
                const leftBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                if (leftTopedgeBlock.hasTag('north') && leftBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 0;
                }
            },
            right: function () {
                const rightTopedgeBlock = getRelativeBlock(dimension, position, -1, 0, 1);
                const rightBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                if ((rightTopedgeBlock.hasTag('west') || rightTopedgeBlock.hasTag('north')) && rightBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 0;
                }
            }
        },
        corner: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                const secondBlock = getRelativeBlock(dimension, position, 0, 1, -1);
                if (firstBlock.hasTag('ceiling') || (secondBlock.hasTag('north') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                const secondBlock = getRelativeBlock(dimension, position, 0, -1, -1);
                if (firstBlock.hasTag('floor') || (secondBlock.hasTag('north') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, -1);
                if (firstBlock.hasTag('west') || (secondBlock.hasTag('north') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, -1);
                if (firstBlock.hasTag('east') || (secondBlock.hasTag('north') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 0;
                }
            }
        },
        adjacent: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, 0, -1, 1);
                if (firstBlock.hasTag('north') || firstBlock.hasTag('floor') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_north").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_north").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, 0, 1, 1);
                if (firstBlock.hasTag('north') || firstBlock.hasTag('ceiling') || (secondBlock.hasTag('floor') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_south").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_south").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, 1);
                if (firstBlock.hasTag('north') || firstBlock.hasTag('east') || (secondBlock.hasTag('west') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_west").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_west").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, 1);
                if (firstBlock.hasTag('north') || firstBlock.hasTag('west') || (secondBlock.hasTag('east') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_east").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_east").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 0;
                }
            }
        }
    }

    south = {
        update: function () {
            if (getRelativeBlock(dimension, position, 0, 0, -1).typeId !== "minecraft:air" && getRelativeBlock(dimension, position, 0, 0, -1).typeId !== "minecraft:water") {
                this.topEdge.update();
                this.corner.update();
                this.adjacent.update();
            } else {
                breakBlock = true;
            }
        },
        topEdge: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                if (firstBlock.hasTag('south') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 0;
                }
            },
            bottom: function () {
                const bottomTopedgeBlock = getRelativeBlock(dimension, position, 0, -1, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                if (bottomTopedgeBlock.hasTag('south') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 0;
                }
            },
            left: function () {
                const leftTopedgeBlock = getRelativeBlock(dimension, position, 1, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                if ((leftTopedgeBlock.hasTag('south') || leftTopedgeBlock.hasTag('east')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 0;
                }
            },
            right: function () {
                const leftTopedgeBlock = getRelativeBlock(dimension, position, -1, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                if (leftTopedgeBlock.hasTag('south') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 0;
                }
            }
        },
        corner: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                const secondBlock = getRelativeBlock(dimension, position, 0, 1, 1);
                if (firstBlock.hasTag('ceiling') || (secondBlock.hasTag('south') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                const secondBlock = getRelativeBlock(dimension, position, 0, -1, 1);
                if (firstBlock.hasTag('floor') || (secondBlock.hasTag('south') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, 1);
                if (firstBlock.hasTag('west') || (secondBlock.hasTag('south') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, 1);
                if (firstBlock.hasTag('east') || (secondBlock.hasTag('south') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 0;
                }
            }
        },
        adjacent: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, 0, -1, -1);
                if (firstBlock.hasTag('south') || firstBlock.hasTag('floor') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_north").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_north").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, 0, 1, -1);
                if (firstBlock.hasTag('south') || firstBlock.hasTag('ceiling') || (secondBlock.hasTag('floor') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_south").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_south").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, -1);
                if (firstBlock.hasTag('south') || firstBlock.hasTag('west') || (secondBlock.hasTag('east') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_west").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_west").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, -1);
                if (firstBlock.hasTag('south') || firstBlock.hasTag('east') || (secondBlock.hasTag('west') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_east").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_east").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 0;
                }
            }
        }
    }

    west = {
        update: function () {
            if (getRelativeBlock(dimension, position, 1, 0, 0).typeId !== "minecraft:air" && getRelativeBlock(dimension, position, 1, 0, 0).typeId !== "minecraft:water") {
                this.topEdge.update();
                this.corner.update();
                this.adjacent.update();
            } else {
                breakBlock = true;
            }
        },
        topEdge: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                if (firstBlock.hasTag('west') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                if (firstBlock.hasTag('west') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                if ((firstBlock.hasTag('west') || firstBlock.hasTag('south')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                if (firstBlock.hasTag('west') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 0;
                }
            }
        },
        corner: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                const secondBlock = getRelativeBlock(dimension, position, -1, 1, 0);
                if (firstBlock.hasTag('ceiling') || (secondBlock.hasTag('west') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                const secondBlock = getRelativeBlock(dimension, position, -1, -1, 0);
                if (firstBlock.hasTag('floor') || (secondBlock.hasTag('west') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, 1);
                if (firstBlock.hasTag('north') || (secondBlock.hasTag('west') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, -1);
                if (firstBlock.hasTag('south') || (secondBlock.hasTag('west') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 0;
                }
            }
        },
        adjacent: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, 1, -1, 0);
                if (firstBlock.hasTag('west') || firstBlock.hasTag('floor') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_north").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_north").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, 1, 1, 0);
                if (firstBlock.hasTag('west') || firstBlock.hasTag('ceiling') || (secondBlock.hasTag('floor') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_south").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_south").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, 1);
                if (firstBlock.hasTag('west') || firstBlock.hasTag('north') || (secondBlock.hasTag('south') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_west").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_west").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, -1);
                if (firstBlock.hasTag('west') || firstBlock.hasTag('south') || (secondBlock.hasTag('north') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_east").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_east").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 0;
                }
            }
        }
    }

    east = {
        update: function () {
            if (getRelativeBlock(dimension, position, -1, 0, 0).typeId !== "minecraft:air" && getRelativeBlock(dimension, position, -1, 0, 0).typeId !== "minecraft:water") {
                this.topEdge.update();
                this.corner.update();
                this.adjacent.update();
            } else {
                breakBlock = true;
            }
        },
        topEdge: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                if (firstBlock.hasTag('east') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                if (firstBlock.hasTag('east') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                if ((firstBlock.hasTag('east') || firstBlock.hasTag('north')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                if (firstBlock.hasTag('east') && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 0;
                }
            }
        },
        corner: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                const secondBlock = getRelativeBlock(dimension, position, 1, 1, 0);
                if (firstBlock.hasTag('ceiling') || (secondBlock.hasTag('east') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                const secondBlock = getRelativeBlock(dimension, position, 1, -1, 0);
                if (firstBlock.hasTag('floor') || (secondBlock.hasTag('east') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, -1);
                if (firstBlock.hasTag('south') || (secondBlock.hasTag('east') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                const secondBlock = getRelativeBlock(dimension, position, 1, 0, 1);
                if (firstBlock.hasTag('north') || (secondBlock.hasTag('east') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 0;
                }
            }
        },
        adjacent: {
            update: function () {
                this.top();
                this.bottom();
                this.left();
                this.right();
            },
            top: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, -1, -1, 0);
                if (firstBlock.hasTag('east') || firstBlock.hasTag('floor') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_north").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_north").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 0;
                }
            },
            bottom: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'up');
                const secondBlock = getRelativeBlock(dimension, position, -1, 1, 0);
                if (firstBlock.hasTag('east') || firstBlock.hasTag('ceiling') || (secondBlock.hasTag('floor') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_south").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_south").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 0;
                }
            },
            left: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, -1);
                if (firstBlock.hasTag('east') || firstBlock.hasTag('south') || (secondBlock.hasTag('north') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_west").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_west").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 0;
                }
            },
            right: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                const secondBlock = getRelativeBlock(dimension, position, -1, 0, 1);
                if (firstBlock.hasTag('east') || firstBlock.hasTag('north') || (secondBlock.hasTag('south') && firstBlockCheck === null) || newBlockPerm.getProperty("chroma_tech:topedge_east").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_east").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 0;
                }
            }
        }
    }

    ceiling = {
        update: function () {
            if (getRelativeBlock(dimension, position, 0, 1, 0).typeId !== "minecraft:air" && getRelativeBlock(dimension, position, 0, 1, 0).typeId !== "minecraft:water") {
                this.topEdge.update();
                this.corner.update();
                this.adjacent.update();
            } else {
                breakBlock = true;
            }
        },
        topEdge: {
            update: function () {
                this.north();
                this.south();
                this.east();
                this.west();
            },
            north: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, -1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'back');
                if ((firstBlock.hasTag('north') || firstBlock.hasTag('ceiling')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_north").value = 0;
                }
            },
            south: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 1, 1);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'forward');
                if ((firstBlock.hasTag('south') || firstBlock.hasTag('ceiling')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_south").value = 0;
                }
            },
            east: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'left');
                if ((firstBlock.hasTag('west') || firstBlock.hasTag('ceiling')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_east").value = 0;
                }
            },
            west: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'right');
                if ((firstBlock.hasTag('east') || firstBlock.hasTag('ceiling')) && firstBlockCheck === null) {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:topedge_west").value = 0;
                }
            }
        },
        corner: {
            update: function () {
                this.north();
                this.south();
                this.east();
                this.west();
            },
            north: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, 0, -1, 1);
                if (firstBlock.hasTag('north') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_south").value = 0;
                }
            },
            south: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, 0, -1, -1);
                if (firstBlock.hasTag('south') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_north").value = 0;
                }
            },
            east: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, -1, -1, 0);
                if (firstBlock.hasTag('east') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_east").value = 0;
                }
            },
            west: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, -1, 0);
                const firstBlockCheck = getRayCastRelativeBlock(dimension, position, 'down');
                const secondBlock = getRelativeBlock(dimension, position, 1, -1, 0);
                if (firstBlock.hasTag('west') || (secondBlock.hasTag('ceiling') && firstBlockCheck === null)) {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:corner_west").value = 0;
                }
            }
        },
        adjacent: {
            update: function () {
                this.north();
                this.south();
                this.east();
                this.west();
            },
            north: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, -1);
                if (firstBlock.hasTag('ceiling') || firstBlock.hasTag('south') || newBlockPerm.getProperty("chroma_tech:topedge_north").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_north").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_north").value = 0;
                }
            },
            south: function () {
                const firstBlock = getRelativeBlock(dimension, position, 0, 0, 1);
                if (firstBlock.hasTag('ceiling') || firstBlock.hasTag('north') || newBlockPerm.getProperty("chroma_tech:topedge_south").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_south").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_south").value = 0;
                }
            },
            east: function () {
                const firstBlock = getRelativeBlock(dimension, position, -1, 0, 0);
                if (firstBlock.hasTag('ceiling') || firstBlock.hasTag('east') || newBlockPerm.getProperty("chroma_tech:topedge_east").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_east").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_east").value = 0;
                }
            },
            west: function () {
                const firstBlock = getRelativeBlock(dimension, position, 1, 0, 0);
                if (firstBlock.hasTag('ceiling') || firstBlock.hasTag('west') || newBlockPerm.getProperty("chroma_tech:topedge_west").value === 1 || newBlockPerm.getProperty("chroma_tech:corner_west").value === 1) {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 1;
                } else {
                    newBlockPerm.getProperty("chroma_tech:adjacent_west").value = 0;
                }
            }
        }
    }
}