import { canvas, ctx } from "./canvas.js";
import { drawTerrain } from "./terrain.js";
import { camera, updateCamera } from "./camera.js";
import { player, playerImage, playerGunImage } from "./player.js";
import { mouse, keys } from "./input.js";
import { updatePlayerMovement } from "./movement.js";
import { drawTrees, drawRocks } from "./obstacles.js";
import { bullets, shoot, updateBullets, drawBullets } from "./weapons.js";
import {
  drawEnemies,
  updateEnemies,
  damageEnemies,
  generateInitialEnemies,
} from "./enemies.js";
import {
  drawResources,
  collectResource,
  getNearbyResource,
  updateResources,
} from "./resources.js";
import { inventory, addResource } from "./inventory.js";
import { recipes, craft } from "./crafting.js";
import { craftBoat, drawBoat } from "./boat.js";

let craftingOpen = false;

function update(dt) {
  if (player.gameOver) {
    if (keys["r"]) {
      location.reload();
    }
    return;
  }

  if (keys["c"]) {
    craftingOpen = !craftingOpen;
    keys["c"] = false;
  }

  updatePlayerMovement(dt);
  updateResources(dt);

  if (keys["e"]) {
    const collectedResource = collectResource(player);
    if (collectedResource) {
      addResource(collectedResource.type, collectedResource.amount);
    }
    keys["e"] = false;
  }

  if (keys["b"]) {
    if (craftingOpen) {
      const crafted = craft(recipes.boat);
      if (crafted) {
        craftBoat();
      }
    }
    keys["b"] = false;
  }

  if (craftingOpen && mouse.clicked) {
    const buttonWidth = 180;
    const buttonHeight = 45;
    const menuWidth = 400;
    const menuHeight = 250;
    const menuY = (canvas.height - menuHeight) / 2;
    const buttonX = canvas.width / 2 - buttonWidth / 2;
    const buttonY = menuY + 185;

    const clickedInsideButton =
      mouse.x >= buttonX &&
      mouse.x <= buttonX + buttonWidth &&
      mouse.y >= buttonY &&
      mouse.y <= buttonY + buttonHeight;

    if (clickedInsideButton) {
      const crafted = craft(recipes.boat);
      if (crafted) {
        craftBoat();
      }
    }

    mouse.clicked = false;
  }

  updateEnemies(dt, player);
  updateBullets(dt);
  damageEnemies(bullets);

  if (player.health <= 0) {
    player.health = 0;
    player.gameOver = true;
  }

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

  if (!craftingOpen && mouse.leftButtonDown && player.shootCooldown <= 0) {
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

function drawHealthBar() {
  const barWidth = 200;
  const barHeight = 20;
  const x = 20;
  const y = 20;
  const healthPercentage = player.health / player.maxHealth;

  ctx.fillStyle = "#333";
  ctx.fillRect(x, y, barWidth, barHeight);

  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(x, y, barWidth * healthPercentage, barHeight);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, barWidth, barHeight);
}

function drawGameOver() {
  if (!player.gameOver) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 60px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

  ctx.font = "24px Arial";
  ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 50);

  ctx.textAlign = "left";
}

function drawInventory() {
  const x = 20;
  const y = 55;

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(x, y, 180, 70);

  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText(`Wood: ${inventory.wood}`, x + 15, y + 25);
  ctx.fillText(`Stone: ${inventory.stone}`, x + 15, y + 50);
}

function drawInteractionPrompt() {
  const resource = getNearbyResource(player);
  if (!resource) return;

  let resourceName = "";
  if (resource.type === "wood") resourceName = "Wood";
  if (resource.type === "stone") resourceName = "Stone";

  const text = `Press E to gather ${resourceName} (+${resource.amount})`;

  ctx.font = "18px Arial";
  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + 30;
  const boxHeight = 40;
  const x = (canvas.width - boxWidth) / 2;
  const y = canvas.height - 80;

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(x, y, boxWidth, boxHeight);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, y + boxHeight / 2);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function drawCraftingMenu() {
  if (!craftingOpen) return;

  const width = 400;
  const height = 250;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  const canCraftBoat =
    inventory.wood >= recipes.boat.wood &&
    inventory.stone >= recipes.boat.stone;

  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Crafting", canvas.width / 2, y + 45);

  ctx.font = "20px Arial";
  ctx.fillText("Boat", canvas.width / 2, y + 100);

  ctx.font = "18px Arial";
  ctx.fillText(`Wood: ${recipes.boat.wood}`, canvas.width / 2, y + 140);
  ctx.fillText(`Stone: ${recipes.boat.stone}`, canvas.width / 2, y + 170);

  const buttonWidth = 180;
  const buttonHeight = 45;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  const buttonY = y + 185;

  ctx.fillStyle = canCraftBoat ? "#2ecc71" : "#555";
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.strokeStyle = "#ffffff";
  ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText(
    canCraftBoat ? "Craft Boat" : "Not Enough Resources",
    canvas.width / 2,
    buttonY + 28,
  );

  ctx.textAlign = "left";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#8fd3e6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawTerrain(ctx, canvas, camera);
  drawBoat(ctx, camera);
  drawBullets(ctx, camera);
  drawPlayer();
  drawEnemies(ctx, camera);
  drawTrees(ctx, camera);
  drawRocks(ctx, camera);
  drawResources(ctx, camera);
  drawHealthBar();
  drawInventory();
  drawCraftingMenu();
  drawInteractionPrompt();
  drawGameOver();
}

generateInitialEnemies(player);

export { update, draw };
