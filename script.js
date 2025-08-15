// Configuración del juego
let gameState = {
    currentRound: 1,
    isPlayerTurn: true,
    playerLives: 5,
    aiLives: 5,
    pills: [],
    selectedPill: null,
    gameOver: false,
    selectedWeapons: [],
    usedWeapons: [],
    syringeActive: false,
    waitingForWeaponSelection: true
};

// Definición de armas
const weapons = {
    poisonVial: {
        id: 'poisonVial',
        name: 'Vaso de Veneno',
        emoji: '🧪',
        description: 'Duplica el efecto del veneno (4 vidas en lugar de 2)'
    },
    hammer: {
        id: 'hammer',
        name: 'Martillo',
        emoji: '🔨',
        description: 'Rompe una pastilla en tu turno'
    },
    detector: {
        id: 'detector',
        name: 'Detector',
        emoji: '🔍',
        description: 'Revela cuál pastilla contiene veneno'
    },
    candy: {
        id: 'candy',
        name: 'Caramelo',
        emoji: '🍬',
        description: 'Salta tu turno sin tomar pastilla'
    },
    syringe: {
        id: 'syringe',
        name: 'Jeringa',
        emoji: '💉',
        description: 'Inmunidad al veneno (se pierde si tomas pastilla sin veneno)'
    }
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
    restartBtn: document.getElementById('restart-btn'),
    weaponSelectionModal: document.getElementById('weapon-selection-modal'),
    weaponsContainer: document.getElementById('weapons-container'),
    selectedWeaponsDiv: document.getElementById('selected-weapons'),
    confirmWeaponsBtn: document.getElementById('confirm-weapons-btn'),
    weaponRound: document.getElementById('weapon-round'),
    selectionCounter: document.getElementById('selection-counter')
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
            taken: false,
            broken: false
        });
    }
    
    // Mezclar las pastillas aleatoriamente
    for (let i = gameState.pills.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.pills[i], gameState.pills[j]] = [gameState.pills[j], gameState.pills[i]];
    }
}

// Mostrar selección de armas
function showWeaponSelection() {
    gameState.waitingForWeaponSelection = true;
    gameState.selectedWeapons = [];
    elements.weaponRound.textContent = gameState.currentRound;
    
    elements.weaponsContainer.innerHTML = '';
    Object.values(weapons).forEach(weapon => {
        const weaponDiv = document.createElement('div');
        weaponDiv.className = 'weapon-option';
        weaponDiv.innerHTML = `
            <div class="emoji">${weapon.emoji}</div>
            <div class="name">${weapon.name}</div>
            <div class="description">${weapon.description}</div>
        `;
        weaponDiv.onclick = () => selectWeapon(weapon.id, weaponDiv);
        elements.weaponsContainer.appendChild(weaponDiv);
    });
    
    updateSelectionCounter();
    elements.weaponSelectionModal.style.display = 'block';
}

// Seleccionar arma
function selectWeapon(weaponId, element) {
    const index = gameState.selectedWeapons.indexOf(weaponId);
    
    if (index > -1) {
        // Deseleccionar arma
        gameState.selectedWeapons.splice(index, 1);
        element.classList.remove('selected');
    } else if (gameState.selectedWeapons.length < 2) {
        // Seleccionar arma
        gameState.selectedWeapons.push(weaponId);
        element.classList.add('selected');
    }
    
    updateSelectionCounter();
}

// Actualizar contador de selección
function updateSelectionCounter() {
    elements.selectionCounter.textContent = `Armas seleccionadas: ${gameState.selectedWeapons.length}/2`;
    elements.confirmWeaponsBtn.disabled = gameState.selectedWeapons.length !== 2;
}

// Confirmar selección de armas
function confirmWeaponSelection() {
    gameState.waitingForWeaponSelection = false;
    gameState.usedWeapons = [];
    elements.weaponSelectionModal.style.display = 'none';
    
    logMessage(`🎯 Armas seleccionadas: ${gameState.selectedWeapons.map(id => weapons[id].name).join(', ')}`);
    updateSelectedWeaponsDisplay();
    updateUI();
}

// Actualizar display de armas seleccionadas
function updateSelectedWeaponsDisplay() {
    elements.selectedWeaponsDiv.innerHTML = '';
    
    gameState.selectedWeapons.forEach(weaponId => {
        const weapon = weapons[weaponId];
        const isUsed = gameState.usedWeapons.includes(weaponId);
        
        const weaponDiv = document.createElement('div');
        weaponDiv.className = `weapon-item ${isUsed ? 'used' : ''}`;
        
        weaponDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 5px;">${weapon.emoji}</div>
            <div style="font-weight: bold; font-size: 12px;">${weapon.name}</div>
            <button onclick="useWeapon('${weaponId}')" ${isUsed || !gameState.isPlayerTurn ? 'disabled' : ''}>
                ${isUsed ? 'Usada' : 'Usar'}
            </button>
        `;
        
        elements.selectedWeaponsDiv.appendChild(weaponDiv);
    });
}

// Usar arma
function useWeapon(weaponId) {
    if (gameState.usedWeapons.includes(weaponId) || !gameState.isPlayerTurn) return;
    
    const weapon = weapons[weaponId];
    gameState.usedWeapons.push(weaponId);
    
    logMessage(`⚔️ Jugador usa: ${weapon.name}`);
    
    switch (weaponId) {
        case 'hammer':
            useHammer();
            break;
        case 'detector':
            useDetector();
            break;
        case 'candy':
            useCandy();
            break;
        case 'syringe':
            useSyringe();
            break;
        case 'poisonVial':
            logMessage('🧪 Vaso de veneno activado: el próximo veneno será doble');
            break;
    }
    
    updateSelectedWeaponsDisplay();
}

// Usar martillo
function useHammer() {
    const availablePills = gameState.pills.filter(pill => !pill.taken && !pill.broken);
    if (availablePills.length === 0) {
        logMessage('❌ No hay pastillas disponibles para romper');
        return;
    }
    
    logMessage('🔨 Selecciona una pastilla para romper');
    
    // Habilitar modo selección para romper
    const pillButtons = elements.pillsContainer.children;
    for (let i = 0; i < pillButtons.length; i++) {
        if (!gameState.pills[i].taken && !gameState.pills[i].broken) {
            pillButtons[i].onclick = () => breakPill(i);
            pillButtons[i].style.cursor = 'pointer';
            pillButtons[i].style.border = '3px solid orange';
        }
    }
}

// Romper pastilla
function breakPill(index) {
    const pill = gameState.pills[index];
    pill.broken = true;
    
    logMessage(`💥 Pastilla rota: Era ${pill.type === 'poison' ? 'veneno ☠️' : pill.type === 'correct' ? 'correcta ✅' : 'neutral ➖'}`);
    
    // Restaurar eventos normales de pastillas
    renderPills();
    updateUI();
}

// Usar detector
function useDetector() {
    const poisonPill = gameState.pills.find(pill => pill.type === 'poison' && !pill.taken);
    if (poisonPill) {
        const index = gameState.pills.indexOf(poisonPill);
        logMessage(`🔍 ¡Detector activado! La pastilla ${index + 1} contiene veneno`);
        
        // Resaltar la pastilla venenosa
        setTimeout(() => {
            const pillButtons = elements.pillsContainer.children;
            if (pillButtons[index]) {
                pillButtons[index].style.border = '4px solid red';
                pillButtons[index].style.animation = 'pulse 1s infinite';
            }
        }, 500);
    } else {
        logMessage('🔍 Detector activado: No hay veneno disponible');
    }
}

// Usar caramelo
function useCandy() {
    logMessage('🍬 Caramelo usado: Turno saltado');
    setTimeout(switchTurn, 1000);
}

// Usar jeringa
function useSyringe() {
    gameState.syringeActive = true;
    logMessage('💉 Jeringa activada: Inmune al veneno hasta tomar pastilla sin veneno');
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
        } else if (pill.broken) {
            pillElement.disabled = true;
            pillElement.classList.add('broken');
            pillElement.textContent = '💥';
        } else if (gameState.isPlayerTurn && !gameState.waitingForWeaponSelection) {
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
    if (gameState.pills[index].broken) return;
    
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
            if (isPlayer && gameState.syringeActive) {
                gameState.syringeActive = false;
                logMessage('💉 Jeringa perdida: tomaste pastilla sin veneno');
            }
            break;
            
        case 'poison':
            if (isPlayer && gameState.syringeActive) {
                logMessage(`💉 ¡Era veneno pero la jeringa te protegió!`);
                gameState.syringeActive = false;
                logMessage('💉 Jeringa consumida');
            } else {
                let damage = 2;
                if (isPlayer && gameState.usedWeapons.includes('poisonVial')) {
                    damage = 4;
                    logMessage(`🧪☠️ ¡Era veneno DUPLICADO! ${isPlayer ? 'Jugador' : 'IA'} pierde ${damage} vidas.`);
                } else {
                    logMessage(`☠️ ¡Era veneno! ${isPlayer ? 'Jugador' : 'IA'} pierde ${damage} vidas.`);
                }
                
                if (isPlayer) {
                    gameState.playerLives -= damage;
                } else {
                    gameState.aiLives -= damage;
                }
            }
            setTimeout(endRound, 1000);
            return;
            
        case 'neutral':
            logMessage(`➖ Era neutral. Sin efecto.`);
            if (isPlayer && gameState.syringeActive) {
                gameState.syringeActive = false;
                logMessage('💉 Jeringa perdida: tomaste pastilla sin veneno');
            }
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
    const availablePills = gameState.pills.filter(pill => !pill.taken && !pill.broken);
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
    gameState.syringeActive = false;
    
    logMessage(`🆕 Ronda ${gameState.currentRound} iniciada.`);
    showWeaponSelection();
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
