import { TILE_SIZE } from "./world.js";
import { getTerrainTile } from "./terrain.js";
import { trees, rocks } from "./obstacles.js";

function rectanglesOverlap(
  x1,
  y1,
  width1,
  height1,
  x2,
  y2,
  width2,
  height2,
  padding = 0,
) {
  return (
    x1 < x2 + width2 + padding &&
    x1 + width1 > x2 - padding &&
    y1 < y2 + height2 + padding &&
    y1 + height1 > y2 - padding
  );
}

function isTooCloseToObstacle(x, y, width, height, padding = 30) {
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
        padding,
      )
    ) {
      return true;
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
        padding,
      )
    ) {
      return true;
    }
  }

  return false;
}

function isWalkable(x, y, width, height) {
  // terrain collsion check
  const left = Math.floor(x / TILE_SIZE);
  const right = Math.floor((x + width - 1) / TILE_SIZE);

  const top = Math.floor(y / TILE_SIZE);
  const bottom = Math.floor((y + height - 1) / TILE_SIZE);

  for (let row = top; row <= bottom; row++) {
    for (let col = left; col <= right; col++) {
      const tile = getTerrainTile(row, col);

      if (tile === "W") {
        return false;
      }
    }
  }

  // tree collision check
  for (const tree of trees) {
    const collisionX = tree.x + (tree.width - tree.collisionWidth) / 2;

    const collisionY = tree.y + tree.height - tree.collisionHeight;

    if (
      rectanglesOverlap(
        x,
        y,
        width,
        height,
        collisionX,
        collisionY,
        tree.collisionWidth,
        tree.collisionHeight,
      )
    ) {
      return false;
    }
  }

  // rock collision check
  for (const rock of rocks) {
    const collisionX =
        rock.x + (rock.width - rock.collisionWidth) / 2;

    const collisionY =
        rock.y + (rock.height - rock.collisionHeight) / 2;

    if (
        rectanglesOverlap(
            x,
            y,
            width,
            height,
            collisionX,
            collisionY,
            rock.collisionWidth,
            rock.collisionHeight
        )
    ) {
        return false;
    }
}

  return true;
}

export { rectanglesOverlap, isWalkable, isTooCloseToObstacle };
