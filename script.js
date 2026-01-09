const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

const box = 20; // Tamaño del cuadrito
canvas.width = 300;
canvas.height = 300;

let snake = [{x: 140, y: 140}];
let food = { x: Math.floor(Math.random()*15)*box, y: Math.floor(Math.random()*15)*box };
let d = "RIGHT";
let score = 0;

// Control por Teclado (PC)
document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp" && d !== "DOWN") d = "UP";
    if(e.key === "ArrowDown" && d !== "UP") d = "DOWN";
    if(e.key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    if(e.key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
});

// Control por Botones (Celular)
function setDir(newDir) {
    if(newDir === "UP" && d !== "DOWN") d = "UP";
    if(newDir === "DOWN" && d !== "UP") d = "DOWN";
    if(newDir === "LEFT" && d !== "RIGHT") d = "LEFT";
    if(newDir === "RIGHT" && d !== "LEFT") d = "RIGHT";
}

function game() {
    let headX = snake[0].x;
    let headY = snake[0].y;

    if(d === "UP") headY -= box;
    if(d === "DOWN") headY += box;
    if(d === "LEFT") headX -= box;
    if(d === "RIGHT") headX += box;

    // Comer fruta
    if(headX === food.x && headY === food.y) {
        score += 10;
        scoreEl.innerText = score;
        food = { x: Math.floor(Math.random()*15)*box, y: Math.floor(Math.random()*15)*box };
    } else {
        snake.pop();
    }

    let newHead = {x: headX, y: headY};

    // Colisiones (Pared o Cuerpo)
    if(headX < 0 || headX >= canvas.width || headY < 0 || headY >= canvas.height || snake.some(s => s.x === headX && s.y === headY)) {
        clearInterval(loop);
        alert("GAME OVER. Puntos: " + score + ". ¡Toma captura!");
        location.reload();
    }

    snake.unshift(newHead);

    // Dibujar
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? "#27ae60" : "#2ecc71"; // Cabeza más oscura
        ctx.fillRect(s.x, s.y, box-2, box-2); // El -2 crea el efecto de cuadritos separados
    });

    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, box-2, box-2);
}

let loop = setInterval(game, 150);
