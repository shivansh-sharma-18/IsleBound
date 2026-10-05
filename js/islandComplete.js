import { getStats } from "./stats.js";

let islandCompleted = false;
let gameWon = false;

function completeIsland() {
  islandCompleted = true;
}

function resetIslandCompletion() {
  islandCompleted = false;
  gameWon = false;
  const victoryScreen = document.getElementById("victoryScreen");
  if (victoryScreen) {
    victoryScreen.classList.add("hidden");
  }
}

function triggerVictory() {
  gameWon = true;
  const victoryScreen = document.getElementById("victoryScreen");
  const victoryStats = document.getElementById("victoryStats");
  if (victoryScreen) {
    victoryScreen.classList.remove("hidden");
  }
  if (victoryStats) {
    const stats = getStats();
    if (stats) {
      victoryStats.innerHTML = `
        <p>Enemies Defeated: <strong>${stats.enemiesDefeated || 0}</strong> &nbsp;|&nbsp; Bosses Defeated: <strong>${stats.bossesDefeated || 0}</strong></p>
        <p>Shots Fired: <strong>${stats.shotsFired || 0}</strong> &nbsp;|&nbsp; Damage Dealt: <strong>${stats.damageDealt || 0}</strong></p>
        <p>Total Play Time: <strong>${formatTime(stats.totalPlayTime)}</strong></p>
      `;
    }
  }
}

function isGameWon() {
  return gameWon;
}

function formatTime(seconds) {
  const totalSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function drawIslandComplete(ctx, canvas) {
  if (gameWon) {
    return;
  }

  if (!islandCompleted) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 52px Arial";
  ctx.fillText("ISLAND COMPLETED!", canvas.width / 2, canvas.height / 2 - 30);

  ctx.font = "24px Arial";
  ctx.fillText("Press E to continue", canvas.width / 2, canvas.height / 2 + 30);

  ctx.textAlign = "left";
}

export {
  islandCompleted,
  completeIsland,
  resetIslandCompletion,
  triggerVictory,
  isGameWon,
  drawIslandComplete,
};
