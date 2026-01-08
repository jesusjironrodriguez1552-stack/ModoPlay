const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// Ajuste de pantalla completa
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let isDragging = false;

// POSICIÓN CORREGIDA: Movido a la derecha (x: 200) para dar espacio a estirar
const startX = 200;
const startY = canvas.height - 180;

let bird = { x: startX, y: startY, radius: 20, color: '#e74c3c', vx: 0, vy: 0, launched: false };
const anchor = { x: startX, y: startY };

// Objetivo (Precios Altos)
let target = { x: canvas.width - 120, y: canvas.height - 110, width: 60, height: 60, color: '#2ecc71', alive: true };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Suelo
    ctx.fillStyle = '#2ed573';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // Dibujar Resortera
    ctx.beginPath();
    ctx.moveTo(anchor.x, anchor.y);
    ctx.lineTo(bird.x, bird.y);
    ctx.strokeStyle = '#4b2c20';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Dibujar Proyectil (Tu logo o círculo)
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();

    // Dibujar Objetivo
    if (target.alive) {
        ctx.fillStyle = target.color;
        ctx.fillRect(target.x, target.y, target.width, target.height);
        ctx.fillStyle = "black";
        ctx.font = "bold 12px Arial";
        ctx.fillText("PRECIO ALTO", target.x - 10, target.y - 10);
    }

    update();
    requestAnimationFrame(draw);
}

function update() {
    if (bird.launched) {
        bird.x += bird.vx;
        bird.y += bird.vy;
        bird.vy += 0.6; // Gravedad un poco más pesada

        // Colisión
        if (target.alive && bird.x + bird.radius > target.x && bird.x - bird.radius < target.x + target.width &&
            bird.y + bird.radius > target.y && bird.y - bird.radius < target.y + target.height) {
            target.alive = false;
            score += 100;
            scoreEl.innerText = score;
            setTimeout(() => {
                alert("¡Nivel Superado! Avisa al soporte por tu descuento.");
                resetGame();
            }, 100);
        }

        // Reiniciar si sale de límites
        if (bird.y > canvas.height || bird.x > canvas.width || bird.x < 0) {
            resetGame();
        }
    }
}

// Eventos táctiles y mouse
canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', launch);

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrag(e.touches[0]); }, {passive: false});
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); drag(e.touches[0]); }, {passive: false});
canvas.addEventListener('touchend', launch);

function startDrag(e) {
    if (bird.launched) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    // Detectar si tocamos cerca del pájaro
    if (Math.hypot(mx - bird.x, my - bird.y) < 50) {
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
    // POTENCIA CORREGIDA: Se multiplicó por 0.35 para que vuele más lejos
    bird.vx = (anchor.x - bird.x) * 0.35; 
    bird.vy = (anchor.y - bird.y) * 0.35;
}

function resetGame() {
    bird.x = startX;
    bird.y = startY;
    bird.vx = 0;
    bird.vy = 0;
    bird.launched = false;
    target.alive = true;
    target.x = Math.random() * (canvas.width - 250) + 200;
}

draw();
