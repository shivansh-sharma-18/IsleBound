import { isWalkable, isTooCloseToObstacle } from "./collision.js";

const ENEMY_TYPES = {
  pirate: {
    hp: 40,
    speed: 95,
    detectionRange: 220,
    attackRange: 46,
    attackCooldown: 1.1,
    damage: 8,
    radius: 15,
  },
  skeleton: {
    hp: 60,
    speed: 125,
    detectionRange: 250,
    attackRange: 42,
    attackCooldown: 0.8,
    damage: 12,
    radius: 16,
  },
  boss: {
    hp: 420,
    speed: 90,
    detectionRange: 520,
    attackRange: 70,
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
  };
}

function spawnEnemy(player, type = null) {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * 1800 + 500;
    const y = Math.random() * 1000 + 400;
    const distance = Math.hypot(x - player.x, y - player.y);

    if (distance < 400) {
      continue;
    }

    if (!isWalkable(x, y, ENEMY_WIDTH, ENEMY_HEIGHT)) {
      continue;
    }

    if (isTooCloseToObstacle(x, y, ENEMY_WIDTH, ENEMY_HEIGHT)) {
      continue;
    }

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

function updateEnemies(dt, player) {
  for (const enemy of enemies) {
    if (!enemy.alive) {
      continue;
    }

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
      if (distance > enemy.attackRange * 0.85) {
        if (distance === 0) {
          continue;
        }

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
      } else {
        enemy.facing = Math.atan2(dy, dx);

        if (enemy.cdTimer <= 0) {
          attackPlayer(enemy, player);
          enemy.cdTimer = enemy.attackCooldown;
        }
      }
    }
  }
}

function damageEnemies(bullets) {
  for (const enemy of enemies) {
    if (!enemy.alive) {
      continue;
    }

    for (const bullet of bullets) {
      const hit =
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y;

      if (!hit) {
        continue;
      }

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

function getEnemyImage(enemy) {
  if (enemy.type === "pirate") {
    return pirateImage;
  }

  if (enemy.type === "skeleton") {
    return skeletonImage;
  }

  if (enemy.type === "boss") {
    return bossImage;
  }

  return null;
}

function drawEnemy(ctx, enemy, camera) {
  const screenX = enemy.x - camera.x + enemy.width / 2;
  const screenY = enemy.y - camera.y + enemy.height / 2;

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

  ctx.save();

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.beginPath();
  ctx.ellipse(
    screenX,
    screenY + drawHeight * 0.32,
    drawWidth * 0.32,
    drawHeight * 0.12,
    0,
    0,
    Math.PI * 2,
  );
  ctx.fill();

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
    if (!enemy.alive) {
      continue;
    }

    drawEnemy(ctx, enemy, camera);
  }
}

export {
  enemies,
  drawEnemies,
  updateEnemies,
  damageEnemies,
  generateInitialEnemies,
  spawnEnemy,
  makeEnemy,
};
