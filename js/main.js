import { gameLoop } from "./gameLoop.js";
import { update, draw, setPaused } from "./game.js";
import { recordGameStarted } from "./stats.js";

const canvas = document.getElementById("gameCanvas");

const mainMenu = document.getElementById("mainMenu");
const controlsScreen = document.getElementById("controlsScreen");
const creditsScreen = document.getElementById("creditsScreen");
const pauseScreen = document.getElementById("pauseScreen");
const deathScreen = document.getElementById("deathScreen");
const victoryScreen = document.getElementById("victoryScreen");

const playButton = document.getElementById("playButton");
const controlsButton = document.getElementById("controlsButton");
const creditsButton = document.getElementById("creditsButton");

const controlsBackButton = document.getElementById("controlsBackButton");
const creditsBackButton = document.getElementById("creditsBackButton");

const profileButton = document.getElementById("profileButton");

const resumeButton = document.getElementById("resumeButton");
const pauseControlsButton = document.getElementById("pauseControlsButton");
const pauseMainMenuButton = document.getElementById("pauseMainMenuButton");

const restartButton = document.getElementById("restartButton");
const deathMainMenuButton = document.getElementById("deathMainMenuButton");

const victoryMainMenuButton = document.getElementById("victoryMainMenuButton");

let gameStarted = false;
let controlsOpenedFrom = "mainMenu";

function startGame() {
  mainMenu.classList.add("hidden");
  canvas.style.display = "block";

  if (!gameStarted) {
    gameStarted = true;
    recordGameStarted();
    requestAnimationFrame((timestamp) => {
      gameLoop(timestamp, update, draw);
    });
  }
}

playButton.addEventListener("click", () => {
  startGame();
});

controlsButton.addEventListener("click", () => {
  controlsOpenedFrom = "mainMenu";
  mainMenu.classList.add("hidden");
  controlsScreen.classList.remove("hidden");
});

controlsBackButton.addEventListener("click", () => {
  controlsScreen.classList.add("hidden");
  if (controlsOpenedFrom === "pause") {
    pauseScreen.classList.remove("hidden");
  } else {
    mainMenu.classList.remove("hidden");
  }
});

creditsButton.addEventListener("click", () => {
  mainMenu.classList.add("hidden");
  creditsScreen.classList.remove("hidden");
});

creditsBackButton.addEventListener("click", () => {
  creditsScreen.classList.add("hidden");
  mainMenu.classList.remove("hidden");
});

profileButton.addEventListener("click", () => {
  window.location.href = "profile.html";
});

if (resumeButton) {
  resumeButton.addEventListener("click", () => {
    setPaused(false);
  });
}

if (pauseControlsButton) {
  pauseControlsButton.addEventListener("click", () => {
    controlsOpenedFrom = "pause";
    pauseScreen.classList.add("hidden");
    controlsScreen.classList.remove("hidden");
  });
}

if (pauseMainMenuButton) {
  pauseMainMenuButton.addEventListener("click", () => {
    sessionStorage.removeItem("autoPlay");
    window.location.href = "index.html";
  });
}

if (restartButton) {
  restartButton.addEventListener("click", () => {
    sessionStorage.setItem("autoPlay", "true");
    location.reload();
  });
}

if (deathMainMenuButton) {
  deathMainMenuButton.addEventListener("click", () => {
    sessionStorage.removeItem("autoPlay");
    window.location.href = "index.html";
  });
}

if (victoryMainMenuButton) {
  victoryMainMenuButton.addEventListener("click", () => {
    sessionStorage.removeItem("autoPlay");
    window.location.href = "index.html";
  });
}

if (sessionStorage.getItem("autoPlay") === "true") {
  sessionStorage.removeItem("autoPlay");
  startGame();
}