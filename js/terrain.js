import { TILE_SIZE, terrainMap } from "./world.js";

const terrainImages = {};

const terrainFiles = {
    water: "assets/environment/water/rpgpack_rpgTile013.png",
    sand: "assets/environment/terrain/tile_18.png",
    grass: "assets/environment/terrain/tile_39.png",
};

for (const [name, path] of Object.entries(terrainFiles)) {
    const image = new Image();

    image.src = path;

    terrainImages[name] = image;
}

function getTerrainTile(row, col) {
    if (
        row < 0 ||
        row >= terrainMap.length ||
        col < 0 ||
        col >= terrainMap[row].length
    ) {
        return "W";
    }

    return terrainMap[row][col];
}

function getTerrainImage(row, col) {
    const tile = getTerrainTile(row, col);

    if (tile === "W") {
        return terrainImages.water;
    }

    if (tile === "S") {
        return terrainImages.sand;
    }

    if (tile === "G") {
        return terrainImages.grass;
    }

    return null;
}

function drawTerrain(ctx, canvas, camera) {
    const startCol = Math.max(
        0,
        Math.floor(camera.x / TILE_SIZE) - 1
    );

    const endCol = Math.min(
        terrainMap[0].length,
        Math.ceil((camera.x + canvas.width) / TILE_SIZE) + 1
    );

    const startRow = Math.max(
        0,
        Math.floor(camera.y / TILE_SIZE) - 1
    );

    const endRow = Math.min(
        terrainMap.length,
        Math.ceil((camera.y + canvas.height) / TILE_SIZE) + 1
    );

    for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {

            const image = getTerrainImage(row, col);

            if (!image || !image.complete) {
                continue;
            }

            const worldX = col * TILE_SIZE;
            const worldY = row * TILE_SIZE;

            const screenX = worldX - camera.x;
            const screenY = worldY - camera.y;

            ctx.drawImage(
                image,
                screenX,
                screenY,
                TILE_SIZE,
                TILE_SIZE
            );
        }
    }
}

export { drawTerrain, getTerrainTile };