const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let isDragging = false;

// Configuración del proyectil (Pájaro)
let bird = { x: 100, y: canvas.height - 150, radius: 20, color: '#e74c3c', vx: 0, vy: 0, launched: false };
const anchor = { x: 100, y: canvas.height - 150 };

// Configuración del objetivo (Cerdito/Precio Alto)
let target = { x: canvas.width - 150, y: canvas.height - 100, width: 60, height: 60, color: '#2ecc71', alive: true };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Suelo
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Dibujar Resortera (Lineas de tiro)
    if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(anchor.x, anchor.y);
        ctx.lineTo(bird.x, bird.y);
        ctx.strokeStyle = '#4b2c20';
        ctx.lineWidth = 5;
        ctx.stroke();
    }

    // Dibujar Proyectil
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.closePath();

    // Dibujar Objetivo
    if (target.alive) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.fillStyle = "black";
        ctx.fillText("PRECIO ALTO", target.x, target.y - 10);
    }

    update();
    requestAnimationFrame(draw);
}

function update() {
    if (bird.launched) {
        bird.x += bird.vx;
        bird.y += bird.vy;
        bird.vy += 0.5; // Gravedad

        // Colisión con el objetivo
        if (target.alive && bird.x + bird.radius > target.x && bird.x - bird.radius < target.x + target.width &&
            bird.y + bird.radius > target.y && bird.y - bird.radius < target.y + target.height) {
            target.alive = false;
            score += 100;
            scoreEl.innerText = score;
            alert("¡GANASTE! Pide tu descuento por WhatsApp");
            resetGame();
        }

        // Reiniciar si sale de la pantalla
        if (bird.y > canvas.height || bird.x > canvas.width) {
            resetGame();
        }
    }
}

// Controles Táctiles/Mouse
canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', launch);

canvas.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
canvas.addEventListener('touchmove', (e) => drag(e.touches[0]));
canvas.addEventListener('touchend', launch);

function startDrag(e) {
    if (bird.launched) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    if (Math.hypot(mx - bird.x, my - bird.y) < bird.radius * 2) {
        isDragging = true;
    }
}

function drag(e) {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    bird.x = e.clientX - rect.left;
    bird.y = e.clientY - rect.top;
}

function launch() {
    if (!isDragging) return;
    isDragging = false;
    bird.launched = true;
    bird.vx = (anchor.x - bird.x) * 0.15; // Fuerza de lanzamiento
    bird.vy = (anchor.y - bird.y) * 0.15;
}

function resetGame() {
    bird = { x: 100, y: canvas.height - 150, radius: 20, color: '#e74c3c', vx: 0, vy: 0, launched: false };
    target.alive = true;
    target.x = Math.random() * (canvas.width - 200) + 150;
}

draw();
