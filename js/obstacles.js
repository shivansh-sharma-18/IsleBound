const trees = [
  {
    x: 600,
    y: 500,
    width: 100,
    height: 150,
    collisionWidth: 30,
    collisionHeight: 35,
  },

  {
    x: 900,
    y: 700,
    width: 100,
    height: 150,
    collisionWidth: 30,
    collisionHeight: 35,
  },

  {
    x: 500,
    y: 1000,
    width: 100,
    height: 150,
    collisionWidth: 30,
    collisionHeight: 35,
  },

  {
    x: 1000,
    y: 1100,
    width: 100,
    height: 150,
    collisionWidth: 30,
    collisionHeight: 35,
  },
];


const rocks = [
  {
    x: 800,
    y: 450,
    width: 80,
    height: 60,
    collisionWidth: 60,
    collisionHeight: 40,
  },

  {
    x: 1100,
    y: 800,
    width: 90,
    height: 65,
    collisionWidth: 70,
    collisionHeight: 45,
  },

  {
    x: 700,
    y: 1200,
    width: 75,
    height: 55,
    collisionWidth: 55,
    collisionHeight: 35,
  },
];


const treeImage = new Image();

treeImage.src = "assets/environment/vegetation/palm_detailed_long.png";


const rockImage = new Image();

rockImage.src = "assets/environment/rocks/formation_rock.png";


function drawTrees(ctx, camera) {
  for (const tree of trees) {
    if (!treeImage.complete || treeImage.naturalWidth === 0) {
      continue;
    }

    const screenX = tree.x - camera.x;
    const screenY = tree.y - camera.y;

    ctx.drawImage(treeImage, screenX, screenY, tree.width, tree.height);
  }
}

// --------------------
// Draw Rocks
// --------------------

function drawRocks(ctx, camera) {
  for (const rock of rocks) {
    if (!rockImage.complete || rockImage.naturalWidth === 0) {
      continue;
    }

    const screenX = rock.x - camera.x;
    const screenY = rock.y - camera.y;

    ctx.drawImage(rockImage, screenX, screenY, rock.width, rock.height);
  }
}

export { trees, rocks, drawTrees, drawRocks };
