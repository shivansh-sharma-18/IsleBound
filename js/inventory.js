const inventory = {
    wood: 0,
    stone: 0
}

function addResource(type, amount) {
    if (inventory[type] === undefined) {
        return;
    }

    inventory[type] += amount;
}

export { inventory, addResource };