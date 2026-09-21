const boatImage = new Image();
boatImage.src = "./assets/items/boat.png";

const boat = {
  x: 3590,
  y: 1280,
  width: 120,
  height: 120,
  crafted: false,
};

const BOAT_INTERACTION_RANGE = 100;

function craftBoat() {
  boat.crafted = true;
}

function isNearBoat(player) {
  if (!boat.crafted) return false;

  const boatCenterX = boat.x + boat.width / 2;
  const boatCenterY = boat.y + boat.height / 2;

  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const distance = Math.hypot(
    playerCenterX - boatCenterX,
    playerCenterY - boatCenterY,
  );

  return distance <= BOAT_INTERACTION_RANGE;
}

function drawBoat(ctx, camera) {
  const screenX = boat.x - camera.x + boat.width / 2;
  const screenY = boat.y - camera.y + boat.height / 2;

  if (!boat.crafted) {
    ctx.save();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);

    ctx.strokeRect(
      screenX - boat.width / 2,
      screenY - boat.height / 2,
      boat.width,
      boat.height,
    );

    ctx.restore();

    return;
  }

  if (!boatImage.complete || boatImage.naturalWidth === 0) {
    return;
  }

  ctx.save();

  ctx.translate(screenX, screenY);
  ctx.rotate(Math.PI / 2);

  ctx.drawImage(
    boatImage,
    -boat.width / 2,
    -boat.height / 2,
    boat.width,
    boat.height,
  );

  ctx.restore();
}

export { boat, craftBoat, drawBoat, isNearBoat };
