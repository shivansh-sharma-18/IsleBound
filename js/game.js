import { canvas, ctx } from "./canvas.js";
import { world, TILE_SIZE, terrainMap } from "./world.js";
import { drawTerrain } from "./terrain.js";
import { camera, updateCamera } from "./camera.js";
import { player, playerImage, playerGunImage } from "./player.js";
import { mouse } from "./input.js";
import { updatePlayerMovement } from "./movement.js";
import { drawTrees, drawRocks } from "./obstacles.js";
import { shoot, updateBullets, drawBullets } from "./weapons.js";

function update(dt) {
  updatePlayerMovement(dt);

  updateBullets(dt);

  updateCamera(player, canvas);

  const mouseWorldX = mouse.x + camera.x;
  const mouseWorldY = mouse.y + camera.y;

  const playerCenterX = player.x + player.width / 2;

  const playerCenterY = player.y + player.height / 2;

  player.aimAngle = Math.atan2(
    mouseWorldY - playerCenterY,
    mouseWorldX - playerCenterX,
  );

  if (player.shootCooldown > 0) {
    player.shootCooldown -= dt;
  }

  if (mouse.leftButtonDown && player.shootCooldown <= 0) {
    shoot(player, mouseWorldX, mouseWorldY);

    player.shootCooldown = player.shootDelay;
  }
}

function drawPlayer() {
  const screenX = player.x - camera.x;
  const screenY = player.y - camera.y;

  const currentImage = player.weapon === "gun" ? playerGunImage : playerImage;

  if (currentImage.complete && currentImage.naturalWidth > 0) {
    const drawX = screenX - (player.spriteWidth - player.width) / 2;

    const drawY = screenY - (player.spriteHeight - player.height);

    const centerX = drawX + player.spriteWidth / 2;

    const centerY = drawY + player.spriteHeight / 2;

    ctx.save();

    ctx.translate(centerX, centerY);

    ctx.rotate(player.aimAngle);

    ctx.drawImage(
      currentImage,
      -player.spriteWidth / 2,
      -player.spriteHeight / 2,
      player.spriteWidth,
      player.spriteHeight,
    );

    ctx.restore();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8fd3e6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawTerrain(ctx, canvas, camera);
  drawBullets(ctx, camera);
  drawPlayer();

  drawTrees(ctx, camera);
  drawRocks(ctx, camera);
}

export { update, draw };
