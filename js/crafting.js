import { inventory } from "./inventory.js";
import { getCurrentIsland } from "./islandManager.js";
import { isBoatCrafted } from "./boat.js";

const recipes = {
  boat: {
    1: {
      wood: 20,
      stone: 10,
    },
    2: {
      wood: 40,
      stone: 20,
    },
  },
};

function getBoatRecipe() {
  const island = getCurrentIsland();
  return recipes.boat[island] || null;
}

function canCraft(recipe) {
  if (!recipe || isBoatCrafted()) {
    return false;
  }
  return inventory.wood >= recipe.wood && inventory.stone >= recipe.stone;
}

function craft(recipe) {
  if (!recipe || !canCraft(recipe)) {
    return false;
  }

  inventory.wood -= recipe.wood;
  inventory.stone -= recipe.stone;

  return true;
}

export { recipes, getBoatRecipe, canCraft, craft };