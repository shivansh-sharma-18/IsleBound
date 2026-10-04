const TILE_SIZE = 64;

const world = {
  width: 3840,
  height: 2560,
};

const columns = world.width / TILE_SIZE;
const rows = world.height / TILE_SIZE;

function generateTerrainMap(island = 1) {
  const map = [];
  const centerX = columns / 2;
  const centerY = rows / 2;
  const islandRadiusX = 28;
  const islandRadiusY = 18;
  const sandWidth = 0.1;

  for (let row = 0; row < rows; row++) {
    const terrainRow = [];

    for (let col = 0; col < columns; col++) {
      let distance;

      if (island === 1 || island === 3) {
        const normalizedX = (col - centerX) / islandRadiusX;
        const normalizedY = (row - centerY) / islandRadiusY;

        distance = Math.sqrt(normalizedX ** 2 + normalizedY ** 2);
      } else {
        const capsuleRadius = islandRadiusY;
        const capsuleHalfLength = islandRadiusX - capsuleRadius;
        const horizontalDistance = Math.max(
          Math.abs(col - centerX) - capsuleHalfLength,
          0,
        );
        const verticalDistance = Math.abs(row - centerY);

        distance =
          Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2) /
          capsuleRadius;
      }

      if (distance > 1) {
        terrainRow.push("W");
      } else if (distance > 1 - sandWidth) {
        terrainRow.push("S");
      } else {
        terrainRow.push("G");
      }
    }

    map.push(terrainRow);
  }

  return map.map((row) => row.join(""));
}

let terrainMap = generateTerrainMap(1);

function setTerrainMap(island) {
  terrainMap = generateTerrainMap(island);
}

export { world, TILE_SIZE, terrainMap, setTerrainMap };