import { BlockLocation, MinecraftBlockTypes, ItemStack, Items, Location, world, GameMode } from "@minecraft/server";

export class DoorHandler {
    static removeOtherDoorPieces(event) {
        // Remove the other door piece when one is broken
        if (event.brokenBlockPermutation.getProperty('chroma_tech:piece').value === 1 && !this.playerIsInCreative(event.player)) {
            event.dimension.spawnItem(new ItemStack(Items.get(event.brokenBlockPermutation.type.id)), new Location(event.block.location.x + 0.5, event.block.location.y - 0.5, event.block.location.z + 0.5));
        }
        const aboveBlock = this.getRelativeBlock(event.dimension, event.block.location, 0, 1, 0);
        const belowBlock = this.getRelativeBlock(event.dimension, event.block.location, 0, -1, 0);
        if (aboveBlock.hasTag('lightstrip_door') && event.brokenBlockPermutation.getProperty("chroma_tech:piece").value === 0) {
            aboveBlock.setType(MinecraftBlockTypes.air);
        } else if (belowBlock.hasTag('lightstrip_door') && event.brokenBlockPermutation.getProperty("chroma_tech:piece").value === 1) {
            belowBlock.setType(MinecraftBlockTypes.air);
        }
    }
    static toggleDoor(event) {
        // If one door part is opened/closed then update the other as well
        const eventBlock = event.source.dimension.getBlock(event.blockLocation);
        let otherPieceBlock;
        if (eventBlock.permutation.getProperty("chroma_tech:piece").value === 0) {
            otherPieceBlock = event.source.dimension.getBlock(new BlockLocation(eventBlock.location.x, eventBlock.location.y + 1, eventBlock.location.z));
        } else {
            otherPieceBlock = event.source.dimension.getBlock(new BlockLocation(eventBlock.location.x, eventBlock.location.y - 1, eventBlock.location.z));
        }
        const newPerm = otherPieceBlock.permutation;
        newPerm.getProperty("chroma_tech:open").value === 0 ? newPerm.getProperty("chroma_tech:open").value = 1 : newPerm.getProperty("chroma_tech:open").value = 0;
        otherPieceBlock.setPermutation(newPerm);
    }
    static breakDoorFromBottom(event) {
        // Only one of the door block parts drops an item, so spawn an item on the other one if it is broken instead
        const specialLocation = new Location(event.block.location.x + 0.5, event.block.location.y + 1.5, event.block.location.z + 0.5);
        event.dimension.spawnItem(new ItemStack(Items.get(this.getRelativeBlock(event.dimension, event.block.location, 0, 1, 0).type.id)), specialLocation);
        this.getRelativeBlock(event.dimension, event.block.location, 0, 1, 0).setType(MinecraftBlockTypes.air);
        this.getRelativeBlock(event.dimension, event.block.location, 0, 2, 0).setType(MinecraftBlockTypes.air);
        this.createSound('dig.stone', specialLocation);
        this.createSound('lightstrip.break', specialLocation);
    }
    static doorPlace(event) {
        // Prevent player from placing doors in incompatible places
        if (event.item.typeId.includes('light_strip_door') && !event.source.dimension.getBlock(event.blockLocation).hasTag('lightstrip_door')) {
            let aboveBlock;
            let belowBlock;
            switch (event.blockFace) {
                case 0:
                    aboveBlock = event.source.dimension.getBlock(event.blockLocation);
                    belowBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, -2, 0);
                    break;
                case 1:
                    aboveBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, 2, 0);
                    belowBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, 0, 0);
                    break;
                case 2:
                    aboveBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, 1, -1);
                    belowBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, -1, -1);
                    break;
                case 3:
                    aboveBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, 1, 1);
                    belowBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 0, -1, 1);
                    break;
                case 4:
                    aboveBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, -1, 1, 0);
                    belowBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, -1, -1, 0);
                    break;
                case 5:
                    aboveBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 1, 1, 0);
                    belowBlock = this.getRelativeBlock(event.source.dimension, event.blockLocation, 1, -1, 0);
            }
            if (aboveBlock?.isEmpty === false || belowBlock?.isEmpty === true) {
                event.cancel = true;
            }
        }
    }

    //-------------BLOCK CHECKING-------------//
    static getRelativeBlock(dimension, position, offsetX, offsetY, offsetZ) {
        return dimension.getBlock(new BlockLocation(position.x + offsetX, position.y + offsetY, position.z + offsetZ));
    }

    //-----------------TESTS------------------//
    static playerIsInCreative(player) {
        const queryOptions = {};
        queryOptions.closest = 1;
        queryOptions.location = player.location;
        queryOptions.gameMode = GameMode.creative;
        for (const foundPlayer of player.dimension.getPlayers(queryOptions)) {
            return true;
        }
        return false;
    }

    //-----------------SOUNDS-----------------//
    static createSound(soundID, blockPosition) {
        const soundOptions = {
            location: new Location(blockPosition.x + 0.5, blockPosition.y + 0.5, blockPosition.z + 0.5),
            pitch: 1.0,
            volume: 1.0
        }
        world.playSound(soundID, soundOptions);
    }
}