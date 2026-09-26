# IsleBound

IsleBound is a browser-based 2D survival game built using HTML5 Canvas, CSS, and modular JavaScript.

The player explores an island, collects resources, fights enemies, crafts items, and progresses through multiple islands. The game focuses on exploration, survival, combat, resource management, crafting, and island progression.

---

## 🎮 Features

- 2D top-down survival gameplay
- Island exploration
- Player movement using keyboard controls
- Mouse-based aiming and shooting
- Combat system
- Three enemy types:
  - Pirate
  - Skeleton
  - Boss
- Enemy detection and chase behavior
- Enemy attack system
- Player health and damage system
- Player hit effects and knockback
- Wood and stone resource collection
- Inventory system
- Crafting system
- Boat crafting
- Multiple-island progression
- Island completion system
- Game-over and restart system
- Pause and resume functionality
- Main menu
- Controls screen
- Credits screen
- Modular JavaScript architecture

---

## 🕹️ Controls

| Key / Input | Action |
|---|---|
| `WASD` / Arrow Keys | Move |
| Mouse | Aim |
| Left Click | Shoot |
| `E` | Interact / Gather |
| `C` | Open / Close Crafting |
| `B` | Craft Boat |
| `P` | Pause / Resume |
| `R` | Restart after Game Over |

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- HTML5 Canvas
- ES6 Modules

No external game engine is used.

---

## 📁 Project Structure

```text
IsleBound/
│
├── index.html
├── style.css
├── README.md
├── LICENSE
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
│   └── islandManager.js
│
└── assets/
    ├── effects/
    ├── enemies/
    ├── environment/
    ├── items/
    ├── player/
    ├── ui/
    └── weapons/