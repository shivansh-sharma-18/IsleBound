# 🏝️ IsleBound

**IsleBound** is a 2D browser-based survival game built with **HTML, CSS, JavaScript, and HTML5 Canvas**.

You are stranded on an island. Explore, gather resources, fight off enemies, craft a boat, and sail to the next island. **There are three islands in total, and you must complete all three to win the game.**

IsleBound uses no external framework or game engine. Everything, including rendering, input, collision, enemy AI, crafting, and persistence, is written in vanilla web technologies.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [How to Play](#-how-to-play)
- [Controls](#-controls)
- [The Three Islands](#-the-three-islands)
- [Enemies](#-enemies)
- [Combat](#-combat)
- [Resources, Inventory and Crafting](#-resources-inventory-and-crafting)
- [Boat and Progression](#-boat-and-progression)
- [World and Terrain](#-world-and-terrain)
- [Player Profile and Statistics](#-player-profile-and-statistics)
- [Data Storage and CRUD](#-data-storage-and-crud)
- [Technical Architecture](#-technical-architecture)
- [Project Structure](#-project-structure)
- [Module Reference](#-module-reference)
- [Getting Started](#-getting-started)
- [Technologies Used](#-technologies-used)
- [Responsive Design](#-responsive-design)
- [Development Practices](#-development-practices)
- [Privacy](#-privacy)
- [License](#-license)
- [Author](#-author)

---

## 🌍 Overview

| | |
|---|---|
| **Genre** | 2D survival / exploration |
| **Platform** | Modern desktop and mobile web browsers |
| **Islands** | 3 |
| **Goal** | Complete all three islands |
| **Tech** | HTML5, CSS3, JavaScript, Canvas, Web Storage API |
| **Dependencies** | None |

---

## ⭐ Features

- Main menu with Play, Player Profile, Controls, and Credits
- Real-time HTML5 Canvas rendering
- Keyboard movement with mouse aiming and shooting
- Projectile combat with knockback
- Three enemy types: **Pirate**, **Skeleton**, and **Boss**
- Detection-based enemy AI (idle, chase, attack)
- Wood and stone gathering with respawning resources
- Persistent inventory carried between islands
- Crafting system with island-specific boat costs
- Three islands with unique terrain, enemy counts, and difficulty
- Camera that follows the player through a large world
- Pause, game-over, and restart systems
- Persistent player profile and gameplay statistics
- Full CRUD support through `localStorage`
- Responsive interface

---

## 🎯 How to Play

1. Start on **Island 1** and explore the terrain.
2. Gather **wood** and **stone** from the environment.
3. Defend yourself against enemies using your ranged weapon.
4. Open the crafting menu and build a **boat** once you have enough resources.
5. Board the boat to complete the island and sail to the next one.
6. Repeat on **Island 2** and **Island 3**, facing tougher enemies and higher crafting costs each time.
7. Defeat the **Boss** and complete Island 3 to finish the game.

```text
Explore → Collect Resources → Fight Enemies → Craft Boat → Complete Island → Next Island
```

If your health reaches zero, the game ends. Press **R** to restart.

---

## 🎮 Controls

| Input | Action |
|-------|--------|
| `W` `A` `S` `D` | Move |
| Arrow Keys | Move |
| Mouse | Aim |
| Left Click | Shoot |
| `E` | Interact: gather resources, board boat, continue to next island |
| `C` | Open / close crafting |
| `B` | Craft boat |
| `P` | Pause / resume |
| `R` | Restart after game over |

---

## 🏝️ The Three Islands

Every island uses the same core systems but raises the stakes through a different layout, more enemies, and a higher boat cost. Resources you collect are **kept in your inventory** between islands, so planning ahead matters.

### Island 1: The Starting Island

An elliptical island that introduces movement, shooting, gathering, crafting, and the boat.

| Enemy | Count | | Resource | Count | | Boat Cost | Amount |
|-------|:-----:|-|----------|:-----:|-|-----------|:------:|
| Pirates | 6 | | Wood | 15 | | Wood | 20 |
| Skeletons | 4 | | Stone | 10 | | Stone | 10 |
| Boss | 0 | | | | | | |

### Island 2: The Expanded Challenge

A horizontal capsule-shaped island with rounded ends. Significantly more enemies and a higher crafting cost.

| Enemy | Count | | Resource | Count | | Boat Cost | Amount |
|-------|:-----:|-|----------|:-----:|-|-----------|:------:|
| Pirates | 10 | | Wood | 25 | | Wood | 40 |
| Skeletons | 7 | | Stone | 15 | | Stone | 20 |
| Boss | 0 | | | | | | |

Wood and stone carried over from Island 1 count toward the increased cost.

### Island 3: The Final Island

The last and most dangerous stage. Island 3 has its own unique terrain layout, the highest enemy density in the game, the highest boat crafting requirement, and the **Boss encounter**. Completing Island 3 completes IsleBound.

---

## 👾 Enemies

| Attribute | 🏴‍☠️ Pirate | 💀 Skeleton | 👑 Boss |
|-----------|:----------:|:-----------:|:-------:|
| Health | 40 | 60 | 420 |
| Speed | 95 | 125 | 90 |
| Detection Range | 500 | 550 | 700 |
| Attack Range | 55 | 50 | 80 |
| Attack Cooldown | 1.1 s | 0.8 s | 1.3 s |
| Damage | 8 | 12 | 22 |
| Radius | 15 | 16 | 34 |

### Enemy Behavior

Enemies use a state-based AI:

- **Idle:** the player is outside detection range, so the enemy stays put.
- **Chase:** the player is inside detection range, so the enemy faces and moves toward the player.
- **Attack:** the player is inside attack range, so the enemy attacks, deals damage, and waits out its cooldown.

---

## 🔫 Combat

The player aims with the mouse and shoots with the left mouse button.

```text
Mouse Position → Aim Angle → Create Bullet → Move Bullet → Collision Check
      → Enemy Hit → Deal Damage → Apply Knockback → Enemy Defeated
```

Shots fired, damage dealt, and enemies defeated are all recorded in the player's statistics.

**Player health:** enemy attacks reduce health and apply knockback. A short invulnerability window prevents rapid repeated damage. At zero health the **GAME OVER** screen is shown and the player can restart with `R`.

---

## 🌲 Resources, Inventory and Crafting

### Resources

The world contains **wood** and **stone**. Before a resource is placed, the game validates:

- Terrain type (valid grass areas only)
- Distance from obstacles
- Distance from other resources
- World boundaries

Stand near a resource and press `E` to collect it. Resources respawn over time.

### Inventory

The inventory tracks wood and stone and **persists between islands**.

### Crafting

Press `C` to open the crafting interface. The boat can be crafted from the interface or with `B`. The game validates your inventory against the current island's recipe before crafting.

---

## 🚤 Boat and Progression

The boat is the key to progressing through the game.

```text
Collect Resources → Craft Boat → Approach Boat → Press E → Island Completed → Press E → Next Island
```

The boat state resets automatically at the start of each island. After the boat on Island 3 is used and the final island is complete, the game is won.

---

## 🌊 World and Terrain

The world is tile-based with three terrain types:

| Code | Terrain | Role |
|:----:|---------|------|
| `W` | Water | Surrounds the island; not walkable |
| `S` | Sand | Beach / island boundary |
| `G` | Grass | Main play area; resources spawn here |

Island shapes are generated mathematically:

- **Island 1:** ellipse, using normalized horizontal and vertical distance from the center.
- **Island 2:** horizontal capsule, with a straight central section and rounded ends.
- **Island 3:** a distinct layout selected by the terrain system.

**Collision** uses rectangle-based checks plus terrain walkability. It prevents the player and enemies from entering invalid terrain, blocks movement through obstacles (trees, rocks), and prevents invalid resource placement.

**Camera:** follows the player, converts world coordinates to screen coordinates, and stays within world boundaries, so the world can be larger than the viewport.

**Game loop:** built on `requestAnimationFrame()` with delta-time, so gameplay is consistent across frame rates.

```text
requestAnimationFrame → Delta Time → Update (Player, Resources, Enemies, Bullets)
      → Collisions → Camera → Render → Repeat
```

---

## 👤 Player Profile and Statistics

The **Player Profile** page (`profile.html`) shows persistent statistics:

- Player name
- Games played
- Current island
- Islands completed
- Enemies defeated (total, pirates, skeletons, bosses)
- Shots fired
- Damage dealt
- Wood collected
- Stone collected
- Deaths
- Total play time

Statistics update automatically as events occur in-game, such as starting a game, defeating an enemy, firing a shot, collecting a resource, dying, or completing an island.

---

## 💾 Data Storage and CRUD

IsleBound stores profile data in the browser using the **Web Storage API** (`localStorage`) under the key:

```text
isleboundProfile
```

No backend or database is required. Data persists after the browser is closed.

| Operation | Behavior |
|-----------|----------|
| **Create** | A default profile is created if none exists |
| **Read** | The profile is loaded from `localStorage` and displayed |
| **Update** | Name and statistics are updated during gameplay |
| **Delete** | *Reset Profile* removes stored data and restores defaults |

---

## 🧩 Technical Architecture

The game is split into focused modules instead of one large script:

```text
Player         → Movement, Collision, Weapons
World          → Terrain, Obstacles, Camera
Gameplay       → Enemies, Resources, Inventory, Crafting, Boat
Progression    → Island Manager, Island Completion
Persistence    → Statistics, Player Profile
```

---

## 📁 Project Structure

```text
IsleBound/
│
├── index.html
├── profile.html
├── README.md
├── LICENSE
├── .gitignore
│
├── css/
│   ├── style.css
│   └── profile.css
│
├── js/
│   ├── main.js
│   ├── game.js
│   ├── gameLoop.js
│   ├── canvas.js
│   ├── input.js
│   ├── camera.js
│   ├── world.js
│   ├── terrain.js
│   ├── movement.js
│   ├── collision.js
│   ├── player.js
│   ├── weapons.js
│   ├── enemies.js
│   ├── obstacles.js
│   ├── resources.js
│   ├── inventory.js
│   ├── crafting.js
│   ├── boat.js
│   ├── islandComplete.js
│   ├── islandManager.js
│   ├── profile.js
│   └── stats.js
│
└── assets/
    ├── enemies/
    ├── environment/
    ├── items/
    ├── player/
    ├── ui/
    └── weapons/
```

---

## 🧠 Module Reference

| Module | Responsibility |
|--------|----------------|
| `main.js` | Starts the game and connects the loop to update/render |
| `game.js` | Central coordinator for all systems and game states |
| `gameLoop.js` | Animation loop and delta-time calculation |
| `canvas.js` | Canvas and rendering context setup |
| `input.js` | Keyboard, mouse position, clicks, shooting, interaction |
| `camera.js` | Camera following and world-to-screen conversion |
| `world.js` | World size, tile size, island terrain generation and switching |
| `terrain.js` | Reading tiles, selecting terrain images, terrain rendering |
| `movement.js` | Player movement and movement validation |
| `collision.js` | Collision and walkability logic |
| `player.js` | Player state, health, aiming, images, reset |
| `weapons.js` | Shooting, bullets, bullet rendering, shot statistics |
| `enemies.js` | Enemy definitions, spawning, AI, attacks, rendering |
| `obstacles.js` | Trees, rocks, and other environmental obstacles |
| `resources.js` | Resource generation, placement, collection, respawning |
| `inventory.js` | Stores collected wood and stone |
| `crafting.js` | Recipes and crafting logic |
| `boat.js` | Boat state, crafting, interaction, rendering, reset |
| `islandComplete.js` | Island completion state and screen |
| `islandManager.js` | Current island, progression, final-island detection |
| `stats.js` | Central gameplay statistics system |
| `profile.js` | Player profile page and `localStorage` CRUD |

---

## 🚀 Getting Started

No build step or installation is required.

**1. Clone the repository**

```bash
git clone https://github.com/shivansh-sharma-18/IsleBound.git
cd IsleBound
```

**2. Run the game**

Open `index.html` in a modern browser, or serve the folder locally:

```bash
# Python
python -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| **HTML5** | Menu, game page, profile page, UI structure |
| **CSS3** | Layout, styling, menus, responsive design |
| **JavaScript** | Game logic, input, combat, AI, crafting, progression, statistics |
| **HTML5 Canvas** | Real-time game rendering |
| **Web Storage API** | Persistent profile and statistics |
| **Git & GitHub** | Version control and hosting |

---

## 📱 Responsive Design

The interface adapts to desktop, tablet, and mobile screens. The Player Profile page uses responsive layouts so statistics stay readable on small displays.

---

## 🧹 Development Practices

- **Modular code:** each gameplay system lives in its own module
- **Separation of responsibilities:** every file has a clear, single purpose
- **Descriptive naming:** readable function and variable names
- **Reusable functions:** shared logic is not duplicated
- **Organized structure:** assets, styles, scripts, and docs are kept separate
- **Version control:** Git with a maintained `.gitignore`

---

## 🔐 Privacy

IsleBound runs entirely in the browser. All data is stored locally in `localStorage`, and nothing is sent to a server. No passwords, tokens, API keys, or personal credentials are collected or required.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shivansh Sharma**
Computer Science and Engineering (Artificial Intelligence and Machine Learning)

🔗 [github.com/shivansh-sharma-18/IsleBound](https://github.com/shivansh-sharma-18/IsleBound)

---

**IsleBound**: explore, survive, craft, and conquer all three islands. 🏝️
