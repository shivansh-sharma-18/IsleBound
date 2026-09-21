import { canvas } from "./canvas.js";

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    leftButtonDown: false,
    clicked: false
}

canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

canvas.addEventListener("mousedown", function (event) {
    if (event.button === 0) {
        mouse.leftButtonDown = true;
        mouse.clicked = true;
    }
});

canvas.addEventListener("mouseup", function (event) {
    if (event.button === 0) {
        mouse.leftButtonDown = false;
    }
});

const keys = {};

window.addEventListener("keydown", function(event){
    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key === "arrowup" ||
        key === "arrowdown" ||
        key === "arrowleft" ||
        key === "arrowright"
    ) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", function (event) {
    const key = event.key.toLowerCase();

    keys[key] = false;
});

export { mouse, keys };