import { world, TILE_SIZE } from "./world.js";
import { getTerrainTile } from "./terrain.js";
import { rectanglesOverlap } from "./collision.js";
import { player } from "./player.js";

const trees = [];
const rocks = [];

const treeImage = new Image();

treeImage.src = "assets/environment/vegetation/palm_detailed_long.png";

const rockImage = new Image();

rockImage.src = "assets/environment/rocks/formation_rock.png";

function isValidTerrainPosition(x, y, width, height) {
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

function isPositionFree(x, y, width, height) {
  for (const tree of trees) {
    if (
      rectanglesOverlap(
        x,
        y,
        width,
        height,
        tree.x,
        tree.y,
        tree.width,
        tree.height,
        20,
      )
    ) {
      return false;
    }
  }

  for (const rock of rocks) {
    if (
      rectanglesOverlap(
        x,
        y,
        width,
        height,
        rock.x,
        rock.y,
        rock.width,
        rock.height,
        20,
      )
    ) {
      return false;
    }
  }

  return true;
}

function isTooCloseToPlayerSpawn(x, y, width, height) {
  const padding = 150;

  return (
    x < player.x + player.width + padding &&
    x + width > player.x - padding &&
    y < player.y + player.height + padding &&
    y + height > player.y - padding
  );
}

function createTree() {
  const width = 100;
  const height = 150;

  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * (world.width - width);

    const y = Math.random() * (world.height - height);

    if (
      isValidTerrainPosition(x, y, width, height) &&
      isPositionFree(x, y, width, height) &&
      !isTooCloseToPlayerSpawn(x, y, width, height)
    ) {
      return {
        x,
        y,
        width,
        height,
        collisionWidth: 30,
        collisionHeight: 35,
      };
    }
  }

  return null;
}

function createRock() {
  const width = 75 + Math.random() * 20;

  const height = 55 + Math.random() * 15;

  for (let attempt = 0; attempt < 1000; attempt++) {
    const x = Math.random() * (world.width - width);

    const y = Math.random() * (world.height - height);

    if (
      isValidTerrainPosition(x, y, width, height) &&
      isPositionFree(x, y, width, height) &&
      !isTooCloseToPlayerSpawn(x, y, width, height)
    ) {
      return {
        x,
        y,
        width,
        height,
        collisionWidth: width * 0.7,
        collisionHeight: height * 0.7,
      };
    }
  }
  
  return null;
}

function generateObstacles() {
  const treeCount = 8;
  const rockCount = 5;

  for (let i = 0; i < treeCount; i++) {
    const tree = createTree();

    if (tree) {
      trees.push(tree);
    }
  }

  for (let i = 0; i < rockCount; i++) {
    const rock = createRock();

    if (rock) {
      rocks.push(rock);
    }
  }
}

function drawTrees(ctx, camera) {
  for (const tree of trees) {
    if (!treeImage.complete || treeImage.naturalWidth === 0) {
      continue;
    }

    const screenX = tree.x - camera.x;

    const screenY = tree.y - camera.y;

    ctx.drawImage(treeImage, screenX, screenY, tree.width, tree.height);
  }
}

function drawRocks(ctx, camera) {
  for (const rock of rocks) {
    if (!rockImage.complete || rockImage.naturalWidth === 0) {
      continue;
    }

    const screenX = rock.x - camera.x;

    const screenY = rock.y - camera.y;

    ctx.drawImage(rockImage, screenX, screenY, rock.width, rock.height);
  }
}

generateObstacles();

export { trees, rocks, drawTrees, drawRocks };
