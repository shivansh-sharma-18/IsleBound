import { getCurrentUser, logout } from "./auth.js";
import { getUserStats } from "./db.js";
import { initStats, getStats } from "./stats.js";

const badgePlayerName = document.getElementById("badgePlayerName");
const guestNoticeSection = document.getElementById("guestNoticeSection");
const statsSection = document.getElementById("statsSection");
const statsHeaderTitle = document.getElementById("statsHeaderTitle");

const guestLoginButton = document.getElementById("guestLoginButton");
const guestSignupButton = document.getElementById("guestSignupButton");

const loginActionButton = document.getElementById("loginActionButton");
const signupActionButton = document.getElementById("signupActionButton");
const logoutActionButton = document.getElementById("logoutActionButton");
const backToGameButton = document.getElementById("backToGameButton");

function formatPlayTime(seconds) {
    const totalSeconds = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function displayStats(stats, displayName, isGuestUser) {
    document.getElementById("displayPlayerName").textContent = displayName;
    document.getElementById("displayAccountType").textContent = isGuestUser ? "Guest (Temporary)" : "Registered Profile";
    document.getElementById("gamesPlayed").textContent = stats.gamesPlayed || 0;
    document.getElementById("currentIsland").textContent = stats.currentIsland || 1;
    document.getElementById("islandsCompleted").textContent = stats.islandsCompleted || 0;
    document.getElementById("enemiesDefeated").textContent = stats.enemiesDefeated || 0;
    document.getElementById("piratesDefeated").textContent = stats.piratesDefeated || 0;
    document.getElementById("skeletonsDefeated").textContent = stats.skeletonsDefeated || 0;
    document.getElementById("bossesDefeated").textContent = stats.bossesDefeated || 0;
    document.getElementById("shotsFired").textContent = stats.shotsFired || 0;
    document.getElementById("damageDealt").textContent = stats.damageDealt || 0;
    document.getElementById("woodCollected").textContent = stats.woodCollected || 0;
    document.getElementById("stoneCollected").textContent = stats.stoneCollected || 0;
    document.getElementById("deaths").textContent = stats.deaths || 0;
    document.getElementById("totalPlayTime").textContent = formatPlayTime(stats.totalPlayTime);
}

async function refreshProfileView() {
    const currentUser = getCurrentUser();

    if (currentUser && currentUser.username) {
        badgePlayerName.textContent = (currentUser.displayName || currentUser.username).toUpperCase();
        guestNoticeSection.classList.add("hidden");
        loginActionButton.classList.add("hidden");
        signupActionButton.classList.add("hidden");
        logoutActionButton.classList.remove("hidden");
        statsHeaderTitle.textContent = "LIFETIME STATISTICS";

        let stats = await getUserStats(currentUser.username);
        if (!stats) {
            stats = getStats();
        }
        displayStats(stats, currentUser.displayName || currentUser.username, false);
    } else {
        badgePlayerName.textContent = "GUEST";
        guestNoticeSection.classList.remove("hidden");
        loginActionButton.classList.remove("hidden");
        signupActionButton.classList.remove("hidden");
        logoutActionButton.classList.add("hidden");
        statsHeaderTitle.textContent = "SESSION STATISTICS (GUEST)";

        const currentGuestStats = getStats();
        displayStats(currentGuestStats, "Guest", true);
    }
}

if (guestLoginButton) {
    guestLoginButton.addEventListener("click", () => {
        window.location.href = "auth.html?mode=login";
    });
}

if (guestSignupButton) {
    guestSignupButton.addEventListener("click", () => {
        window.location.href = "auth.html?mode=signup";
    });
}

if (loginActionButton) {
    loginActionButton.addEventListener("click", () => {
        window.location.href = "auth.html?mode=login";
    });
}

if (signupActionButton) {
    signupActionButton.addEventListener("click", () => {
        window.location.href = "auth.html?mode=signup";
    });
}

if (logoutActionButton) {
    logoutActionButton.addEventListener("click", async () => {
        logout();
        await initStats();
        await refreshProfileView();
    });
}

if (backToGameButton) {
    backToGameButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

initStats().then(() => {
    refreshProfileView();
});