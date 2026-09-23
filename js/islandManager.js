let currentIsland = 1;

const totalIslands = 3;

function getCurrentIsland() {
  return currentIsland;
}

function moveToNextIsland() {
  if (currentIsland < totalIslands) {
    currentIsland++;

    return true;
  }

  return false;
}

function isFinalIsland() {
  return currentIsland === totalIslands;
}

function resetIslandProgress() {
  currentIsland = 1;
}

export {
  getCurrentIsland,
  moveToNextIsland,
  isFinalIsland,
  resetIslandProgress,
  totalIslands,
};