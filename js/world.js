const TILE_SIZE = 64;

const world = {
  width: 3840,
  height: 2560,
};

const columns = world.width / TILE_SIZE;
const rows = world.height / TILE_SIZE;

function generateTerrainMap() {
  const map = [];

  const centerX = columns / 2;
  const centerY = rows / 2;

  const islandRadius = 25;
  const sandWidth = 4;

  for (let row = 0; row < rows; row++) {
    const terrainRow = [];

    for (let col = 0; col < columns; col++) {
      const distance = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2);

      if (distance > islandRadius) {
        terrainRow.push("W");
      } else if (distance > islandRadius - sandWidth) {
        terrainRow.push("S");
      } else {
        terrainRow.push("G");
      }
    }

    map.push(terrainRow);
  }

  return map.map((row) => row.join(""));
}

const terrainMap = generateTerrainMap();

export { world, TILE_SIZE, terrainMap };