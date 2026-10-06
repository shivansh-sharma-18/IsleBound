const DB_NAME = "IsleBoundDB";
const DB_VERSION = 1;
const USERS_STORE = "users";
const STATS_STORE = "stats";

let dbInstance = null;

function openDB() {
    if (dbInstance) {
        return Promise.resolve(dbInstance);
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(USERS_STORE)) {
                db.createObjectStore(USERS_STORE, { keyPath: "username" });
            }

            if (!db.objectStoreNames.contains(STATS_STORE)) {
                db.createObjectStore(STATS_STORE, { keyPath: "username" });
            }
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error("IndexedDB open error:", event.target.error);
            reject(event.target.error);
        };
    });
}

async function getUser(username) {
    if (!username) return null;
    const db = await openDB();
    const key = username.trim().toLowerCase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([USERS_STORE], "readonly");
        const store = transaction.objectStore(USERS_STORE);
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function createUser(userRecord) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([USERS_STORE], "readwrite");
        const store = transaction.objectStore(USERS_STORE);
        const request = store.add(userRecord);

        request.onsuccess = () => {
            resolve(userRecord);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function getUserStats(username) {
    if (!username) return null;
    const db = await openDB();
    const key = username.trim().toLowerCase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STATS_STORE], "readonly");
        const store = transaction.objectStore(STATS_STORE);
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function saveUserStats(username, stats) {
    if (!username) return null;
    const db = await openDB();
    const key = username.trim().toLowerCase();

    const record = {
        ...stats,
        username: key,
        lastUpdated: Date.now(),
    };

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STATS_STORE], "readwrite");
        const store = transaction.objectStore(STATS_STORE);
        const request = store.put(record);

        request.onsuccess = () => {
            resolve(record);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

export {
    openDB,
    getUser,
    createUser,
    getUserStats,
    saveUserStats,
};
