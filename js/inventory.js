const inventory = {
  wood: 0,
  stone: 0,
};

function addResource(type, amount) {
  if (inventory[type] === undefined) {
    return;
  }

  inventory[type] += amount;
}

function resetInventory() {
  inventory.wood = 0;
  inventory.stone = 0;
}

export { inventory, addResource, resetInventory };