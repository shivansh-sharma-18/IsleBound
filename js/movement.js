import { player } from "./player.js";
import { keys } from "./input.js";
import { isWalkable } from "./collision.js";

function updatePlayerMovement(dt) {
    const movement = player.speed * dt;

    let newX = player.x;
    let newY = player.y;

    if (keys["w"] || keys["arrowup"]) {
        newY -= movement;
    }

    if (keys["s"] || keys["arrowdown"]) {
        newY += movement;
    }

    if (keys["a"] || keys["arrowleft"]) {
        newX -= movement;
    }

    if (keys["d"] || keys["arrowright"]) {
        newX += movement;
    }

    if (isWalkable(newX, newY, player.width, player.height)) {
        player.x = newX;
        player.y = newY;
    }
}

export { updatePlayerMovement };