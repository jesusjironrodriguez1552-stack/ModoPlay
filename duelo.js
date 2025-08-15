// === CONFIGURACIÓN DEL JUEGO ===
const GAME_CONFIG = {
    MAX_LIVES: 5,
    MAX_ROUNDS: 5,
    PILLS_PER_ROUND: 6,
    POISON_DAMAGE: 2,
    ITEMS_PER_PLAYER: 2
};

// === TIPOS DE ÍTEMS ===
const ITEMS = {
    VACUNA: { name: 'Vacuna', icon: '💉', description: 'Protege del veneno una vez' },
    MARTILLO: { name: 'Martillo', icon: '🔨', description: 'Elimina una pastilla aleatoria' },
    DUPLICADOR: { name: 'Duplicador', icon: '⚡', description: 'Duplica el daño de veneno' },
    VENENO: { name: 'Vaso Veneno', icon: '☠️', description: 'Convierte pastilla neutral en venenosa' },
    DETECTOR: { name: 'Detector', icon: '🔍', description: 'Muestra la pastilla correcta temporalmente' }
};

// === ESTADO DEL JUEGO ===
let gameState = {
    currentRound: 1,
    isPlayerTurn: true,
    playerLives: GAME_CONFIG.MAX_LIVES,
    aiLives: GAME_CONFIG.MAX_LIVES,
    playerItems: [],
    aiItems: [],
    pills: [],
    selectedPill: null,
    playerProtected: false,
    aiProtected: false,
    damageMultiplier: 1,
    gameOver: false,
    aiMemory: {
        testedPills: [],
        safePositions: [],
        riskyPositions: []
    }
};

// === ELEMENTOS DEL DOM ===
const elements = {
    currentRound: document.getElementById('current-round'),
    currentTurn: document.getElementById('current-turn'),
    playerHearts: document.getElementById('player-hearts'),
    aiHearts: document.getElementById('ai-hearts'),
    playerItems: document.getElementById('player-items'),
    aiItems: document.getElementById('ai-items'),
    pillsContainer: document.getElementById('pills-container'),
    takePillBtn: document.getElementById('take-pill-btn'),
    gameLog: document.getElementById('game-log'),
    gameOverModal: document.getElementById('game-over-modal'),
    gameResult: document.getElementById('game-result'),
    finalMessage: document.getElementById('final-message'),
    restartBtn: document.getElementById('restart-btn')
};

// === INICIALIZACIÓN ===
function initGame() {
    resetGameState();
    setupRound();
    updateUI();
    logMessage('¡Nuevo duelo iniciado! Ronda 1 de 5.');
}

function resetGameState() {
    gameState = {
        currentRound: 1,
        isPlayerTurn: true,
        playerLives: GAME_CONFIG.MAX_LIVES,
        aiLives: GAME_CONFIG.MAX_LIVES,
        playerItems: [],
        aiItems: [],
        pills: [],
        selectedPill: null,
        playerProtected: false,
        aiProtected: false,
        damageMultiplier: 1,
        gameOver: false,
        aiMemory: {
            testedPills: [],
            safePositions: [],
            riskyPositions: []
        }
    };
    elements.gameOverModal.classList.add('hidden');
}

function setupRound() {
    generatePills();
    generateItems();
    gameState.playerProtected = false;
    gameState.aiProtected = false;
    gameState.damageMultiplier = 1;
    gameState.selectedPill = null;
    updateUI();
    logMessage(`🆕 Ronda ${gameState.currentRound} - Nueva mesa preparada.`);
}

// === GENERACIÓN DE CONTENIDO ===
function generatePills() {
    gameState.pills = [];
    
    // Crear pastillas: 1 correcta, 1 venenosa, resto neutrales
    for (let i = 0; i < GAME_CONFIG.PILLS_PER_ROUND; i++) {
        let type = 'neutral';
        if (i === 0) type = 'correct';
        else if (i === 1) type = 'poison';
        
        gameState.pills.push({
            id: i,
            type: type,
            taken: false,
            revealed: false
        });
    }
    
    // Mezclar array
    shuffleArray(gameState.pills);
}

function generateItems() {
    const itemKeys = Object.keys(ITEMS);
    
    // Items para el jugador
    gameState.playerItems = [];
    for (let i = 0; i < GAME_CONFIG.ITEMS_PER_PLAYER; i++) {
        const randomItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        gameState.playerItems.push({
            type: randomItem,
            used: false,
            ...ITEMS[randomItem]
        });
    }
    
    // Items para la IA
    gameState.aiItems = [];
    for (let i = 0; i < GAME_CONFIG.ITEMS_PER_PLAYER; i++) {
        const randomItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
        gameState.aiItems.push({
            type: randomItem,
            used: false,
            ...ITEMS[randomItem]
        });
    }
}

// === ACTUALIZACIÓN DE UI ===
function updateUI() {
    // Round info
    elements.currentRound.textContent = gameState.currentRound;
    elements.currentTurn.textContent = gameState.isPlayerTurn ? 'Tu turno' : 'Turno IA';
    
    // Vidas
    updateHearts(elements.playerHearts, gameState.playerLives);
    updateHearts(elements.aiHearts, gameState.aiLives);
    
    // Items
    renderItems(elements.playerItems, gameState.playerItems, true);
    renderItems(elements.aiItems, gameState.aiItems, false);
    
    // Pastillas
    renderPills();
    
    // Botón
    elements.takePillBtn.disabled = !gameState.isPlayerTurn || gameState.selectedPill === null;
}

function updateHearts(container, lives) {
    const hearts = container.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index < lives) {
            heart.classList.remove('lost');
        } else {
            heart.classList.add('lost');
        }
    });
}

function renderItems(container, items, isClickable) {
    container.innerHTML = '';
    items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = `item ${item.used ? 'used' : ''}`;
        itemElement.innerHTML = item.icon;
        itemElement.title = `${item.name}: ${item.description}`;
        
        if (isClickable && !item.used && gameState.isPlayerTurn) {
            itemElement.addEventListener('click', () => usePlayerItem(index));
        }
        
        container.appendChild(itemElement);
    });
}

function renderPills() {
    elements.pillsContainer.innerHTML = '';
    gameState.pills.forEach((pill, index) => {
        const pillElement = document.createElement('div');
        pillElement.className = `pill ${pill.taken ? 'taken' : ''} ${pill.revealed ? pill.type : ''}`;
        pillElement.innerHTML = '💊';
        
        if (!pill.taken && gameState.isPlayerTurn) {
            pillElement.addEventListener('click', () => selectPill(index));
        }
        
        if (gameState.selectedPill === index && !pill.taken) {
            pillElement.classList.add('selected');
        }
        
        elements.pillsContainer.appendChild(pillElement);
    });
}

// === LÓGICA DE JUEGO ===
function selectPill(index) {
    if (gameState.pills[index].taken) return;
    
    // Deseleccionar pastilla anterior
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
    
    // Seleccionar nueva
    gameState.selectedPill = index;
    document.querySelectorAll('.pill')[index].classList.add('selected');
    
    updateUI();
}

function usePlayerItem(itemIndex) {
    const item = gameState.playerItems[itemIndex];
    if (item.used) return;
    
    item.used = true;
    logMessage(`🎯 Usaste: ${item.name}`);
    
    applyItemEffect(item.type, true);
    updateUI();
    
    // Después de usar ítem, el jugador puede tomar pastilla
    setTimeout(() => {
        if (gameState.isPlayerTurn) {
            logMessage('Ahora puedes tomar una pastilla o usar otro ítem.');
        }
    }, 1000);
}

function applyItemEffect(itemType, isPlayer) {
    switch (itemType) {
        case 'VACUNA':
            if (isPlayer) {
                gameState.playerProtected = true;
                logMessage('💉 Te protegiste del veneno esta ronda.');
            } else {
                gameState.aiProtected = true;
                logMessage('💉 La IA se protegió del veneno.');
            }
            break;
            
        case 'MARTILLO':
            const availablePills = gameState.pills.filter(p => !p.taken);
            if (availablePills.length > 0) {
                const randomPill = availablePills[Math.floor(Math.random() * availablePills.length)];
                const pillIndex = gameState.pills.indexOf(randomPill);
                gameState.pills[pillIndex].taken = true;
                logMessage(`🔨 ${isPlayer ? 'Eliminaste' : 'La IA eliminó'} una pastilla de la mesa.`);
                updateUI();
            }
            break;
            
        case 'DUPLICADOR':
            gameState.damageMultiplier = 2;
            logMessage(`⚡ ${isPlayer ? 'Duplicaste' : 'La IA duplicó'} el daño del próximo veneno.`);
            break;
            
        case 'VENENO':
            const neutralPills = gameState.pills.filter(p => p.type === 'neutral' && !p.taken);
            if (neutralPills.length > 0) {
                const randomNeutral = neutralPills[Math.floor(Math.random() * neutralPills.length)];
                randomNeutral.type = 'poison';
                logMessage(`☠️ ${isPlayer ? 'Envenenaste' : 'La IA envenenó'} una pastilla neutral.`);
            }
            break;
            
        case 'DETECTOR':
            const correctPill = gameState.pills.find(p => p.type === 'correct');
            if (correctPill) {
                correctPill.revealed = true;
                logMessage(`🔍 ${isPlayer ? 'Detectaste' : 'La IA detectó'} la pastilla correcta temporalmente.`);
                updateUI();
                
                // La revelación dura 5 segundos
                setTimeout(() => {
                    correctPill.revealed = false;
                    updateUI();
                }, 5000);
            }
            break;
    }
}

function takePill(pillIndex) {
    const pill = gameState.pills[pillIndex];
    if (pill.taken) return;
    
    pill.taken = true;
    const isPlayer = gameState.isPlayerTurn;
    
    logMessage(`💊 ${isPlayer ? 'Tomaste' : 'La IA tomó'} una pastilla...`);
    
    setTimeout(() => {
        processPillEffect(pill, isPlayer);
    }, 1500);
}

function processPillEffect(pill, isPlayer) {
    switch (pill.type) {
        case 'correct':
            logMessage(`✅ ¡Era la pastilla correcta! ${isPlayer ? 'Estás' : 'La IA está'} a salvo.`);
            if (isPlayer) {
                document.querySelector('.human-avatar').classList.add('heal-effect');
                setTimeout(() => document.querySelector('.human-avatar').classList.remove('heal-effect'), 1000);
            }
            break;
            
        case 'poison':
            let damage = GAME_CONFIG.POISON_DAMAGE * gameState.damageMultiplier;
            const isProtected = isPlayer ? gameState.playerProtected : gameState.aiProtected;
            
            if (isProtected) {
                logMessage(`💉 ${isPlayer ? 'Tu vacuna te protegió' : 'La vacuna protegió a la IA'} del veneno.`);
                damage = 0;
                if (isPlayer) gameState.playerProtected = false;
                else gameState.aiProtected = false;
            } else {
                logMessage(`☠️ ¡Era veneno! ${isPlayer ? 'Perdiste' : 'La IA perdió'} ${damage} vidas.`);
                
                if (isPlayer) {
                    gameState.playerLives -= damage;
                    document.querySelector('.human-avatar').classList.add('damage-effect');
                    setTimeout(() => document.querySelector('.human-avatar').classList.remove('damage-effect'), 600);
                } else {
                    gameState.aiLives -= damage;
                    document.querySelector('.ai-avatar').classList.add('damage-effect');
                    setTimeout(() => document.querySelector('.ai-avatar').classList.remove('damage-effect'), 600);
                }
            }
            
            gameState.damageMultiplier = 1; // Reset multiplicador
            setTimeout(() => {
                updateUI();
                endRound();
            }, 1000);
            return;
            
        case 'neutral':
            logMessage(`➖ Era una pastilla neutral. Sin efecto.`);
            break;
    }
    
    // Continuar con el siguiente turno
    setTimeout(() => {
        updateUI();
        switchTurn();
    }, 1000);
}

function switchTurn() {
    gameState.isPlayerTurn = !gameState.isPlayerTurn;
    gameState.selectedPill = null;
    updateUI();
    
    if (!gameState.isPlayerTurn) {
        setTimeout(aiTurn, 1500);
    }
}

function endRound() {
    // Verificar si alguien murió
    if (gameState.playerLives <= 0 || gameState.aiLives <= 0) {
        endGame();
        return;
    }
    
    // Siguiente ronda
    gameState.currentRound++;
    if (gameState.currentRound > GAME_CONFIG.MAX_ROUNDS) {
        endGame();
        return;
    }
    
    gameState.isPlayerTurn = true;
    setTimeout(() => {
        setupRound();
    }, 2000);
}

function endGame() {
    gameState.gameOver = true;
    
    let result, message;
    if (gameState.playerLives <= 0) {
        result = '💀 DERROTA';
        message = 'La IA ha ganado el duelo. ¡Mejor suerte la próxima vez!';
    } else if (gameState.aiLives <= 0) {
        result = '🏆 VICTORIA';
        message = '¡Felicidades! Has derrotado a la IA en este duelo mortal.';
    } else {
        // Empate por rondas completadas
        if (gameState.playerLives > gameState.aiLives) {
            result = '🏆 VICTORIA';
            message = `¡Ganaste por supervivencia! Tienes ${gameState.playerLives} vidas vs ${gameState.aiLives} de la IA.`;
        } else if (gameState.aiLives > gameState.playerLives) {
            result = '💀 DERROTA';
            message = `La IA ganó por supervivencia. Tiene ${gameState.aiLives} vidas vs tus ${gameState.playerLives}.`;
        } else {
            result = '🤝 EMPATE';
            message = '¡Increíble empate! Ambos terminaron con las mismas vidas.';
        }
    }
    
    elements.gameResult.textContent = result;
    elements.finalMessage.textContent = message;
    elements.gameOverModal.classList.remove('hidden');
    
    logMessage(`🎯 ${result} - ${message}`);
}

// === INTELIGENCIA ARTIFICIAL ===
function aiTurn() {
    if (gameState.gameOver || gameState.isPlayerTurn) return;
    
    logMessage('🤖 La IA está pensando...');
    
    // Dificultad progresiva basada en la ronda
    const difficulty = Math.min(gameState.currentRound, 5);
    
    setTimeout(() => {
        const action = decideAIAction(difficulty);
        executeAIAction(action);
    }, 2000);
}

function decideAIAction(difficulty) {
    const availableItems = gameState.aiItems.filter(item => !item.used);
    const availablePills = gameState.pills.filter(pill => !pill.taken);
    
    // Ronda 1-2: Comportamiento mayormente aleatorio
    if (difficulty <= 2) {
        if (Math.random() < 0.3 && availableItems.length > 0) {
            return {
                type: 'item',
                index: gameState.aiItems.indexOf(availableItems[Math.floor(Math.random() * availableItems.length)])
            };
        }
        return {
            type: 'pill',
            index: gameState.pills.indexOf(availablePills[Math.floor(Math.random() * availablePills.length)])
        };
    }
    
    // Ronda 3-4: Comportamiento semi-inteligente
    if (difficulty <= 4) {
        // Priorizar items defensivos si tiene pocas vidas
        if (gameState.aiLives <= 2 && availableItems.some(item => item.type === 'VACUNA')) {
            const vacunaItem = availableItems.find(item => item.type === 'VACUNA');
            return { type: 'item', index: gameState.aiItems.indexOf(vacunaItem) };
        }
        
        // Usar detector si hay muchas pastillas
        if (availablePills.length >= 4 && availableItems.some(item => item.type === 'DETECTOR')) {
            const detectorItem = availableItems.find(item => item.type === 'DETECTOR');
            return { type: 'item', index: gameState.aiItems.indexOf(detectorItem) };
        }
        
        // Tomar pastilla revelada como correcta
        const revealedCorrect = gameState.pills.find(pill => pill.revealed && pill.type === 'correct' && !pill.taken);
        if (revealedCorrect) {
            return { type: 'pill', index: gameState.pills.indexOf(revealedCorrect) };
        }
        
        // Evitar pastillas que parecen arriesgadas
        const safePills = availablePills.filter(pill => !gameState.aiMemory.riskyPositions.includes(pill.id));
        if (safePills.length > 0) {
            return { type: 'pill', index: gameState.pills.indexOf(safePills[Math.floor(Math.random() * safePills.length)]) };
        }
    }
    
    // Ronda 5: IA muy inteligente
    if (difficulty === 5) {
        // Estrategia defensiva si tiene pocas vidas
        if (gameState.aiLives <= 3) {
            if (availableItems.some(item => item.type === 'VACUNA')) {
                const vacunaItem = availableItems.find(item => item.type === 'VACUNA');
                return { type: 'item', index: gameState.aiItems.indexOf(vacunaItem) };
            }
            
            if (availableItems.some(item => item.type === 'DETECTOR')) {
                const detectorItem = availableItems.find(item => item.type === 'DETECTOR');
                return { type: 'item', index: gameState.aiItems.indexOf(detectorItem) };
            }
        }
        
        // Estrategia ofensiva si el jugador tiene pocas vidas
        if (gameState.playerLives <= 3) {
            if (availableItems.some(item => item.type === 'DUPLICADOR')) {
                const duplicadorItem = availableItems.find(item => item.type === 'DUPLICADOR');
                return { type: 'item', index: gameState.aiItems.indexOf(duplicadorItem) };
            }
            
            if (availableItems.some(item => item.type === 'VENENO')) {
                const venenoItem = availableItems.find(item => item.type === 'VENENO');
                return { type: 'item', index: gameState.aiItems.indexOf(venenoItem) };
            }
        }
        
        // Usar martillo para reducir opciones
        if (availablePills.length >= 5 && availableItems.some(item => item.type === 'MARTILLO')) {
            const martilloItem = availableItems.find(item => item.type === 'MARTILLO');
            return { type: 'item', index: gameState.aiItems.indexOf(martilloItem) };
        }
        
        // Priorizar pastilla correcta revelada
        const revealedCorrect = gameState.pills.find(pill => pill.revealed && pill.type === 'correct' && !pill.taken);
        if (revealedCorrect) {
            return { type: 'pill', index: gameState.pills.indexOf(revealedCorrect) };
        }
        
        // Evitar pastillas en posiciones arriesgadas y priorizar posiciones seguras
        const safePills = availablePills.filter(pill => 
            gameState.aiMemory.safePositions.includes(pill.id) || 
            !gameState.aiMemory.riskyPositions.includes(pill.id)
        );
        
        if (safePills.length > 0) {
            return { type: 'pill', index: gameState.pills.indexOf(safePills[0]) };
        }
    }
    
    // Fallback: acción aleatoria
    if (availablePills.length > 0) {
        return { type: 'pill', index: gameState.pills.indexOf(availablePills[Math.floor(Math.random() * availablePills.length)]) };
    }
    
    return null;
}

function executeAIAction(action) {
    if (!action) return;
    
    if (action.type === 'item') {
        const item = gameState.aiItems[action.index];
        if (!item.used) {
            item.used = true;
            logMessage(`🤖 La IA usó: ${item.name}`);
            applyItemEffect(item.type, false);
            updateUI();
            
            // Después de usar ítem, la IA decide si tomar pastilla
            setTimeout(() => {
                if (!gameState.isPlayerTurn && !gameState.gameOver) {
                    const availablePills = gameState.pills.filter(pill => !pill.taken);
                    if (availablePills.length > 0) {
                        const pillAction = decideAIAction(Math.min(gameState.currentRound, 5));
                        if (pillAction && pillAction.type === 'pill') {
                            takePill(pillAction.index);
                        } else {
                            // Tomar pastilla aleatoria como fallback
                            const randomPill = availablePills[Math.floor(Math.random() * availablePills.length)];
                            takePill(gameState.pills.indexOf(randomPill));
                        }
                    }
                }
            }, 1500);
        }
    } else if (action.type === 'pill') {
        takePill(action.index);
    }
}

// === FUNCIONES DE UTILIDAD ===
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function logMessage(message) {
    const logElement = document.createElement('div');
    logElement.className = 'log-message';
    logElement.textContent = message;
    elements.gameLog.appendChild(logElement);
    elements.gameLog.scrollTop = elements.gameLog.scrollHeight;
    
    // Mantener solo los últimos 8 mensajes
    const messages = elements.gameLog.querySelectorAll('.log-message');
    if (messages.length > 8) {
        messages[0].remove();
    }
}

// === EVENT LISTENERS ===
elements.takePillBtn.addEventListener('click', () => {
    if (gameState.selectedPill !== null && gameState.isPlayerTurn) {
        takePill(gameState.selectedPill);
    }
});

elements.restartBtn.addEventListener('click', () => {
    initGame();
});

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
