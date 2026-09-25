import { gameLoop } from "./gameLoop.js";
import { update, draw } from "./game.js";

const canvas = document.getElementById("gameCanvas");

const mainMenu = document.getElementById("mainMenu");
const controlsScreen = document.getElementById("controlsScreen");
const creditsScreen = document.getElementById("creditsScreen");

const playButton = document.getElementById("playButton");
const controlsButton = document.getElementById("controlsButton");
const creditsButton = document.getElementById("creditsButton");

const controlsBackButton = document.getElementById("controlsBackButton");
const creditsBackButton = document.getElementById("creditsBackButton");

let gameStarted = false;

playButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  canvas.style.display = "block";
  if (!gameStarted) {
    gameStarted = true;
    requestAnimationFrame((timestamp) => {
      gameLoop(timestamp, update, draw);
    });
  }
});

controlsButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  controlsScreen.classList.remove("hidden");
});

controlsBackButton.addEventListener("click", () => {
  controlsScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

creditsButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  creditsScreen.classList.remove("hidden");
});

creditsBackButton.addEventListener("click", () => {
  creditsScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});