import { isWalkable, isTooCloseToObstacle } from "./collision.js";

let spawnTimer = 0;

const spawnInterval = 3;

const enemies = [];

const enemyImage = new Image();

enemyImage.src = "assets/enemies/zombies/zoimbie1_stand.png";

function spawnEnemy(player) {
  const enemyWidth = 50;
  const enemyHeight = 50;

  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * 1800 + 500;

    const y = Math.random() * 1000 + 400;

    const distance = Math.hypot(x - player.x, y - player.y);

    if (distance < 400) {
      continue;
    }

    if (!isWalkable(x, y, enemyWidth, enemyHeight)) {
      continue;
    }

    if (isTooCloseToObstacle(x, y, enemyWidth, enemyHeight)) {
      continue;
    }

    enemies.push({
      x: x,
      y: y,
      width: enemyWidth,
      height: enemyHeight,
      speed: 100,
      health: 100,
    });

    return;
  }

}

function generateInitialEnemies(player) {
  for (let i = 0; i < 3; i++) {
    spawnEnemy(player);
  }
}

function updateEnemySpawning(dt, player) {
  spawnTimer += dt;

  if (spawnTimer >= spawnInterval) {
    spawnEnemy(player);

    spawnTimer = 0;
  }
}

function drawEnemies(ctx, camera) {
  for (const enemy of enemies) {
    const screenX = enemy.x - camera.x;

    const screenY = enemy.y - camera.y;

    if (enemyImage.complete && enemyImage.naturalWidth > 0) {
      ctx.drawImage(enemyImage, screenX, screenY, enemy.width, enemy.height);
    }
  }
}

function updateEnemies(dt, player) {
  for (const enemy of enemies) {
    const enemyCenterX = enemy.x + enemy.width / 2;

    const enemyCenterY = enemy.y + enemy.height / 2;

    const playerCenterX = player.x + player.width / 2;

    const playerCenterY = player.y + player.height / 2;

    const dx = playerCenterX - enemyCenterX;

    const dy = playerCenterY - enemyCenterY;

    const distance = Math.hypot(dx, dy);

    const stopDistance = (enemy.width + player.width) / 2;

    if (distance > stopDistance) {
      enemy.x += (dx / distance) * enemy.speed * dt;

      enemy.y += (dy / distance) * enemy.speed * dt;
    }
  }
}

function damageEnemies(bullets) {
  for (const enemy of enemies) {
    for (const bullet of bullets) {
      const hit =
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y;

      if (hit) {
        enemy.health -= 25;
        bullet.life = 0;
      }
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].health <= 0) {
      enemies.splice(i, 1);
    }
  }
}

function damagePlayer(player, dt) {
  for (const enemy of enemies) {
    const enemyCenterX = enemy.x + enemy.width / 2;

    const enemyCenterY = enemy.y + enemy.height / 2;

    const playerCenterX = player.x + player.width / 2;

    const playerCenterY = player.y + player.height / 2;

    const dx = playerCenterX - enemyCenterX;

    const dy = playerCenterY - enemyCenterY;

    const distance = Math.hypot(dx, dy);

    const attackDistance = (enemy.width + player.width) / 2;

    if (distance <= attackDistance) {
      player.health -= 20 * dt;
    }
  }
}

export {
  enemies,
  drawEnemies,
  updateEnemies,
  damageEnemies,
  damagePlayer,
  updateEnemySpawning,
  generateInitialEnemies,
};
