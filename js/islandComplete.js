let islandCompleted = false;

function completeIsland() {
  islandCompleted = true;
}

function drawIslandComplete(ctx, canvas) {
  if (!islandCompleted) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  ctx.font = "bold 52px Arial";
  ctx.fillText("ISLAND COMPLETED!", canvas.width / 2, canvas.height / 2 - 30);

  ctx.font = "24px Arial";
  ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 30);

  ctx.textAlign = "left";
}

export { islandCompleted, completeIsland, drawIslandComplete };