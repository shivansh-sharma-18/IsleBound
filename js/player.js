const player = {
  x: 700,
  y: 700,

  width: 50,
  height: 50,

  spriteWidth: 70,
  spriteHeight: 70,

  speed: 300,

  aimAngle: 0,

  weapon: "gun",

  shootCooldown: 0,
  shootDelay: 0.2,

  health: 100,
  maxHealth: 100,

  gameOver: false,
};

const playerImage = new Image();
playerImage.src = "assets/player/rotation_pose_set/manBlue_stand.png";

const playerGunImage = new Image();
playerGunImage.src = "assets/player/rotation_pose_set/manBlue_gun.png";

function resetPlayer() {
  player.x = 700;
  player.y = 700;

  player.health = player.maxHealth;

  player.gameOver = false;

  player.aimAngle = 0;

  player.shootCooldown = 0;
}

export {
  player,
  playerImage,
  playerGunImage,
  resetPlayer,
};