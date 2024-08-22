import { BlockComponentPlayerPlaceBeforeEvent } from "@minecraft/server";

/** @type {import("@minecraft/server").BlockCustomComponent} */
export const preventUnderwaterPlacementComponent = {
    beforeOnPlayerPlace: filterUnderwaterPlacement
}

/**
 * @param {BlockComponentPlayerPlaceBeforeEvent} event 
 */
function filterUnderwaterPlacement(event) {
    event.cancel = event.block.isLiquid;
}
