import { world } from "./world.js";

const camera = {
  x: 0,
  y: 0,
};

function updateCamera(player, canvas) {
  camera.x = player.x - canvas.width / 2 + player.height / 2;

  camera.y = player.y - canvas.height / 2 + player.height / 2;

  camera.x = Math.max(0, Math.min(camera.x, world.width - canvas.width));

  camera.y = Math.max(0, Math.min(camera.y, world.height - canvas.height));
}

export { camera, updateCamera };
