const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

// Tamaño de cada "cuadrito" en el juego
const box = 20;

// Tamaño del canvas (ajustable)
canvas.width = 320; // 16 * 20
canvas.height = 320; // 16 * 20

// Posición inicial de la serpiente
let snake = [{ x: 8 * box, y: 8 * box }]; // Empieza más centrado

// Posición inicial de la comida
let food = {};
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
    // Asegurarse de que la comida no aparezca dentro de la serpiente
    for (let i = 0; i < snake.length; i++) {
        if (food.x === snake[i].x && food.y === snake[i].y) {
            generateFood(); // Si choca, genera otra
            return;
        }
    }
}
generateFood();

let score = 0;
let d; // Dirección

// Manejo de teclado para PC
document.addEventListener("keydown", e => {
    if (e.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if (e.keyCode == 38 && d != "DOWN") d = "UP";
    else if (e.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if (e.keyCode == 40 && d != "UP") d = "DOWN";
});

// Manejo de botones móviles
function changeDirection(direction) {
    if (direction == "LEFT" && d != "RIGHT") d = "LEFT";
    else if (direction == "UP" && d != "DOWN") d = "UP";
    else if (direction == "RIGHT" && d != "LEFT") d = "RIGHT";
    else if (direction == "DOWN" && d != "UP") d = "DOWN";
}

function draw() {
    // Dibujar fondo
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "#27ae60" : "#2ecc71"; // Verde oscuro y claro
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "#2c3e50"; // Borde para los cuadros
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Dibujar comida
    ctx.fillStyle = "#e74c3c"; // Rojo
    ctx.fillRect(food.x, food.y, box, box);
    ctx.strokeStyle = "#c0392b";
    ctx.strokeRect(food.x, food.y, box, box);

    // Mover la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Si come la comida
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreEl.innerHTML = score;
        generateFood(); // Genera nueva comida
    } else {
        snake.pop(); // Elimina la cola si no comió
    }

    let newHead = { x: snakeX, y: snakeY };

    // Game Over: Colisión con paredes o consigo mismo
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert(`¡FIN DEL JUEGO! Tus puntos: ${score}\n\nEnvía una captura para reclamar tu premio.\n\nNivel 1 (50 pts): Sin premio\nNivel 2 (100 pts): HBO Max\nNivel 3 (200 pts): Netflix 15 Días`);
        resetGame(); // Reiniciar para el siguiente intento
    }

    snake.unshift(newHead); // Añade la nueva cabeza
}

// Función de colisión con el cuerpo
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

// Reiniciar el juego
function resetGame() {
    snake = [{ x: 8 * box, y: 8 * box }];
    generateFood();
    score = 0;
    scoreEl.innerHTML = score;
    d = undefined; // Borrar dirección para empezar quieto
    game = setInterval(draw, 100);
}

// Iniciar el juego
let game = setInterval(draw, 100);
