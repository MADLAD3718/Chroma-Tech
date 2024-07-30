import { world } from "@minecraft/server";
import { doorComponent } from "./components/doorComponent";
import { fenceComponent } from "./components/fenceComponent";
import { trapdoorComponent } from "./components/trapdoorComponent";
import { fenceGateComponent } from "./components/fenceGateComponent";
import { wireConnectableComponent } from "./components/wireConnectableComponent";
import { preventUnderwaterPlacementComponent } from "./components/preventUnderwaterPlacementComponent";

world.beforeEvents.worldInitialize.subscribe(({blockComponentRegistry}) => {
    blockComponentRegistry.registerCustomComponent("onyx:door", doorComponent);
    blockComponentRegistry.registerCustomComponent("onyx:fence", fenceComponent);
    blockComponentRegistry.registerCustomComponent("onyx:trapdoor", trapdoorComponent);
    blockComponentRegistry.registerCustomComponent("onyx:fence_gate", fenceGateComponent);
    blockComponentRegistry.registerCustomComponent("onyx:connectable_wire", wireConnectableComponent);
    blockComponentRegistry.registerCustomComponent("onyx:prevent_underwater_placement", preventUnderwaterPlacementComponent);
});
