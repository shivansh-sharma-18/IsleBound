import { gameLoop } from "./gameLoop.js";
import { update, draw, setPaused } from "./game.js";
import { recordGameStarted, initStats } from "./stats.js";
import { getCurrentUser, logout } from "./auth.js";

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

const playerNameDisplay = document.getElementById("playerNameDisplay");
const loginMenuButton = document.getElementById("loginMenuButton");
const signupMenuButton = document.getElementById("signupMenuButton");
const logoutMenuButton = document.getElementById("logoutMenuButton");

let gameStarted = false;
let controlsOpenedFrom = "mainMenu";

function updateAuthUI() {
  const user = getCurrentUser();
  if (user && user.displayName) {
    playerNameDisplay.textContent = user.displayName.toUpperCase();
    loginMenuButton.classList.add("hidden");
    signupMenuButton.classList.add("hidden");
    logoutMenuButton.classList.remove("hidden");
  } else {
    playerNameDisplay.textContent = "GUEST";
    loginMenuButton.classList.remove("hidden");
    signupMenuButton.classList.remove("hidden");
    logoutMenuButton.classList.add("hidden");
  }
}

if (loginMenuButton) {
  loginMenuButton.addEventListener("click", () => {
    window.location.href = "auth.html?mode=login";
  });
}

if (signupMenuButton) {
  signupMenuButton.addEventListener("click", () => {
    window.location.href = "auth.html?mode=signup";
  });
}

if (logoutMenuButton) {
  logoutMenuButton.addEventListener("click", async () => {
    logout();
    await initStats();
    updateAuthUI();
  });
}

async function startGame() {
  await initStats();
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

updateAuthUI();

if (sessionStorage.getItem("autoPlay") === "true") {
  sessionStorage.removeItem("autoPlay");
  startGame();
}