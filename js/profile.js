const STORAGE_KEY = "isleboundProfile";

const defaultProfile = {
    playerName: "Player",
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

const profileFormSection = document.getElementById("profileFormSection");
const statsSection = document.getElementById("statsSection");
const profileForm = document.getElementById("profileForm");
const playerNameInput = document.getElementById("playerName");
const saveProfileButton = document.getElementById("saveProfileButton");
const editProfileButton = document.getElementById("editProfileButton");
const resetProfileButton = document.getElementById("resetProfileButton");
const backToGameButton = document.getElementById("backToGameButton");

function createProfile(playerName) {
    const profile = {
        ...defaultProfile,
        playerName: playerName,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
}

function getProfile() {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (!storedProfile) {
        return null;
    }
    try {
        return JSON.parse(storedProfile);
    } catch (error) {
        console.error("Unable to read IsleBound profile:", error);
        return null;
    }
}

function updateProfile(updatedData) {
    const currentProfile = getProfile();
    if (!currentProfile) {
        return null;
    }
    const updatedProfile = {
        ...currentProfile,
        ...updatedData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    return updatedProfile;
}

function deleteProfile() {
    localStorage.removeItem(STORAGE_KEY);
}

function displayProfile(profile) {
    document.getElementById("displayPlayerName").textContent = profile.playerName;
    document.getElementById("gamesPlayed").textContent = profile.gamesPlayed;
    document.getElementById("currentIsland").textContent = profile.currentIsland;
    document.getElementById("islandsCompleted").textContent = profile.islandsCompleted;
    document.getElementById("enemiesDefeated").textContent = profile.enemiesDefeated;
    document.getElementById("piratesDefeated").textContent = profile.piratesDefeated;
    document.getElementById("skeletonsDefeated").textContent = profile.skeletonsDefeated;
    document.getElementById("bossesDefeated").textContent = profile.bossesDefeated;
    document.getElementById("shotsFired").textContent = profile.shotsFired;
    document.getElementById("damageDealt").textContent = profile.damageDealt;
    document.getElementById("woodCollected").textContent = profile.woodCollected;
    document.getElementById("stoneCollected").textContent = profile.stoneCollected;
    document.getElementById("deaths").textContent = profile.deaths;
    document.getElementById("totalPlayTime").textContent = formatPlayTime(profile.totalPlayTime);
}

function formatPlayTime(seconds) {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function showProfile() {
    const profile = getProfile();
    if (!profile) {
        profileFormSection.classList.remove("hidden");
        statsSection.classList.add("hidden");
        editProfileButton.classList.add("hidden");
        resetProfileButton.classList.add("hidden");
        playerNameInput.value = "";
        saveProfileButton.textContent = "CREATE PROFILE";
        return;
    }

    profileFormSection.classList.add("hidden");
    statsSection.classList.remove("hidden");
    editProfileButton.classList.remove("hidden");
    resetProfileButton.classList.remove("hidden");
    displayProfile(profile);
}

profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        return;
    }

    const existingProfile = getProfile();
    if (existingProfile) {
        updateProfile({
            playerName: playerName,
        });
    } else {
        createProfile(playerName);
    }

    showProfile();
});

editProfileButton.addEventListener("click", () => {
    const profile = getProfile();
    if (!profile) {
        return;
    }

    profileFormSection.classList.remove("hidden");
    statsSection.classList.add("hidden");
    playerNameInput.value = profile.playerName;
    saveProfileButton.textContent = "SAVE CHANGES";
});

resetProfileButton.addEventListener("click", () => {
    const confirmed = confirm(
        "Are you sure you want to reset your IsleBound profile and statistics?"
    );
    if (!confirmed) {
        return;
    }

    deleteProfile();
    showProfile();
});

backToGameButton.addEventListener("click", () => {
    window.location.href = "index.html";
});

showProfile();