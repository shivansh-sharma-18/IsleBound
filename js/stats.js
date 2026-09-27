const STORAGE_KEY = "isleboundProfile";

let unsavedPlayTime = 0;

function getStats() {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (!storedProfile) {
        return null;
    }
    try {
        return JSON.parse(storedProfile);
    } catch (error) {
        console.error("Unable to read IsleBound statistics:", error);
        return null;
    }
}

function saveStats(stats) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function updateStats(changes) {
    const stats = getStats();
    if (!stats) {
        return;
    }
    Object.keys(changes).forEach((key) => {
        if (typeof changes[key] === "number") {
            stats[key] = (stats[key] || 0) + changes[key];
        } else {
            stats[key] = changes[key];
        }
    });
    saveStats(stats);
}

function setStat(key, value) {
    const stats = getStats();
    if (!stats) {
        return;
    }
    stats[key] = value;
    saveStats(stats);
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
    const stats = getStats();
    if (!stats) {
        return;
    }
    unsavedPlayTime += seconds;
    if (unsavedPlayTime >= 1) {
        stats.totalPlayTime = (stats.totalPlayTime || 0) + unsavedPlayTime;
        unsavedPlayTime = 0;
        saveStats(stats);
    }
}

export {
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