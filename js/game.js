import { canvas, ctx } from "./canvas.js";
import { world, TILE_SIZE, terrainMap } from "./world.js";
import { drawTerrain } from "./terrain.js";
import { camera, updateCamera } from "./camera.js";

function update(dt) {

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#8fd3e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawTerrain(ctx, canvas, camera);
}

export { update, draw };