import { isWalkable } from "./collision.js";

const bullets = [];

function shoot(player, targetX, targetY) {
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const angle = Math.atan2(targetY - playerCenterY, targetX - playerCenterX);

  const bulletSpeed = 700;

  bullets.push({
    x: playerCenterX,
    y: playerCenterY,

    width: 8,
    height: 8,

    velocityX: Math.cos(angle) * bulletSpeed,
    velocityY: Math.sin(angle) * bulletSpeed,

    life: 2,
  });
}

function updateBullets(dt) {
  for (const bullet of bullets) {
    bullet.x += bullet.velocityX * dt;
    bullet.y += bullet.velocityY * dt;

    bullet.life -= dt;

    if (!isWalkable(bullet.x, bullet.y, bullet.width, bullet.height)) {
      bullet.life = 0;
    }
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].life <= 0) {
      bullets.splice(i, 1);
    }
  }
}

function drawBullets(ctx, camera) {
  for (const bullet of bullets) {
    const screenX = bullet.x - camera.x;
    const screenY = bullet.y - camera.y;

    ctx.fillStyle = "#f6ff00";

    ctx.fillRect(screenX, screenY, bullet.width, bullet.height);
  }
}

export { bullets, shoot, updateBullets, drawBullets };
