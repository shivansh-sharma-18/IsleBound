import { gameLoop } from "./gameLoop.js";
import { update, draw } from "./game.js";

requestAnimationFrame((timestamp) => {
    gameLoop(timestamp, update, draw);
});