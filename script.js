const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const levelDisp = document.getElementById('level-display');
const rewardText = document.getElementById('reward-text');

canvas.width = 350;
canvas.height = 500;

let currentLevel = 1;
let player = { x: 30, y: 30, radius: 10 };
let goal = { x: 300, y: 450, w: 40, h: 40 };

// Definición de Niveles (Obstáculos)
const levels = {
    1: { obstacles: [{x: 0, y: 150, w: 250, h: 40}, {x: 100, y: 300, w: 250, h: 40}], reward: "Sigue así..." },
    2: { obstacles: [{x: 0, y: 100, w: 300, h: 25}, {x: 50, y: 200, w: 300, h: 25}, {x: 0, y: 300, w: 300, h: 25}, {x: 50, y: 400, w: 300, h: 25}], reward: "PREMIO: 1 Perfil HBO MAX" },
    3: { obstacles: [{x: 0, y: 50, w: 320, h: 15}, {x: 30, y: 120, w: 320, h: 15}, {x: 0, y: 190, w: 320, h: 15}, {x: 30, y: 260, w: 320, h: 15}, {x: 0, y: 330, w: 320, h: 15}, {x: 30, y: 400, w: 320, h: 15}], reward: "IMPOSIBLE: Netflix 15 Días" }
};

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Meta
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
    ctx.fillStyle = "black";
    ctx.fillText("META", goal.x + 5, goal.y + 25);

    // Dibujar Obstáculos
    ctx.fillStyle = "#e74c3c";
    levels[currentLevel].obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
    });

    // Dibujar Jugador
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#3498db";
    ctx.fill();
    ctx.closePath();
}

function checkCollision(nx, ny) {
    // Bordes
    if (nx < 10 || nx > canvas.width - 10 || ny < 10 || ny > canvas.height - 10) return true;
    
    // Obstáculos
    let hit = false;
    levels[currentLevel].obstacles.forEach(obs => {
        if (nx + 10 > obs.x && nx - 10 < obs.x + obs.w && ny + 10 > obs.y && ny - 10 < obs.y + obs.h) {
            hit = true;
        }
    });
    return hit;
}

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    let touch = e.touches[0];
    let rect = canvas.getBoundingClientRect();
    let nx = touch.clientX - rect.left;
    let ny = touch.clientY - rect.top;

    if (!checkCollision(nx, ny)) {
        player.x = nx;
        player.y = ny;
    } else {
        // Si choca, regresa al inicio del nivel
        player.x = 30;
        player.y = 30;
    }

    // Ganar Nivel
    if (player.x > goal.x && player.y > goal.y) {
        if (currentLevel < 3) {
            currentLevel++;
            player.x = 30; player.y = 30;
            levelDisp.innerText = currentLevel;
            rewardText.innerText = levels[currentLevel].reward;
        } else {
            alert("¡LO LOGRASTE! Envía captura de este mensaje: PREMIO NETFLIX 15 DÍAS");
        }
    }
    draw();
}, {passive: false});

draw();
