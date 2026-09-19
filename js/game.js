import { canvas, ctx } from "./canvas.js";

function update(dt) {

}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#8fd3e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export { update, draw };