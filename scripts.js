// Configuración del juego
let gameState = {
    currentRound: 1,
    isPlayerTurn: true,
    playerLives: 5,
    aiLives: 5,
    pills: [],
    selectedPill: null,
    gameOver: false
};

// Elementos del DOM
const elements = {
    currentRound: document.getElementById('current-round'),
    currentTurn: document.getElementById('current-turn'),
    playerLives: document.getElementById('player-lives'),
    aiLives: document.getElementById('ai-lives'),
    pillsContainer: document.getElementById('pills-container'),
    takePillBtn: document.getElementById('take-pill-btn'),
    gameLog: document.getElementById('game-log'),
    gameOverModal: document.getElementById('game-over-modal'),
    gameResult: document.getElementById('game-result'),
    finalMessage: document.getElementById('final-message'),
    restartBtn: document.getElementById('restart-btn')
};

// Generar pastillas para cada ronda
function generatePills() {
    gameState.pills = [];
    for (let i = 0; i < 4; i++) {
        let type = 'neutral';
        if (i === 0) type = 'correct';
        else if (i === 1) type = 'poison';
        
        gameState.pills.push({
            id: i,
            type: type,
            taken: false
        });
    }
    
    // Mezclar las pastillas aleatoriamente
    for (let i = gameState.pills.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.pills[i], gameState.pills[j]] = [gameState.pills[j], gameState.pills[i]];
    }
}

// Mostrar las pastillas en la interfaz
function renderPills() {
    elements.pillsContainer.innerHTML = '';
    gameState.pills.forEach((pill, index) => {
        const pillElement = document.createElement('button');
        pillElement.textContent = '💊';
        pillElement.style.fontSize = '30px';
        pillElement.style.margin = '5px';
        pillElement.style.padding = '10px';
        
        if (pill.taken) {
            pillElement.disabled = true;
            pillElement.style.opacity = '0.3';
        } else if (gameState.isPlayerTurn) {
            pillElement.onclick = () => selectPill(index);
            if (gameState.selectedPill === index) {
                pillElement.classList.add('selected');
            }
        }
        
        elements.pillsContainer.appendChild(pillElement);
    });
}

// Seleccionar una pastilla
function selectPill(index) {
    gameState.selectedPill = index;
    elements.takePillBtn.disabled = false;
    renderPills();
    updateUI();
}

// Tomar la pastilla seleccionada
function takePill(pillIndex) {
    const pill = gameState.pills[pillIndex];
    pill.taken = true;
    const isPlayer = gameState.isPlayerTurn;
    
    logMessage(`${isPlayer ? 'Jugador' : 'IA'} tomó una pastilla...`);
    
    setTimeout(() => {
        processPillEffect(pill, isPlayer);
    }, 1000);
}

// Procesar el efecto de la pastilla tomada
function processPillEffect(pill, isPlayer) {
    switch (pill.type) {
        case 'correct':
            logMessage(`✅ ¡Era correcta! ${isPlayer ? 'Jugador' : 'IA'} está a salvo.`);
            break;
            
        case 'poison':
            logMessage(`☠️ ¡Era veneno! ${isPlayer ? 'Jugador' : 'IA'} pierde 2 vidas.`);
            if (isPlayer) {
                gameState.playerLives -= 2;
            } else {
                gameState.aiLives -= 2;
            }
            setTimeout(endRound, 1000);
            return;
            
        case 'neutral':
            logMessage(`➖ Era neutral. Sin efecto.`);
            break;
    }
    
    setTimeout(switchTurn, 1000);
}

// Cambiar el turno entre jugador e IA
function switchTurn() {
    gameState.isPlayerTurn = !gameState.isPlayerTurn;
    gameState.selectedPill = null;
    updateUI();
    
    if (!gameState.isPlayerTurn) {
        setTimeout(aiTurn, 1500);
    }
}

// Turno de la IA (selección aleatoria)
function aiTurn() {
    const availablePills = gameState.pills.filter(pill => !pill.taken);
    if (availablePills.length > 0) {
        const randomPill = availablePills[Math.floor(Math.random() * availablePills.length)];
        const pillIndex = gameState.pills.indexOf(randomPill);
        takePill(pillIndex);
    }
}

// Terminar la ronda actual
function endRound() {
    if (gameState.playerLives <= 0 || gameState.aiLives <= 0) {
        endGame();
        return;
    }
    
    gameState.currentRound++;
    if (gameState.currentRound > 3) {
        endGame();
        return;
    }
    
    gameState.isPlayerTurn = true;
    setTimeout(setupRound, 2000);
}

// Configurar una nueva ronda
function setupRound() {
    generatePills();
    gameState.selectedPill = null;
    updateUI();
    logMessage(`🆕 Ronda ${gameState.currentRound} iniciada.`);
}

// Terminar el juego y mostrar resultado
function endGame() {
    gameState.gameOver = true;
    
    let result, message;
    if (gameState.playerLives <= 0) {
        result = 'DERROTA';
        message = 'La IA ganó el duelo.';
    } else if (gameState.aiLives <= 0) {
        result = 'VICTORIA';
        message = '¡Ganaste el duelo!';
    } else {
        if (gameState.playerLives > gameState.aiLives) {
            result = 'VICTORIA';
            message = `Ganaste por supervivencia: ${gameState.playerLives} vs ${gameState.aiLives}`;
        } else if (gameState.aiLives > gameState.playerLives) {
            result = 'DERROTA';
            message = `IA ganó por supervivencia: ${gameState.aiLives} vs ${gameState.playerLives}`;
        } else {
            result = 'EMPATE';
            message = 'Ambos terminaron con las mismas vidas.';
        }
    }
    
    elements.gameResult.textContent = result;
    elements.finalMessage.textContent = message;
    elements.gameOverModal.style.display = 'block';
}

// Actualizar la interfaz de usuario
function updateUI() {
    elements.currentRound.textContent = gameState.currentRound;
    elements.currentTurn.textContent = gameState.isPlayerTurn ? 'Jugador' : 'IA';
    elements.playerLives.textContent = gameState.playerLives;
    elements.aiLives.textContent = gameState.aiLives;
    elements.takePillBtn.disabled = !gameState.isPlayerTurn || gameState.selectedPill === null;
    renderPills();
}

// Añadir un mensaje al log del juego
function logMessage(message) {
    const logElement = document.createElement('div');
    logElement.textContent = message;
    elements.gameLog.appendChild(logElement);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
}

// Event Listeners
elements.takePillBtn.addEventListener('click', () => {
    if (gameState.selectedPill !== null && gameState.isPlayerTurn) {
        takePill(gameState.selectedPill);
    }
});

elements.restartBtn.addEventListener('click', () => {
    gameState = {
        currentRound: 1,
        isPlayerTurn: true,
        playerLives: 5,
        aiLives: 5,
        pills: [],
        selectedPill: null,
        gameOver: false
    };
    elements.gameOverModal.style.display = 'none';
    setupRound();
    logMessage('¡Nuevo juego iniciado!');
});

// Inicializar el juego
setupRound();
logMessage('¡Bienvenido al duelo de pastillas!');
