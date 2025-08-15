<script>
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
        
        container.appendChild(pillElement);
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
            endRound();
            return;
            
        case 'neutral':
            logMessage(`➖ Era una pastilla neutral. Sin efecto.`);
            break;
    }
    
    // Continuar con el siguiente turno
    switchTurn();
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
                index: Math.floor(Math.random() * availableItems.length)
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
            const vacunaIndex = availableItems.findIndex(item => item.type === 'VACUNA');
            return { type: 'item', index: gameState.aiItems.indexOf(availableItems[vacunaIndex]) };
        }
        
        // Usar detector si hay muchas pastillas
        if (availablePills.length >= 4 && availableItems.some(item => item.type === 'DETECTOR')) {
            const detectorIndex = availableItems.findIndex(item => item.type === 'DETECTOR');
            return { type: 'item', index: gameState.aiItems.indexOf(availableItems[detectorIndex]) };
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
                const vacunaIndex = availableItems.findIndex(item => item.type === 'VACUNA');
                return { type: 'item', index: gameState.aiItems.indexOf(availableItems[vacunaIndex]) };
            }
            
            if (availableItems.some(item => item.type === 'DETECTOR')) {
                const detectorIndex = availableItems.findIndex(item => item.type === 'DETECTOR');
                return { type: 'item', index: gameState.aiItems.indexOf(availableItems[detectorIndex]) };
            }
        }
        
        // Estrategia ofensiva si el jugador tiene pocas vidas
        if (gameState.playerLives <= 3) {
            if (availableItems.some(item => item.type === 'DUPLICADOR')) {
                const duplicadorIndex = availableItems.findIndex(item => item.type === 'DUPLICADOR');
                return { type: 'item', index: gameState.aiItems.indexOf(availableItems[duplicadorIndex]) };
            }
            
            if (availableItems.some(item => item.type === 'VENENO')) {
                const venenoIndex = availableItems.findIndex(item => item.type === 'VENENO');
                return { type: 'item', index: gameState.aiItems.indexOf(availableItems[venenoIndex]) };
            }
        }
        
        // Usar martillo para reducir opciones
        if (availablePills.length >= 5 && availableItems.some(item => item.type === 'MARTILLO')) {
            const martilloIndex = availableItems.findIndex(item => item.type === 'MARTILLO');
            return { type: 'item', index: gameState.aiItems.indexOf(availableItems[martilloIndex]) };
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
                if (!gameState.isPlayerTurn) {
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
    </script><!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Escoge la Pastilla Correcta: Duelo 1 vs 1</title>
    <style>
/* === ESTILOS GENERALES === */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #fff;
    min-height: 100vh;
    overflow: hidden;
}

.game-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 10px;
}

/* === HUD SUPERIOR === */
.hud {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 10px;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
}

.player-info, .ai-info {
    text-align: center;
}

.player-info h3, .ai-info h3 {
    color: #ff6b6b;
    margin-bottom: 10px;
    text-shadow: 0 0 10px #ff6b6b;
}

.lives {
    display: flex;
    align-items: center;
    gap: 10px;
}

.hearts {
    display: flex;
    gap: 5px;
}

.heart {
    width: 25px;
    height: 25px;
    background: #ff4757;
    clip-path: polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%);
    animation: heartbeat 2s infinite;
}

.heart.lost {
    background: #444;
    animation: none;
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.round-info {
    text-align: center;
}

.round-info h2 {
    color: #4ecdc4;
    text-shadow: 0 0 15px #4ecdc4;
    margin-bottom: 10px;
}

.turn-indicator {
    padding: 8px 15px;
    background: linear-gradient(45deg, #ff9ff3, #f368e0);
    border-radius: 20px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

/* === MESA DE DUELO === */
.duel-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background: radial-gradient(ellipse at center, #2c5530, #1a3a1f);
    border: 5px solid #8B4513;
    border-radius: 50px;
    padding: 30px;
    position: relative;
    box-shadow: 0 0 50px rgba(0,0,0,0.8), inset 0 0 50px rgba(255,255,255,0.1);
}

.duel-table::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border: 2px solid #654321;
    border-radius: 40px;
    pointer-events: none;
}

.player-zone {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    justify-content: space-between;
    padding: 20px;
}

.ai-zone {
    flex-direction: row-reverse;
}

.player-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    border: 3px solid #fff;
    box-shadow: 0 0 20px rgba(255,255,255,0.5);
}

.human-avatar {
    background: linear-gradient(45deg, #667eea, #764ba2);
}

.ai-avatar {
    background: linear-gradient(45deg, #f093fb, #f5576c);
}

.items-zone {
    display: flex;
    gap: 15px;
}

.item {
    width: 60px;
    height: 60px;
    border-radius: 10px;
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(45deg, #43cea2, #185a9d);
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.item:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255,255,255,0.4);
}

.item.used {
    opacity: 0.3;
    cursor: not-allowed;
    transform: scale(0.8);
}

/* === ÁREA DE PASTILLAS === */
.pills-area {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
}

.pills-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 20px;
    max-width: 400px;
    justify-items: center;
}

.pill {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    position: relative;
    background: linear-gradient(45deg, #ff6b6b, #ee5a6f);
    box-shadow: 0 4px 15px rgba(255,107,107,0.5);
}

.pill:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 25px rgba(255,255,255,0.6);
}

.pill.taken {
    opacity: 0.3;
    transform: scale(0.7);
    cursor: not-allowed;
}

.pill.correct {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    box-shadow: 0 4px 15px rgba(78,205,196,0.5);
}

.pill.poison {
    background: linear-gradient(45deg, #c44569, #ad2f57);
    box-shadow: 0 4px 15px rgba(196,69,105,0.5);
}

/* === PANEL DE CONTROL === */
.control-panel {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: rgba(0,0,0,0.7);
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.action-btn {
    padding: 15px 30px;
    border: none;
    border-radius: 25px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    box-shadow: 0 4px 15px rgba(102,126,234,0.4);
}

.action-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(102,126,234,0.6);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.game-log {
    flex: 1;
    height: 80px;
    padding: 15px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow-y: auto;
    font-size: 14px;
}

.log-message {
    margin-bottom: 5px;
    opacity: 0;
    animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

/* === MODAL === */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal.hidden {
    display: none;
}

.modal-content {
    background: linear-gradient(135deg, #667eea, #764ba2);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.modal-content h2 {
    margin-bottom: 20px;
    font-size: 28px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.modal-content p {
    margin-bottom: 30px;
    font-size: 18px;
}

/* === EFECTOS ESPECIALES === */
.damage-effect {
    animation: damageShake 0.6s ease;
}

@keyframes damageShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.heal-effect {
    animation: healGlow 1s ease;
}

@keyframes healGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(78,205,196,0.3); }
    50% { box-shadow: 0 0 40px rgba(78,205,196,0.8); }
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
    .hud {
        flex-direction: column;
        gap: 15px;
    }
    
    .duel-table {
        padding: 20px;
    }
    
    .pills-container {
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
    }
    
    .control-panel {
        flex-direction: column;
        gap: 15px;
    }
}
    </style>
</head>
<body>
    <div class="game-container">
        <!-- HUD Superior -->
        <div class="hud">
            <div class="player-info">
                <h3>JUGADOR</h3>
                <div class="lives">
                    <span>Vidas: </span>
                    <div class="hearts" id="player-hearts">
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                    </div>
                </div>
            </div>
            
            <div class="round-info">
                <h2>RONDA <span id="current-round">1</span>/5</h2>
                <div class="turn-indicator" id="turn-indicator">
                    <span id="current-turn">Tu turno</span>
                </div>
            </div>
            
            <div class="ai-info">
                <h3>IA</h3>
                <div class="lives">
                    <span>Vidas: </span>
                    <div class="hearts" id="ai-hearts">
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                        <div class="heart"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mesa de Duelo -->
        <div class="duel-table">
            <!-- Zona de la IA -->
            <div class="player-zone ai-zone">
                <div class="player-avatar ai-avatar">🤖</div>
                <div class="items-zone" id="ai-items">
                    <!-- Items de la IA se generan aquí -->
                </div>
            </div>

            <!-- Centro de la mesa con pastillas -->
            <div class="pills-area">
                <div class="pills-container" id="pills-container">
                    <!-- Las pastillas se generan aquí -->
                </div>
            </div>

            <!-- Zona del Jugador -->
            <div class="player-zone human-zone">
                <div class="player-avatar human-avatar">👤</div>
                <div class="items-zone" id="player-items">
                    <!-- Items del jugador se generan aquí -->
                </div>
            </div>
        </div>

        <!-- Panel de Control -->
        <div class="control-panel">
            <button id="take-pill-btn" class="action-btn" disabled>Tomar Pastilla</button>
            <div class="game-log" id="game-log">
                <div class="log-message">¡Bienvenido al duelo! Elige un ítem o toma una pastilla.</div>
            </div>
        </div>

        <!-- Modal de Fin de Juego -->
        <div id="game-over-modal" class="modal hidden">
            <div class="modal-content">
                <h2 id="game-result">¡Fin del Juego!</h2>
                <p id="final-message">Resultado del duelo</p>
                <button id="restart-btn" class="action-btn">Jugar de Nuevo</button>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
