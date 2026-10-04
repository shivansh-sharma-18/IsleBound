import { getStats } from "./stats.js";

let islandCompleted = false;
let gameWon = false;

function completeIsland() {
  islandCompleted = true;
}

function resetIslandCompletion() {
  islandCompleted = false;
  gameWon = false;
}

function triggerVictory() {
  gameWon = true;
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
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";

    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 56px Arial";
    ctx.fillText("VICTORY!", canvas.width / 2, canvas.height / 2 - 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.fillText(
      "YOU CONQUERED ISLEBOUND & ESCAPED!",
      canvas.width / 2,
      canvas.height / 2 - 70,
    );

    const stats = getStats();
    if (stats) {
      ctx.font = "18px Arial";
      ctx.fillStyle = "#dddddd";
      ctx.fillText(
        `Enemies Defeated: ${stats.enemiesDefeated || 0}  |  Bosses Defeated: ${stats.bossesDefeated || 0}`,
        canvas.width / 2,
        canvas.height / 2 - 15,
      );
      ctx.fillText(
        `Shots Fired: ${stats.shotsFired || 0}  |  Damage Dealt: ${stats.damageDealt || 0}`,
        canvas.width / 2,
        canvas.height / 2 + 15,
      );
      ctx.fillText(
        `Total Play Time: ${formatTime(stats.totalPlayTime)}`,
        canvas.width / 2,
        canvas.height / 2 + 45,
      );
    }

    ctx.fillStyle = "#2ecc71";
    ctx.font = "bold 26px Arial";
    ctx.fillText(
      "Press R to Play Again",
      canvas.width / 2,
      canvas.height / 2 + 105,
    );

    ctx.textAlign = "left";
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
