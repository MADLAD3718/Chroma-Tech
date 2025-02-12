import { world } from "@minecraft/server";
import { doorComponent } from "./components/doorComponent";
import { fenceComponent } from "./components/fenceComponent";
import { trapdoorComponent } from "./components/trapdoorComponent";
import { fenceGateComponent } from "./components/fenceGateComponent";
import { wireConnectableComponent } from "./components/wireConnectableComponent";

world.beforeEvents.worldInitialize.subscribe(({blockComponentRegistry}) => {
    blockComponentRegistry.registerCustomComponent("chroma_tech:door", doorComponent);
    blockComponentRegistry.registerCustomComponent("chroma_tech:fence", fenceComponent);
    blockComponentRegistry.registerCustomComponent("chroma_tech:trapdoor", trapdoorComponent);
    blockComponentRegistry.registerCustomComponent("chroma_tech:fence_gate", fenceGateComponent);
    blockComponentRegistry.registerCustomComponent("chroma_tech:connectable_wire", wireConnectableComponent);
});
