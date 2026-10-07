import { canvas, ctx } from "./canvas.js";
import { drawTerrain } from "./terrain.js";
import { camera, updateCamera } from "./camera.js";
import {
  player,
  playerImage,
  playerGunImage,
  playerMachineGunImage,
  resetPlayer,
} from "./player.js";
import { mouse, keys } from "./input.js";
import { updatePlayerMovement } from "./movement.js";
import { drawTrees, drawRocks } from "./obstacles.js";
import {
  bullets,
  shoot,
  updateBullets,
  drawBullets,
  resetBullets,
} from "./weapons.js";
import {
  drawEnemies,
  updateEnemies,
  damageEnemies,
  generateInitialEnemies,
  resetEnemies,
  spawnBoss,
  spawnReinforcementEnemy,
  isBossAlive,
  getIsland3RegularKills,
  getPlayerHitFlash,
} from "./enemies.js";
import {
  drawResources,
  collectResource,
  getNearbyResource,
  updateResources,
  resetResources,
} from "./resources.js";
import { inventory, addResource, resetInventory } from "./inventory.js";
import { getBoatRecipe, canCraft, craft } from "./crafting.js";
import { craftBoat, drawBoat, isNearBoat, resetBoat, isBoatCrafted } from "./boat.js";
import {
  islandCompleted,
  completeIsland,
  resetIslandCompletion,
  triggerVictory,
  isGameWon,
  drawIslandComplete,
} from "./islandComplete.js";
import {
  moveToNextIsland,
  isFinalIsland,
  getCurrentIsland,
} from "./islandManager.js";
import {
  recordResourceCollected,
  recordDeath,
  recordIslandCompleted,
  setCurrentIsland,
  addPlayTime,
} from "./stats.js";

let craftingOpen = false;
let gamePaused = false;

function setPaused(paused) {
  gamePaused = paused;
  const pauseScreen = document.getElementById("pauseScreen");
  if (pauseScreen) {
    if (gamePaused) {
      pauseScreen.classList.remove("hidden");
    } else {
      pauseScreen.classList.add("hidden");
    }
  }
}

function isPaused() {
  return gamePaused;
}

let bossCountdown = 45.0;
let bossSpawned = false;
let bossDefeated = false;
let reinforcementTimer = 0;
let machineGunUnlocked = false;
let machineGunBannerTimer = 0;
let victoryTransitionTimer = 0;

function resetCurrentIsland() {
  resetPlayer();
  resetResources();
  resetEnemies(player);
  resetBullets();
  resetBoat();
  resetIslandCompletion();
  craftingOpen = false;
  bossCountdown = 45.0;
  bossSpawned = false;
  bossDefeated = false;
  reinforcementTimer = 0;
  machineGunUnlocked = false;
  machineGunBannerTimer = 0;
  victoryTransitionTimer = 0;
  const deathScreen = document.getElementById("deathScreen");
  if (deathScreen) {
    deathScreen.classList.add("hidden");
  }
}

function update(dt) {
  if (isGameWon()) {
    if (keys["r"]) {
      sessionStorage.setItem("autoPlay", "true");
      location.reload();
    }
    return;
  }

  if (islandCompleted) {
    if (keys["e"]) {
      if (!isFinalIsland()) {
        const movedToNextIsland = moveToNextIsland();

        if (movedToNextIsland) {
          setCurrentIsland(getCurrentIsland());
          resetCurrentIsland();
        }
      }

      keys["e"] = false;
    }

    return;
  }

  if (player.gameOver) {
    if (keys["r"]) {
      sessionStorage.setItem("autoPlay", "true");
      location.reload();
    }

    return;
  }

  if (keys["c"]) {
    craftingOpen = !craftingOpen;
    keys["c"] = false;
  }

  if (keys["p"]) {
    if (!player.gameOver && !isGameWon()) {
      const controlsScreen = document.getElementById("controlsScreen");
      if (controlsScreen && !controlsScreen.classList.contains("hidden")) {
        controlsScreen.classList.add("hidden");
        setPaused(false);
      } else {
        setPaused(!gamePaused);
      }
    }
    keys["p"] = false;
  }

  if (gamePaused) {
    return;
  }

  addPlayTime(dt);

  updatePlayerMovement(dt);
  updateResources(dt);

  if (getCurrentIsland() === 3) {
    if (!bossSpawned) {
      bossCountdown -= dt;
      if (bossCountdown <= 0) {
        bossCountdown = 0;
        bossSpawned = true;
        spawnBoss(player);
      }
    } else if (!bossDefeated) {
      if (isBossAlive()) {
        reinforcementTimer += dt;
        if (reinforcementTimer >= 4.0) {
          reinforcementTimer = 0;
          spawnReinforcementEnemy(player);
        }
      } else {
        bossDefeated = true;
        victoryTransitionTimer = 2.0;
      }
    }

    if (!machineGunUnlocked) {
      if (getIsland3RegularKills() >= 20) {
        machineGunUnlocked = true;
        player.weapon = "machineGun";
        player.shootDelay = 0.08;
        machineGunBannerTimer = 3.5;
      }
    }

    if (machineGunBannerTimer > 0) {
      machineGunBannerTimer -= dt;
    }

    if (bossDefeated && !isGameWon()) {
      victoryTransitionTimer -= dt;
      if (victoryTransitionTimer <= 0) {
        recordIslandCompleted();
        triggerVictory();
      }
    }
  }

  if (keys["e"]) {
    if (isNearBoat(player)) {
      if (!islandCompleted) {
        completeIsland();
        recordIslandCompleted();
      }
    } else {
      const collectedResource = collectResource(player);

      if (collectedResource) {
        addResource(collectedResource.type, collectedResource.amount);

        recordResourceCollected(
          collectedResource.type,
          collectedResource.amount,
        );
      }
    }

    keys["e"] = false;
  }

  if (keys["b"]) {
    if (craftingOpen) {
      const recipe = getBoatRecipe();
      if (recipe && craft(recipe)) {
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
      const recipe = getBoatRecipe();
      if (recipe && craft(recipe)) {
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

    if (!player.gameOver) {
      player.gameOver = true;
      recordDeath();
      const deathScreen = document.getElementById("deathScreen");
      if (deathScreen) {
        deathScreen.classList.remove("hidden");
      }
    }
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

  const currentImage =
    player.weapon === "machineGun"
      ? playerMachineGunImage
      : player.weapon === "gun"
        ? playerGunImage
        : playerImage;

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
  // Handled by DOM deathScreen
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
  if (isNearBoat(player)) {
    return;
  }

  const resource = getNearbyResource(player);

  if (!resource) return;

  let resourceName = "";

  if (resource.type === "wood") {
    resourceName = "Wood";
  }

  if (resource.type === "stone") {
    resourceName = "Stone";
  }

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

function drawBoatInteractionPrompt() {
  if (getCurrentIsland() === 3 || !isNearBoat(player)) {
    return;
  }

  const text = "Press E to use boat";

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

  const boatRecipe = getBoatRecipe();

  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";

  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = "#ffffff";

  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";

  ctx.fillText("Crafting", canvas.width / 2, y + 45);

  if (!boatRecipe) {
    ctx.font = "18px Arial";
    ctx.fillText(
      "No recipes available on this island.",
      canvas.width / 2,
      y + 130,
    );
    ctx.textAlign = "left";
    return;
  }

  const alreadyCrafted = isBoatCrafted();
  const canCraftBoat = canCraft(boatRecipe);

  ctx.font = "20px Arial";

  ctx.fillText("Boat", canvas.width / 2, y + 100);

  ctx.font = "18px Arial";

  ctx.fillText(`Wood: ${boatRecipe.wood}`, canvas.width / 2, y + 140);

  ctx.fillText(`Stone: ${boatRecipe.stone}`, canvas.width / 2, y + 170);

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

  let buttonText = "Not Enough Resources";
  if (alreadyCrafted) {
    buttonText = "Already Crafted";
  } else if (canCraftBoat) {
    buttonText = "Craft Boat";
  }

  ctx.fillText(
    buttonText,
    canvas.width / 2,
    buttonY + 28,
  );

  ctx.textAlign = "left";
}

function drawIsland3HUD() {
  if (getCurrentIsland() !== 3) return;

  if (!bossSpawned) {
    const bannerWidth = 240;
    const bannerHeight = 36;
    const bannerX = (canvas.width - bannerWidth) / 2;
    const bannerY = 20;

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);

    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.strokeRect(bannerX, bannerY, bannerWidth, bannerHeight);

    ctx.fillStyle = "#f39c12";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `BOSS ARRIVAL: ${Math.ceil(bossCountdown)}s`,
      canvas.width / 2,
      bannerY + 24,
    );
    ctx.textAlign = "left";
  } else if (isBossAlive()) {
    const bannerWidth = 280;
    const bannerHeight = 36;
    const bannerX = (canvas.width - bannerWidth) / 2;
    const bannerY = 20;

    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);

    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.strokeRect(bannerX, bannerY, bannerWidth, bannerHeight);

    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "☠ BOSS FIGHT IN PROGRESS ☠",
      canvas.width / 2,
      bannerY + 24,
    );
    ctx.textAlign = "left";
  }

  const killBoxWidth = 200;
  const killBoxHeight = 36;
  const killBoxX = canvas.width - killBoxWidth - 20;
  const killBoxY = 20;

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(killBoxX, killBoxY, killBoxWidth, killBoxHeight);

  ctx.font = "14px Arial";
  const kills = Math.min(20, getIsland3RegularKills());
  if (machineGunUnlocked) {
    ctx.fillStyle = "#2ecc71";
    ctx.fillText("Kills: 20/20 (MG Ready!)", killBoxX + 15, killBoxY + 23);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`MG Unlock: ${kills}/20 Kills`, killBoxX + 15, killBoxY + 23);
  }

  const wepBoxWidth = 180;
  const wepBoxHeight = 36;
  const wepBoxX = 20;
  const wepBoxY = 135;

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(wepBoxX, wepBoxY, wepBoxWidth, wepBoxHeight);

  if (player.weapon === "machineGun") {
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 14px Arial";
    ctx.fillText("WEAPON: MACHINE GUN", wepBoxX + 10, wepBoxY + 23);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px Arial";
    ctx.fillText("WEAPON: PISTOL", wepBoxX + 10, wepBoxY + 23);
  }

  if (machineGunBannerTimer > 0) {
    const popupWidth = 460;
    const popupHeight = 80;
    const px = (canvas.width - popupWidth) / 2;
    const py = canvas.height / 2 - 160;

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(px, py, popupWidth, popupHeight);

    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 3;
    ctx.strokeRect(px, py, popupWidth, popupHeight);

    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 26px Arial";
    ctx.textAlign = "center";
    ctx.fillText("★ MACHINE GUN UNLOCKED! ★", canvas.width / 2, py + 34);

    ctx.fillStyle = "#ffffff";
    ctx.font = "16px Arial";
    ctx.fillText(
      "Rapid full-auto firepower equipped!",
      canvas.width / 2,
      py + 62,
    );

    ctx.textAlign = "left";
  }
}

function drawPlayerHitEffect() {
  const flash = getPlayerHitFlash();

  if (flash <= 0) return;

  const alpha = flash / 0.18;

  ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.35})`;

  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPauseScreen() {
  // Handled by DOM pauseScreen
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
  drawBoatInteractionPrompt();
  drawIsland3HUD();
  drawPlayerHitEffect();
  drawGameOver();
  drawIslandComplete(ctx, canvas);
  drawPauseScreen();
}

generateInitialEnemies(player);

export { update, draw, setPaused, isPaused };