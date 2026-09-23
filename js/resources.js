import { world, TILE_SIZE } from "./world.js";
import { getTerrainTile } from "./terrain.js";
import { isTooCloseToObstacle } from "./collision.js";

const resources = [];

function isValidResourcePosition(x, y, width, height) {
  const left = Math.floor(x / TILE_SIZE);
  const right = Math.floor((x + width - 1) / TILE_SIZE);

  const top = Math.floor(y / TILE_SIZE);
  const bottom = Math.floor((y + height - 1) / TILE_SIZE);

  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      const tile = getTerrainTile(row, col);

      if (tile !== "G") {
        return false;
      }
    }
  }

  return true;
}

function isTooCloseToResource(x, y, width, height) {
  const padding = 300;

  for (const resource of resources) {
    if (
      x < resource.x + resource.width + padding &&
      x + width > resource.x - padding &&
      y < resource.y + resource.height + padding &&
      y + height > resource.y - padding
    ) {
      return true;
    }
  }

  return false;
}

function createResource(type) {
  const width = type === "wood" ? 35 : 25;
  const height = type === "wood" ? 20 : 25;

  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * (world.width - width);
    const y = Math.random() * (world.height - height);

    const validTerrain = isValidResourcePosition(x, y, width, height);

    const nearObstacle = isTooCloseToObstacle(x, y, width, height);

    const nearResource = isTooCloseToResource(x, y, width, height);

    if (validTerrain && !nearObstacle && !nearResource) {
      return {
        type,
        x,
        y,
        width,
        height,
        amount: Math.floor(Math.random() * 4) + 1,
        collected: false,
        respawnTimer: 0,
      };
    }
  }

  return null;
}

function generateResources() {
  for (let i = 0; i < 15; i++) {
    const resource = createResource("wood");

    if (resource) {
      resources.push(resource);
    }
  }

  for (let i = 0; i < 10; i++) {
    const resource = createResource("stone");

    if (resource) {
      resources.push(resource);
    }
  }
}

function resetResources() {
  resources.length = 0;

  generateResources();
}

function updateResources(dt) {
  for (const resource of resources) {
    if (!resource.collected) {
      continue;
    }

    resource.respawnTimer -= dt;

    if (resource.respawnTimer <= 0) {
      const newResource = createResource(resource.type);

      if (newResource) {
        resource.x = newResource.x;
        resource.y = newResource.y;

        resource.amount = newResource.amount;

        resource.collected = false;

        resource.respawnTimer = 0;
      } else {
        resource.respawnTimer = 1;
      }
    }
  }
}

function drawResources(ctx, camera) {
  for (const resource of resources) {
    if (resource.collected) {
      continue;
    }

    const screenX = resource.x - camera.x;
    const screenY = resource.y - camera.y;

    if (resource.type === "wood") {
      drawWood(ctx, screenX, screenY, resource);
    }

    if (resource.type === "stone") {
      drawStone(ctx, screenX, screenY, resource);
    }
  }
}

function drawWood(ctx, x, y, resource) {
  ctx.save();

  ctx.fillStyle = "#7a4a25";

  ctx.fillRect(x, y, resource.width, resource.height);

  ctx.fillStyle = "#b8783c";

  ctx.beginPath();

  ctx.arc(
    x + resource.width,
    y + resource.height / 2,
    resource.height / 2,
    0,
    Math.PI * 2,
  );

  ctx.fill();

  ctx.restore();
}

function drawStone(ctx, x, y, resource) {
  ctx.save();

  ctx.fillStyle = "#777";

  ctx.beginPath();

  ctx.arc(
    x + resource.width / 2,
    y + resource.height / 2,
    resource.width / 2,
    0,
    Math.PI * 2,
  );

  ctx.fill();

  ctx.restore();
}

function getNearbyResource(player) {
  const interactionDistance = 60;

  for (const resource of resources) {
    if (resource.collected) {
      continue;
    }

    const playerCenterX = player.x + player.width / 2;

    const playerCenterY = player.y + player.height / 2;

    const resourceCenterX = resource.x + resource.width / 2;

    const resourceCenterY = resource.y + resource.height / 2;

    const distance = Math.hypot(
      resourceCenterX - playerCenterX,
      resourceCenterY - playerCenterY,
    );

    if (distance <= interactionDistance) {
      return resource;
    }
  }

  return null;
}

function collectResource(player) {
  const resource = getNearbyResource(player);

  if (!resource) {
    return null;
  }

  resource.collected = true;
  resource.respawnTimer = 10;

  return {
    type: resource.type,
    amount: resource.amount,
  };
}

generateResources();

export {
  resources,
  drawResources,
  getNearbyResource,
  collectResource,
  updateResources,
  resetResources,
};