import "@minecraft/server";

/** A record of boolean values for each block face. */
interface FaceRecord {
    /** The top face of a block. */
    readonly up: boolean,
    /** The bottom face of a block. */
    readonly down: boolean,
    /** The north face of a block. */
    readonly north: boolean,
    /** The south face of a block. */
    readonly south: boolean,
    /** The east face of a block. */
    readonly east: boolean,
    /** The west face of a block. */
    readonly west: boolean
}

declare module "@minecraft/server" {
    interface Block {
        /** The block's inventory. */
        readonly inventory?: BlockInventoryComponent;
        /** Get the currently supported faces on this block. */
        getSupportedFaces(): FaceRecord;
    }
}