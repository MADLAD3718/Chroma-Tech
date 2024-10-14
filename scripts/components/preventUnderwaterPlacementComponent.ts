import { BlockCustomComponent } from "@minecraft/server";

export const preventUnderwaterPlacementComponent: BlockCustomComponent = {
    beforeOnPlayerPlace(event) {
        event.cancel = event.block.isLiquid;
    }
}
