let lastTime = 0;

function gameLoop(timestamp, update, draw) {
    if (lastTime == 0) {
        lastTime = timestamp;
    }

    const dt = (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    dt = Math.min(dt, 0.05);
    
    update(dt);
    draw();
    
    requestAnimationFrame((nextTimestamp) => {
        gameLoop(nextTimestamp, update, draw);
    });
}

export { gameLoop };