# Chroma-Tech
A Minecraft add-on implementing interconnecting RGB light strips to the game.

## Light Strips:
Light strips are implemented with similar connection logic to the redstone wiring system already present in game, but with the additional capability of connecting accross edges and corners from any possible placement orientation. Their block model consists of several separable flat extensions that are [toggled depending on connection state](./Chroma%20Tech%20Behaviours/blocks/light_strips/light_strip.json#L54). The connection logic takes advantage of linear algebra concepts in order to run [the same relative block testing function](./Chroma%20Tech%20Behaviours/scripts/light_strip.js#L11) on every light strip, where an orthonormal basis is constructed from the light strip's facing directing and used to acquire and connect to the corresponding relative blocks. Through this method the connection logic is heavily simplified versus the previous iteration, where different connection functions were used for the six different placement directions.

## Additional Blocks:
In addition to the light strips, I've implemented several extra blocks that recreate their respective Vanilla counterparts. [Doors](./Chroma%20Tech%20Behaviours/scripts/light_strip_door.js), [Fences](./Chroma%20Tech%20Behaviours/scripts/light_strip_fence.js), [Fence Gates](./Chroma%20Tech%20Behaviours/scripts/light_strip_fence_gate.js), and [Trapdoors](./Chroma%20Tech%20Behaviours/scripts/light_strip_trapdoor.js) are all included in the add-on. 

## Demo Video:
The following is a video created by user [markom58](https://www.youtube.com/@markom58) showcasing the creative capabilities **Chroma Tech** introduces for Minecraft.
[![](https://img.youtube.com/vi/_yqnv1WrxBY/maxresdefault.jpg)](http://www.youtube.com/watch?v=_yqnv1WrxBY)
