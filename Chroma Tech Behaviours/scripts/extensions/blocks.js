import { Block, BlockInventoryComponent } from "@minecraft/server";

Object.defineProperties(Block.prototype, {
    inventory: {
        get() {
            return this.getComponent(BlockInventoryComponent.componentId);
        }
    }
});

Block.prototype.getSupportedFaces = function () {
    if (this.isSolid || this.typeId.endsWith("glass") || this.typeId.endsWith("piston"))
        return Object.freeze({
            up: true,
            down: true,
            north: true,
            south: true,
            east: true,
            west: true
        });
    if (this.typeId.endsWith("stairs")) {
        const upside_down = this.permutation.getState("upside_down_bit");
        const direction = this.permutation.getState("weirdo_direction");
        return Object.freeze({
            up: upside_down,
            down: !upside_down,
            north: direction == 3,
            south: direction == 2,
            east: direction == 0,
            west: direction == 1
        });
    }
    if (this.typeId.endsWith("fence") || this.typeId.endsWith("glass_pane") || this.typeId.endsWith("wall") || this.typeId == "minecraft:iron_bars")
        return Object.freeze({
            up: true,
            down: true,
            north: false,
            south: false,
            east: false,
            west: false
        });
    if (this.typeId.includes("slab")) {
        const top = this.permutation.getState("minecraft:vertical_half") == "top";
        return Object.freeze({
            up: top,
            down: !top,
            north: false,
            south: false,
            east: false,
            west: false
        });
    }
    if (this.typeId.endsWith("trapdoor")) {
        const upside_down = this.permutation.getState("upside_down_bit");
        const open = this.permutation.getState("open_bit");
        const direction = this.permutation.getState("direction");
        return Object.freeze({
            up: !open && upside_down,
            down: !open && !upside_down,
            north: open && direction == 2,
            south: open && direction == 3,
            east: open && direction == 1,
            west: open && direction == 0
        });
    }
    if (this.typeId == "minecraft:composter")
        return Object.freeze({
            up: false,
            down: true,
            north: true,
            south: true,
            east: true,
            west: true
        });
    if (this.typeId == "minecraft:cauldron")
        return Object.freeze({
            up: false,
            down: false,
            north: true,
            south: true,
            east: true,
            west: true
        });
    return Object.freeze({
        up: false,
        down: false,
        north: false,
        south: false,
        east: false,
        west: false
    });
}