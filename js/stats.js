import { getUserStats, saveUserStats } from "./db.js";
import { getCurrentUser, defaultStatsTemplate } from "./auth.js";

let unsavedPlayTime = 0;

let activeStats = createDefaultStats("Guest");

function createDefaultStats(playerName = "Guest") {
    return {
        ...defaultStatsTemplate,
        playerName: playerName,
    };
}

async function initStats() {
    const user = getCurrentUser();
    if (user && user.username) {
        try {
            const dbStats = await getUserStats(user.username);
            if (dbStats) {
                activeStats = {
                    ...createDefaultStats(user.displayName || user.username),
                    ...dbStats,
                };
                return activeStats;
            }
        } catch (error) {
            console.error("Error loading stats from IndexedDB:", error);
        }
        activeStats = createDefaultStats(user.displayName || user.username);
    } else {
        activeStats = createDefaultStats("Guest");
    }
    return activeStats;
}

initStats();

function getStats() {
    return activeStats;
}

function saveStats(stats) {
    activeStats = { ...stats };
    const user = getCurrentUser();
    if (user && user.username) {
        saveUserStats(user.username, activeStats).catch((err) => {
            console.error("Failed to save stats to IndexedDB:", err);
        });
    }
}

function updateStats(changes) {
    if (!activeStats) {
        activeStats = createDefaultStats();
    }
    Object.keys(changes).forEach((key) => {
        if (typeof changes[key] === "number") {
            activeStats[key] = (activeStats[key] || 0) + changes[key];
        } else {
            activeStats[key] = changes[key];
        }
    });
    saveStats(activeStats);
}

function setStat(key, value) {
    if (!activeStats) {
        activeStats = createDefaultStats();
    }
    activeStats[key] = value;
    saveStats(activeStats);
}

function recordGameStarted() {
    updateStats({
        gamesPlayed: 1,
    });
}

function recordEnemyDefeated(type) {
    const changes = {
        enemiesDefeated: 1,
    };
    if (type === "pirate") {
        changes.piratesDefeated = 1;
    }
    if (type === "skeleton") {
        changes.skeletonsDefeated = 1;
    }
    if (type === "boss") {
        changes.bossesDefeated = 1;
    }
    updateStats(changes);
}

function recordShotFired() {
    updateStats({
        shotsFired: 1,
    });
}

function recordDamageDealt(amount) {
    updateStats({
        damageDealt: amount,
    });
}

function recordResourceCollected(type, amount) {
    if (type === "wood") {
        updateStats({
            woodCollected: amount,
        });
    }
    if (type === "stone") {
        updateStats({
            stoneCollected: amount,
        });
    }
}

function recordDeath() {
    updateStats({
        deaths: 1,
    });
}

function recordIslandCompleted() {
    updateStats({
        islandsCompleted: 1,
    });
}

function setCurrentIsland(islandNumber) {
    setStat("currentIsland", islandNumber);
}

function addPlayTime(seconds) {
    if (!activeStats) {
        return;
    }
    unsavedPlayTime += seconds;
    if (unsavedPlayTime >= 1) {
        const added = Math.floor(unsavedPlayTime);
        activeStats.totalPlayTime = (activeStats.totalPlayTime || 0) + added;
        unsavedPlayTime -= added;
        saveStats(activeStats);
    }
}

export {
    initStats,
    getStats,
    saveStats,
    updateStats,
    setStat,
    recordGameStarted,
    recordEnemyDefeated,
    recordShotFired,
    recordDamageDealt,
    recordResourceCollected,
    recordDeath,
    recordIslandCompleted,
    setCurrentIsland,
    addPlayTime,
};