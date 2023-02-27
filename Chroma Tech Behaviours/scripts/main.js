import { world, BlockLocation, Location, BlockPistonComponent, Direction, PistonActivateEvent } from "@minecraft/server";
import { FenceUpdater } from "./updateFence";
import { LightStripUpdater } from "./updateLightStrip";
import { DoorHandler } from "./doorHandler";

class Main {
    constructor() {
        this.initialize();
    }
    //--------------SETUP EVENTS--------------//
    initialize() {
        this.initializeBeforeBlockPlace();
        this.initializeBlockPlace();
        this.initializeBlockBreak();
        this.initializeItemUseOn();
        this.initializeBeforeItemUseOn();
        this.initializePistonPush();
        this.initializeExplode();
    }
    initializeBeforeBlockPlace() {
        world.events.beforeItemUseOn.subscribe(event => {
            if (event.item.typeId.startsWith("chroma_tech:") === false) return;
            const blockLocation = new BlockLocation(event.blockLocation.x, event.blockLocation.y, event.blockLocation.z);
            switch (event.blockFace) {
                case (Direction.up):
                    blockLocation.y++;
                    break;
                case (Direction.down):
                    blockLocation.y--;
                    break;
                case (Direction.north):
                    blockLocation.z--;
                    break;
                case (Direction.south):
                    blockLocation.z++;
                    break;
                case (Direction.east):
                    blockLocation.x++;
                    break;
                case (Direction.west):
                    blockLocation.x--;
            }
            if (blockLocation.y < -64 || blockLocation.y > 319) return;
            if (event.source.dimension.getBlock(blockLocation).typeId === "minecraft:water" || event.source.dimension.getBlock(event.blockLocation).typeId === "minecraft:kelp" || event.source.dimension.getBlock(event.blockLocation).typeId === "minecraft:water") event.cancel = true;
        })
    }
    initializeBlockPlace() {
        world.events.blockPlace.subscribe(event => {
            // Play buzz part of place sound
            if (event.block.hasTag('lightstrip_sound')) {
                this.createSound('lightstrip.place', event.block.location);
            }
            // Move this to doorhandler after it is complete
            if (event.block.hasTag('lightstrip_door')) {
                const currentPermutation = event.block.permutation;
                const aboveBlock = event.dimension.getBlock(new BlockLocation(event.block.location.x, event.block.location.y + 1, event.block.location.z));
                const abovePermutation = event.block.permutation;
                abovePermutation.getProperty('chroma_tech:piece').value = 1;
                let leftBlock;
                switch (currentPermutation.getProperty('chroma_tech:direction').value) {
                    case 0:
                        leftBlock = this.getRelativeBlock(event.dimension, event.block.location, -1, 0, 0);
                        break;
                    case 1:
                        leftBlock = this.getRelativeBlock(event.dimension, event.block.location, 1, 0, 0);
                        break;
                    case 2:
                        leftBlock = this.getRelativeBlock(event.dimension, event.block.location, 0, 0, 1);
                        break;
                    case 3:
                        leftBlock = this.getRelativeBlock(event.dimension, event.block.location, 0, 0, -1);
                }
                if (leftBlock.hasTag('lightstrip_door') && leftBlock.permutation.getProperty('chroma_tech:piece').value === 0) {
                    currentPermutation.getProperty('chroma_tech:reversed').value = 1;
                    abovePermutation.getProperty('chroma_tech:reversed').value = 1;
                }
                event.block.setPermutation(currentPermutation);
                aboveBlock.setPermutation(abovePermutation);
            }
            this.updateNeighbouringBlocks(event.dimension, event.block.location);
        });
    }
    initializeBlockBreak() {
        world.events.blockBreak.subscribe((event) => {
            if (event.brokenBlockPermutation.hasTag('lightstrip_door')) {
                DoorHandler.removeOtherDoorPieces(event);
            }
            if (event.block.location.y < 319 && this.getRelativeBlock(event.dimension, event.block.location, 0, 1, 0).hasTag('lightstrip_door')) {
                DoorHandler.breakDoorFromBottom(event);
            }
            // Play buzz part of break sound
            if (event.brokenBlockPermutation.hasTag('lightstrip_sound')) {
                this.createSound('lightstrip.break', event.block.location);
            }
            this.updateNeighbouringBlocks(event.dimension, event.block.location);
        });
    }
    initializeItemUseOn() {
        world.events.itemUseOn.subscribe(event => {
            const eventBlock = event.source.dimension.getBlock(event.blockLocation);
            // Play interact sound
            if ((eventBlock.hasTag('lightstrip_door') || eventBlock.hasTag('lightstrip_fence_gate') || eventBlock.hasTag('lightstrip_trapdoor')) && (!event.source.isSneaking || event.item.typeId === '')) {
                this.createSound('random.door_close', event.blockLocation);
            }
            // Handle Door behaviours
            if (eventBlock.hasTag('lightstrip_door') && (!event.source.isSneaking || event.item.typeId === '')) {
                DoorHandler.toggleDoor(event);
            }
        });
    }
    initializeBeforeItemUseOn() {
        world.events.beforeItemUseOn.subscribe((event) => {
            DoorHandler.doorPlace(event);
        });
    }
    initializePistonPush() {
        world.events.pistonActivate.subscribe(event => this.blockPush(event));
    }

    /**
     * @param {PistonActivateEvent} event 
     */
    async blockPush(event) {
        const isExpanding = event.isExpanding;
        const piston = event.piston;
        const attachedBlocks = event.piston.attachedBlocks;
        const dimension = event.dimension;
        const block = event.block;
        await this.pistonStop(piston);
        for (const blockLocation of attachedBlocks) {
            const finalLocation = new BlockLocation(blockLocation.x, blockLocation.y, blockLocation.z);
            switch (block.permutation.getProperty('facing_direction').value) {
                case 'south':
                    isExpanding ? finalLocation.z-- : finalLocation.z++;
                    break;
                case 'north':
                    isExpanding ? finalLocation.z++ : finalLocation.z--;
                    break;
                case 'west':
                    isExpanding ? finalLocation.x++ : finalLocation.x--;
                    break;
                case 'east':
                    isExpanding ? finalLocation.x-- : finalLocation.x++;
                    break;
                case 'up':
                    isExpanding ? finalLocation.y++ : finalLocation.y--;
                    break;
                case 'down':
                    isExpanding ? finalLocation.y-- : finalLocation.y++;
            }
            this.updateNeighbouringBlocks(dimension, blockLocation);
            this.updateNeighbouringBlocks(dimension, finalLocation);
        }
    }

    /**
    * Returns a promise that resolves after a given piston has stopped moving.
    * @param {BlockPistonComponent} piston The block piston component to wait for movement to complete.
    */
    pistonStop(piston) {
        return new Promise(resolve => {
            const tickCallBack = world.events.tick.subscribe(() => {
                if (piston?.isMoving ?? false === true) return;
                world.events.tick.unsubscribe(tickCallBack);
                resolve();
            })
        })
    }

    initializeExplode() {
        world.events.blockExplode.subscribe(event => this.updateNeighbouringBlocks(event.dimension, event.block.location));
    }

    //-------------BLOCK UPDATING-------------//
    updateNeighbouringBlocks(dimension, location) {
        // For every block around the event in particular
        const startPosition = new BlockLocation(location.x - 1, location.y - 1, location.z - 1)
        const endPosition = new BlockLocation(location.x + 1, location.y + 1, location.z + 1);
        const blockPositions = startPosition.blocksBetween(endPosition);
        for (const position of blockPositions) {
            if (position.y < -64 || position.y > 319) continue;
            if (dimension.getBlock(position).permutation.hasTag('light_strip'))
                new LightStripUpdater(dimension, position);
            if (dimension.getBlock(position).hasTag('light_strip_fence'))
                new FenceUpdater(dimension, position);
        }
    }

    //-------------BLOCK CHECKING-------------//
    getRelativeBlock(dimension, position, offsetX, offsetY, offsetZ) {
        return dimension.getBlock(new BlockLocation(position.x + offsetX, position.y + offsetY, position.z + offsetZ));
    }

    //-----------------SOUNDS-----------------//
    createSound(soundID, blockPosition) {
        const soundOptions = {
            location: new Location(blockPosition.x + 0.5, blockPosition.y + 0.5, blockPosition.z + 0.5),
            pitch: 1.0,
            volume: 1.0
        }
        world.playSound(soundID, soundOptions);
    }
}

new Main();