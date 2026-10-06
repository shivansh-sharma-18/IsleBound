import { getUser, createUser, saveUserStats } from "./db.js";

const SESSION_USER_KEY = "islebound_active_user";

const defaultStatsTemplate = {
    gamesPlayed: 0,
    currentIsland: 1,
    islandsCompleted: 0,
    enemiesDefeated: 0,
    piratesDefeated: 0,
    skeletonsDefeated: 0,
    bossesDefeated: 0,
    shotsFired: 0,
    damageDealt: 0,
    woodCollected: 0,
    stoneCollected: 0,
    deaths: 0,
    totalPlayTime: 0,
};

function getCurrentUser() {
    const raw = sessionStorage.getItem(SESSION_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    if (!user) {
        sessionStorage.removeItem(SESSION_USER_KEY);
    } else {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    }
}

function isGuest() {
    return getCurrentUser() === null;
}

async function login(username, password) {
    const cleanUsername = (username || "").trim();
    if (!cleanUsername) {
        throw new Error("Please enter a username.");
    }
    if (!password) {
        throw new Error("Please enter your password.");
    }

    const user = await getUser(cleanUsername);
    if (!user) {
        throw new Error("User not found.");
    }

    if (user.password !== password) {
        throw new Error("Incorrect password.");
    }

    const sessionUser = {
        username: user.username,
        displayName: user.displayName || cleanUsername,
    };

    setCurrentUser(sessionUser);
    return sessionUser;
}

async function signup(username, password) {
    const cleanUsername = (username || "").trim();
    if (!cleanUsername) {
        throw new Error("Please enter a username.");
    }

    if (cleanUsername.length < 3) {
        throw new Error("Username must be at least 3 characters long.");
    }

    if (cleanUsername.length > 20) {
        throw new Error("Username must be at most 20 characters long.");
    }

    if (cleanUsername.toLowerCase() === "guest") {
        throw new Error("'Guest' is a reserved name. Please choose another username.");
    }

    if (!password) {
        throw new Error("Please enter a password.");
    }

    if (password.length < 4) {
        throw new Error("Password must be at least 4 characters long.");
    }

    const existingUser = await getUser(cleanUsername);
    if (existingUser) {
        throw new Error("A user with this username already exists.");
    }

    const normalizedKey = cleanUsername.toLowerCase();
    const newUserRecord = {
        username: normalizedKey,
        displayName: cleanUsername,
        password: password,
        createdAt: Date.now(),
    };

    await createUser(newUserRecord);
    await saveUserStats(normalizedKey, {
        ...defaultStatsTemplate,
        playerName: cleanUsername,
    });

    const sessionUser = {
        username: normalizedKey,
        displayName: cleanUsername,
    };

    setCurrentUser(sessionUser);
    return sessionUser;
}

function logout() {
    setCurrentUser(null);
}

export {
    getCurrentUser,
    setCurrentUser,
    isGuest,
    login,
    signup,
    logout,
    defaultStatsTemplate,
};
