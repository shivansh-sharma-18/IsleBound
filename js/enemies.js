import { isWalkable, isTooCloseToObstacle } from "./collision.js";

const ENEMY_TYPES = {
  pirate: {
    hp: 40,
    speed: 95,
    detectionRange: 220,
    attackRange: 55,
    attackCooldown: 1.1,
    damage: 8,
    radius: 15,
  },
  skeleton: {
    hp: 60,
    speed: 125,
    detectionRange: 250,
    attackRange: 50,
    attackCooldown: 0.8,
    damage: 12,
    radius: 16,
  },
  boss: {
    hp: 420,
    speed: 90,
    detectionRange: 520,
    attackRange: 80,
    attackCooldown: 1.3,
    damage: 22,
    radius: 34,
  },
};

const pirateImage = new Image();
pirateImage.src = "./assets/enemies/pirate.png";

const skeletonImage = new Image();
skeletonImage.src = "./assets/enemies/skeleton.png";

const bossImage = new Image();
bossImage.src = "./assets/enemies/boss.png";

const enemies = [];

const ENEMY_WIDTH = 50;
const ENEMY_HEIGHT = 50;

const ATTACK_DURATION = 0.25;
const ATTACK_LUNGE_DISTANCE = 18;
const ATTACK_SCALE = 1.15;

let playerHitFlash = 0;

const INITIAL_ENEMY_COUNTS = {
  pirate: 6,
  skeleton: 4,
  boss: 0,
};

function makeEnemy(type, x, y) {
  const base = ENEMY_TYPES[type];

  if (!base) {
    console.error(`Unknown enemy type: ${type}`);
    return null;
  }

  return {
    type,
    x,
    y,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT,
    hp: base.hp,
    maxHp: base.hp,
    speed: base.speed,
    detectionRange: base.detectionRange,
    attackRange: base.attackRange,
    attackCooldown: base.attackCooldown,
    cdTimer: 0,
    damage: base.damage,
    radius: base.radius,
    state: "idle",
    facing: 0,
    alive: true,
    kx: 0,
    ky: 0,
    hitFlash: 0,
    attackTimer: 0,
    attackHitApplied: false,
    attackStartX: 0,
    attackStartY: 0,
    attackTargetX: 0,
    attackTargetY: 0,
  };
}

function spawnEnemy(player, type = null) {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * 1800 + 500;
    const y = Math.random() * 1000 + 400;

    const distance = Math.hypot(x - player.x, y - player.y);

    if (distance < 400) continue;
    if (!isWalkable(x, y, ENEMY_WIDTH, ENEMY_HEIGHT)) continue;
    if (isTooCloseToObstacle(x, y, ENEMY_WIDTH, ENEMY_HEIGHT)) continue;

    let enemyType = type;

    if (!enemyType) {
      const normalTypes = ["pirate", "skeleton"];
      enemyType = normalTypes[Math.floor(Math.random() * normalTypes.length)];
    }

    const enemy = makeEnemy(enemyType, x, y);

    if (enemy) {
      enemies.push(enemy);
    }

    return;
  }
}

function generateInitialEnemies(player) {
  for (const [type, count] of Object.entries(INITIAL_ENEMY_COUNTS)) {
    for (let i = 0; i < count; i++) {
      spawnEnemy(player, type);
    }
  }
}

function attackPlayer(enemy, player) {
  if (player.invulnTimer && player.invulnTimer > 0) {
    return;
  }

  player.health -= enemy.damage;
  playerHitFlash = 0.18;

  const enemyCenterX = enemy.x + enemy.width / 2;
  const enemyCenterY = enemy.y + enemy.height / 2;
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const angle = Math.atan2(
    playerCenterY - enemyCenterY,
    playerCenterX - enemyCenterX,
  );

  if ("vx" in player) {
    player.vx = Math.cos(angle) * 260;
  }

  if ("vy" in player) {
    player.vy = Math.sin(angle) * 260;
  }

  if ("invulnTimer" in player) {
    player.invulnTimer = 0.55;
  }

  if (player.health <= 0) {
    player.health = 0;
  }
}

function startEnemyAttack(enemy, player) {
  enemy.state = "attack";
  enemy.attackTimer = 0;
  enemy.attackHitApplied = false;
  enemy.attackStartX = enemy.x;
  enemy.attackStartY = enemy.y;

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  const enemyCenterX = enemy.x + enemy.width / 2;
  const enemyCenterY = enemy.y + enemy.height / 2;

  const angle = Math.atan2(
    playerCenterY - enemyCenterY,
    playerCenterX - enemyCenterX,
  );

  enemy.attackTargetX = Math.cos(angle) * ATTACK_LUNGE_DISTANCE;
  enemy.attackTargetY = Math.sin(angle) * ATTACK_LUNGE_DISTANCE;
  enemy.facing = angle;
}

function updateEnemyAttack(enemy, player, dt) {
  enemy.attackTimer += dt;

  if (!enemy.attackHitApplied && enemy.attackTimer >= ATTACK_DURATION / 2) {
    attackPlayer(enemy, player);
    enemy.attackHitApplied = true;
  }

  if (enemy.attackTimer >= ATTACK_DURATION) {
    enemy.attackTimer = 0;
    enemy.attackHitApplied = false;
    enemy.state = "chase";
    enemy.cdTimer = enemy.attackCooldown;
  }
}

function updateEnemies(dt, player) {
  if (playerHitFlash > 0) {
    playerHitFlash -= dt;
    if (playerHitFlash < 0) {
      playerHitFlash = 0;
    }
  }

  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    if (Math.abs(enemy.kx) > 1 || Math.abs(enemy.ky) > 1) {
      const nextX = enemy.x + enemy.kx * dt;
      const nextY = enemy.y + enemy.ky * dt;

      if (isWalkable(nextX, enemy.y, enemy.width, enemy.height)) {
        enemy.x = nextX;
      }

      if (isWalkable(enemy.x, nextY, enemy.width, enemy.height)) {
        enemy.y = nextY;
      }

      enemy.kx += (0 - enemy.kx) * Math.min(1, dt * 5);
      enemy.ky += (0 - enemy.ky) * Math.min(1, dt * 5);
    }

    if (enemy.cdTimer > 0) {
      enemy.cdTimer -= dt;
    }

    if (enemy.hitFlash > 0) {
      enemy.hitFlash -= dt;
    }

    if (enemy.state === "attack") {
      updateEnemyAttack(enemy, player, dt);
      continue;
    }

    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;

    const dx = playerCenterX - enemyCenterX;
    const dy = playerCenterY - enemyCenterY;
    const distance = Math.hypot(dx, dy);

    if (distance < enemy.detectionRange) {
      enemy.state = "chase";
    } else {
      enemy.state = "idle";
    }

    if (enemy.state === "chase") {
      if (distance <= enemy.attackRange) {
        enemy.facing = Math.atan2(dy, dx);

        if (enemy.cdTimer <= 0) {
          startEnemyAttack(enemy, player);
        }
        continue;
      }

      if (distance === 0) continue;

      const angle = Math.atan2(dy, dx);
      enemy.facing = angle;

      const moveX = Math.cos(angle) * enemy.speed * dt;
      const moveY = Math.sin(angle) * enemy.speed * dt;

      if (isWalkable(enemy.x + moveX, enemy.y, enemy.width, enemy.height)) {
        enemy.x += moveX;
      }

      if (isWalkable(enemy.x, enemy.y + moveY, enemy.width, enemy.height)) {
        enemy.y += moveY;
      }
    }
  }
}

function damageEnemies(bullets) {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    for (const bullet of bullets) {
      const hit =
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y;

      if (!hit) continue;

      enemy.hp -= 25;
      enemy.hitFlash = 0.12;
      bullet.life = 0;

      const angle = Math.atan2(bullet.y - enemy.y, bullet.x - enemy.x);
      enemy.kx = -Math.cos(angle) * 120;
      enemy.ky = -Math.sin(angle) * 120;

      if (enemy.hp <= 0) {
        enemy.hp = 0;
        enemy.alive = false;
      }

      break;
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (!enemies[i].alive) {
      enemies.splice(i, 1);
    }
  }
}

function resetEnemies(player) {
  enemies.length = 0;

  playerHitFlash = 0;

  generateInitialEnemies(player);
}

function getEnemyImage(enemy) {
  if (enemy.type === "pirate") return pirateImage;
  if (enemy.type === "skeleton") return skeletonImage;
  if (enemy.type === "boss") return bossImage;
  return null;
}

function getAttackAnimation(enemy) {
  if (enemy.state !== "attack") {
    return {
      offsetX: 0,
      offsetY: 0,
      scale: 1,
    };
  }

  const progress = enemy.attackTimer / ATTACK_DURATION;
  let animationProgress;

  if (progress < 0.5) {
    animationProgress = progress * 2;
  } else {
    animationProgress = (1 - progress) * 2;
  }

  return {
    offsetX: enemy.attackTargetX * animationProgress,
    offsetY: enemy.attackTargetY * animationProgress,
    scale: 1 + (ATTACK_SCALE - 1) * animationProgress,
  };
}

function drawEnemy(ctx, enemy, camera) {
  const baseScreenX = enemy.x - camera.x + enemy.width / 2;
  const baseScreenY = enemy.y - camera.y + enemy.height / 2;

  const image = getEnemyImage(enemy);

  if (!image || !image.complete || image.naturalWidth === 0) {
    return;
  }

  let drawWidth = 70;
  let drawHeight = 70;

  if (enemy.type === "boss") {
    drawWidth = 110;
    drawHeight = 110;
  }

  const animation = getAttackAnimation(enemy);
  const screenX = baseScreenX + animation.offsetX;
  const screenY = baseScreenY + animation.offsetY;

  drawWidth *= animation.scale;
  drawHeight *= animation.scale;

  ctx.save();

  if (enemy.hitFlash > 0) {
    ctx.globalAlpha = 0.65;
  }

  ctx.translate(screenX, screenY);

  if (enemy.type === "pirate" || enemy.type === "boss") {
    ctx.rotate(enemy.facing);
  } else {
    ctx.rotate(enemy.facing - Math.PI / 2);
  }

  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

  ctx.restore();
}

function drawEnemies(ctx, camera) {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    drawEnemy(ctx, enemy, camera);
  }
}

function getPlayerHitFlash() {
  return playerHitFlash;
}

export {
  enemies,
  drawEnemies,
  updateEnemies,
  damageEnemies,
  generateInitialEnemies,
  resetEnemies,
  spawnEnemy,
  makeEnemy,
  getPlayerHitFlash,
};
