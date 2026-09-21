import { inventory } from "./inventory.js";

const recipes = {
  boat: {
    wood: 20,
    stone: 10,
  },
};

function canCraft(recipe) {
  return (
    inventory.wood >= recipe.wood && 
    inventory.stone >= recipe.stone
  );
}
function craft(recipe) {
  if (!canCraft(recipe)) {
    return false;
  }

  inventory.wood -= recipe.wood;
  inventory.stone -= recipe.stone;

  return true;
}

export { recipes, canCraft, craft };
