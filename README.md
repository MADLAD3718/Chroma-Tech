# Chroma-Tech
A Minecraft add-on implementing interconnecting RGB light strips to the game.

## Light Strips:
Light strips are implemented with similar connection logic to the redstone wiring system already present in game, but with the additional capability of connecting accross edges and corners from any possible placement orientation. Their block model consists of several separable flat extensions that are [toggled depending on connection state](./Chroma%20Tech%20Behaviours/blocks/light_strips/light_strip.json#L54). The connection logic takes advantage of linear algebra concepts in order to run [the same relative block testing function](./Chroma%20Tech%20Behaviours/scripts/light_strip.js#L10) on every light strip, where the basis is altered relative to the light strip's placement direction. Through this method the connection logic was heavily simplified versus the previous iteration, where different testing functions were used for the six different placement directions.

## Additional Blocks:
In addition to the light strips, I've implemented several extra blocks that recreate their respective Vanilla counterparts. [Doors](./Chroma%20Tech%20Behaviours/scripts/light_strip_door.js), [Fences](./Chroma%20Tech%20Behaviours/scripts/light_strip_fence.js), [Fence Gates](./Chroma%20Tech%20Behaviours/scripts/light_strip_fence_gate.js), and [Trapdoors](./Chroma%20Tech%20Behaviours/scripts/light_strip_trapdoor.js) are all included in the add-on. 

## Demo Video:
The following is a video created by user [markom58](https://www.youtube.com/@markom58) showcasing the creative capabilities **Chroma Tech** introduces.
[![](https://img.youtube.com/vi/_yqnv1WrxBY/maxresdefault.jpg)](http://www.youtube.com/watch?v=_yqnv1WrxBY)
