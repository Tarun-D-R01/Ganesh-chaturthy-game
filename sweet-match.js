/* =========================================================
   SWEETS CRUSH - COMPETITIVE MATCH-3 GAME
   Advanced competitive puzzle game with special mechanics
   ========================================================= */

// Game configuration
const GRID_SIZE = 8;
const SWEET_TYPES = [
    { emoji: '🥟', name: 'Modak', color: '#FFD700' },
    { emoji: '🟡', name: 'Laddu', color: '#FFA500' },
    { emoji: '🟠', name: 'Peda', color: '#FF8C00' },
    { emoji: '🌀', name: 'Jalebi', color: '#FF6347' },
    { emoji: '🍬', name: 'Barfi', color: '#FF69B4' },
    { emoji: '🧁', name: 'Gulab', color: '#FF1493' }
];

// Special types
const SPECIAL_TYPES = {
    NORMAL: 'normal',
    BOMB: 'bomb',
    LOCKED: 'locked',
    STRIPED_H: 'striped-h',
    STRIPED_V: 'striped-v',
    WRAPPED: 'wrapped',
    COLOR_BOMB: 'color-bomb'
};

// Game state
let sweetsCrushGrid = [];
let sweetsCrushScore = 0;
let sweetsCrushLevel = 1;
let sweetsCrushTime = 60;
let sweetsCrushBest = Number(localStorage.getItem("sweetsCrushBest")) || 0;
let selectedPiece = null;
let isProcessing = false;
let comboCount = 0;
let scoreMultiplier = 1;
let gameTimer = null;
let difficultyLevel = 1;

// DOM elements
let sweetsCrushScreen = null;
let sweetsCrushGridElement = null;
let sweetsCrushScoreElement = null;
let sweetsCrushLevelElement = null;
let sweetsCrushTimeElement = null;
let sweetsCrushBestElement = null;
let sweetsCrushMessageElement = null;
let sweetsCrushGameOverModal = null;
let sweetsCrushFinalScoreElement = null;
let sweetsCrushProgressFill = null;
let sweetsCrushProgressScore = null;
let sweetsCrushProgressTarget = null;

// Initialize the game
function initSweetsCrush() {
    sweetsCrushScreen = document.getElementById('sweets-crush-screen');
    sweetsCrushGridElement = document.getElementById('sweets-crush-grid');
    sweetsCrushScoreElement = document.getElementById('sweets-crush-score');
    sweetsCrushLevelElement = document.getElementById('sweets-crush-level');
    sweetsCrushTimeElement = document.getElementById('sweets-crush-time');
    sweetsCrushBestElement = document.getElementById('sweets-crush-best');
    sweetsCrushMessageElement = document.getElementById('sweets-crush-message');
    sweetsCrushGameOverModal = document.getElementById('sweets-crush-gameover');
    sweetsCrushFinalScoreElement = document.getElementById('sweets-crush-final-score');
    sweetsCrushProgressFill = document.getElementById('sweets-crush-progress-fill');
    sweetsCrushProgressScore = document.getElementById('sweets-crush-progress-score');
    sweetsCrushProgressTarget = document.getElementById('sweets-crush-progress-target');
    
    if (sweetsCrushBestElement) {
        sweetsCrushBestElement.textContent = sweetsCrushBest;
    }
}

// Start Sweets Crush game
function startSweetsCrush() {
    if (!sweetsCrushScreen) {
        initSweetsCrush();
    }
    
    // Hide other screens
    document.getElementById('landing-screen').classList.remove('active');
    document.getElementById('menu-screen').classList.remove('active');
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('quiz-screen').classList.remove('active');
    document.getElementById('aarti-screen').classList.remove('active');
    
    // Show Sweets Crush screen
    sweetsCrushScreen.classList.add('active');
    
    // Reset game state
    sweetsCrushScore = 0;
    sweetsCrushLevel = 1;
    sweetsCrushTime = 60; // Base time
    selectedPiece = null;
    isProcessing = false;
    comboCount = 0;
    scoreMultiplier = 1;
    difficultyLevel = 1;
    
    // Update displays
    updateSweetsCrushDisplay();
    
    // Hide game over modal
    sweetsCrushGameOverModal.classList.add('hidden');
    
    // Create initial grid
    createSweetsCrushGrid();
    
    // Clear message
    sweetsCrushMessageElement.textContent = '';
    
    // Start timer
    startGameTimer();
}

// Start game timer
function startGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    gameTimer = setInterval(() => {
        if (!isProcessing && sweetsCrushTime > 0) {
            sweetsCrushTime--;
            updateSweetsCrushDisplay();
            
            if (sweetsCrushTime <= 0) {
                endSweetsCrush();
            }
        }
    }, 1000);
}

// Create the game grid with special elements
function createSweetsCrushGrid() {
    sweetsCrushGrid = [];
    sweetsCrushGridElement.innerHTML = '';
    
    // Create grid without initial matches
    for (let row = 0; row < GRID_SIZE; row++) {
        sweetsCrushGrid[row] = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            let cellData = determineCellType(row, col);
            
            // Ensure no initial matches for normal sweets
            if (cellData.special === SPECIAL_TYPES.NORMAL) {
                let sweetType;
                do {
                    sweetType = Math.floor(Math.random() * SWEET_TYPES.length);
                } while (wouldCreateMatch(row, col, sweetType));
                cellData.type = sweetType;
            }
            
            sweetsCrushGrid[row][col] = cellData;
            
            // Create DOM element
            const piece = createSweetPiece(row, col, cellData);
            sweetsCrushGridElement.appendChild(piece);
        }
    }
}

// Determine cell type based on difficulty
function determineCellType(row, col) {
    const rand = Math.random();
    
    // Increase special elements with difficulty
    const bombChance = 0.02 + (difficultyLevel * 0.01);
    const lockChance = 0.03 + (difficultyLevel * 0.015);
    const specialChance = 0.01 + (difficultyLevel * 0.005);
    
    if (rand < bombChance) {
        return { special: SPECIAL_TYPES.BOMB, type: Math.floor(Math.random() * SWEET_TYPES.length) };
    } else if (rand < bombChance + lockChance) {
        return { special: SPECIAL_TYPES.LOCKED, type: Math.floor(Math.random() * SWEET_TYPES.length) };
    } else if (rand < bombChance + lockChance + specialChance) {
        const specials = [SPECIAL_TYPES.STRIPED_H, SPECIAL_TYPES.STRIPED_V, SPECIAL_TYPES.WRAPPED];
        return { special: specials[Math.floor(Math.random() * specials.length)], type: Math.floor(Math.random() * SWEET_TYPES.length) };
    }
    
    return { special: SPECIAL_TYPES.NORMAL, type: 0 }; // Type will be set by grid creation
}

// Check if placing a sweet would create a match
function wouldCreateMatch(row, col, type) {
    // Check horizontal
    if (col >= 2) {
        if (sweetsCrushGrid[row][col-1]?.type === type && 
            sweetsCrushGrid[row][col-2]?.type === type) {
            return true;
        }
    }
    
    // Check vertical
    if (row >= 2) {
        if (sweetsCrushGrid[row-1]?.[col]?.type === type && 
            sweetsCrushGrid[row-2]?.[col]?.type === type) {
            return true;
        }
    }
    
    return false;
}

// Create a sweet piece DOM element
function createSweetPiece(row, col, cellData) {
    const piece = document.createElement('div');
    piece.className = 'sweet-piece';
    
    // Add special classes
    if (cellData.special !== SPECIAL_TYPES.NORMAL) {
        piece.classList.add(cellData.special);
    }
    
    // Set emoji
    piece.textContent = SWEET_TYPES[cellData.type].emoji;
    piece.dataset.row = row;
    piece.dataset.col = col;
    piece.dataset.type = cellData.type;
    piece.dataset.special = cellData.special;
    
    piece.addEventListener('click', () => handlePieceClick(row, col));
    
    return piece;
}

// Handle piece click
function handlePieceClick(row, col) {
    if (isProcessing || sweetsCrushTime <= 0) return;
    
    const cellData = sweetsCrushGrid[row][col];
    
    // Handle locked sweets
    if (cellData.special === SPECIAL_TYPES.LOCKED) {
        sweetsCrushMessageElement.textContent = 'This sweet is locked! Match adjacent sweets to unlock it.';
        setTimeout(() => sweetsCrushMessageElement.textContent = '', 2000);
        return;
    }
    
    const clickedPiece = getPieceElement(row, col);
    
    if (selectedPiece === null) {
        // Select first piece
        selectedPiece = { row, col };
        clickedPiece.classList.add('selected');
        sweetsCrushMessageElement.textContent = 'Select adjacent sweet to swap';
    } else {
        // Try to swap
        const firstPiece = getPieceElement(selectedPiece.row, selectedPiece.col);
        firstPiece.classList.remove('selected');
        
        if (isAdjacent(selectedPiece.row, selectedPiece.col, row, col)) {
            swapPieces(selectedPiece.row, selectedPiece.col, row, col);
        } else {
            // Select new piece if not adjacent
            selectedPiece = { row, col };
            clickedPiece.classList.add('selected');
            sweetsCrushMessageElement.textContent = 'Select adjacent sweet to swap';
        }
    }
}

// Check if two positions are adjacent
function isAdjacent(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Get piece element at position
function getPieceElement(row, col) {
    return sweetsCrushGridElement.children[row * GRID_SIZE + col];
}

// Swap two pieces with animation
async function swapPieces(row1, col1, row2, col2) {
    isProcessing = true;
    selectedPiece = null;
    
    const piece1 = getPieceElement(row1, col1);
    const piece2 = getPieceElement(row2, col2);
    
    // Add swap animation class
    piece1.classList.add('swapping');
    piece2.classList.add('swapping');
    
    // Calculate swap direction
    const rowDiff = row2 - row1;
    const colDiff = col2 - col1;
    
    // Apply visual swap
    piece1.style.transform = `translate(${colDiff * 100}%, ${rowDiff * 100}%)`;
    piece2.style.transform = `translate(${-colDiff * 100}%, ${-rowDiff * 100}%)`;
    
    // Wait for animation
    await sleep(300);
    
    // Remove animation class
    piece1.classList.remove('swapping');
    piece2.classList.remove('swapping');
    piece1.style.transform = '';
    piece2.style.transform = '';
    
    // Swap in grid
    const temp = sweetsCrushGrid[row1][col1];
    sweetsCrushGrid[row1][col1] = sweetsCrushGrid[row2][col2];
    sweetsCrushGrid[row2][col2] = temp;
    
    // Update DOM
    updateGridDisplay();
    
    // Check for matches
    const matches = findMatches();
    
    if (matches.length > 0) {
        // Valid move
        comboCount = 0;
        scoreMultiplier = 1;
        sweetsCrushMessageElement.textContent = 'Match found!';
        
        await processMatches(matches);
    } else {
        // Invalid move - swap back with animation
        sweetsCrushMessageElement.textContent = 'No match! Try again.';
        
        // Animate swap back
        const newPiece1 = getPieceElement(row1, col1);
        const newPiece2 = getPieceElement(row2, col2);
        
        newPiece1.classList.add('swapping');
        newPiece2.classList.add('swapping');
        
        newPiece1.style.transform = `translate(${-colDiff * 100}%, ${-rowDiff * 100}%)`;
        newPiece2.style.transform = `translate(${colDiff * 100}%, ${rowDiff * 100}%)`;
        
        await sleep(300);
        
        newPiece1.classList.remove('swapping');
        newPiece2.classList.remove('swapping');
        newPiece1.style.transform = '';
        newPiece2.style.transform = '';
        
        // Swap back in grid
        const temp = sweetsCrushGrid[row1][col1];
        sweetsCrushGrid[row1][col1] = sweetsCrushGrid[row2][col2];
        sweetsCrushGrid[row2][col2] = temp;
        
        updateGridDisplay();
        sweetsCrushMessageElement.textContent = '';
        isProcessing = false;
    }
}

// Find all matches on the grid
function findMatches() {
    const matches = [];
    
    // Check horizontal matches
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE - 2; col++) {
            const cell = sweetsCrushGrid[row][col];
            if (cell && cell.type !== null && cell.special !== SPECIAL_TYPES.LOCKED) {
                const type = cell.type;
                if (sweetsCrushGrid[row][col+1]?.type === type && 
                    sweetsCrushGrid[row][col+2]?.type === type &&
                    sweetsCrushGrid[row][col+1]?.special !== SPECIAL_TYPES.LOCKED &&
                    sweetsCrushGrid[row][col+2]?.special !== SPECIAL_TYPES.LOCKED) {
                    
                    // Find full match
                    let matchLength = 3;
                    while (col + matchLength < GRID_SIZE && 
                           sweetsCrushGrid[row][col+matchLength]?.type === type &&
                           sweetsCrushGrid[row][col+matchLength]?.special !== SPECIAL_TYPES.LOCKED) {
                        matchLength++;
                    }
                    
                    // Add all pieces in match
                    for (let i = 0; i < matchLength; i++) {
                        const match = { row, col: col + i, type, special: sweetsCrushGrid[row][col+i].special };
                        if (!matches.some(m => m.row === match.row && m.col === match.col)) {
                            matches.push(match);
                        }
                    }
                }
            }
        }
    }
    
    // Check vertical matches
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE - 2; row++) {
            const cell = sweetsCrushGrid[row][col];
            if (cell && cell.type !== null && cell.special !== SPECIAL_TYPES.LOCKED) {
                const type = cell.type;
                if (sweetsCrushGrid[row+1]?.[col]?.type === type && 
                    sweetsCrushGrid[row+2]?.[col]?.type === type &&
                    sweetsCrushGrid[row+1]?.[col]?.special !== SPECIAL_TYPES.LOCKED &&
                    sweetsCrushGrid[row+2]?.[col]?.special !== SPECIAL_TYPES.LOCKED) {
                    
                    // Find full match
                    let matchLength = 3;
                    while (row + matchLength < GRID_SIZE && 
                           sweetsCrushGrid[row+matchLength]?.[col]?.type === type &&
                           sweetsCrushGrid[row+matchLength]?.[col]?.special !== SPECIAL_TYPES.LOCKED) {
                        matchLength++;
                    }
                    
                    // Add all pieces in match
                    for (let i = 0; i < matchLength; i++) {
                        const match = { row: row + i, col, type, special: sweetsCrushGrid[row+i][col].special };
                        if (!matches.some(m => m.row === match.row && m.col === match.col)) {
                            matches.push(match);
                        }
                    }
                }
            }
        }
    }
    
    return matches;
}

// Process matches with special effects
async function processMatches(matches) {
    comboCount++;
    scoreMultiplier = Math.min(comboCount, 5); // Max 5x multiplier
    
    // Calculate score with multiplier
    const baseScore = matches.length * 10;
    const matchScore = baseScore * scoreMultiplier;
    sweetsCrushScore += matchScore;
    
    // Add time bonus for combos
    if (comboCount > 1) {
        sweetsCrushTime += Math.min(comboCount * 2, 10);
        sweetsCrushMessageElement.textContent = `Combo x${comboCount}! +${comboCount * 2}s`;
    }
    
    updateSweetsCrushDisplay();
    
    // Process special sweets first
    const specialMatches = matches.filter(m => m.special !== SPECIAL_TYPES.NORMAL);
    const normalMatches = matches.filter(m => m.special === SPECIAL_TYPES.NORMAL);
    
    // Handle special effects
    for (const match of specialMatches) {
        await handleSpecialSweet(match);
    }
    
    // Animate normal matched pieces with golden glow
    for (const match of normalMatches) {
        const piece = getPieceElement(match.row, match.col);
        if (piece) {
            piece.classList.add('matched');
        }
    }
    
    await sleep(600);
    
    // Remove matched pieces
    for (const match of matches) {
        sweetsCrushGrid[match.row][match.col] = null;
    }
    
    // Check for level up
    checkLevelUp();
    
    // Drop pieces down
    await dropPieces();
    
    // Fill empty spaces
    await fillEmptySpaces();
    
    // Update display
    updateGridDisplay();
    
    // Check for new matches (cascade)
    const newMatches = findMatches();
    if (newMatches.length > 0) {
        await sleep(300);
        await processMatches(newMatches);
    } else {
        comboCount = 0;
        scoreMultiplier = 1;
        sweetsCrushMessageElement.textContent = '';
        isProcessing = false;
    }
}

// Handle special sweet effects
async function handleSpecialSweet(match) {
    const piece = getPieceElement(match.row, match.col);
    if (!piece) return;
    
    switch (match.special) {
        case SPECIAL_TYPES.BOMB:
            await triggerBombExplosion(match.row, match.col);
            break;
        case SPECIAL_TYPES.STRIPED_H:
            await triggerStripedH(match.row, match.col);
            break;
        case SPECIAL_TYPES.STRIPED_V:
            await triggerStripedV(match.row, match.col);
            break;
        case SPECIAL_TYPES.WRAPPED:
            await triggerWrapped(match.row, match.col);
            break;
        case SPECIAL_TYPES.COLOR_BOMB:
            await triggerColorBomb(match.row, match.col, match.type);
            break;
    }
}

// Trigger bomb explosion with sparkling effect
async function triggerBombExplosion(row, col) {
    const piece = getPieceElement(row, col);
    if (piece) {
        piece.classList.add('exploding');
        createSparkles(row, col);
    }
    
    await sleep(400);
    
    // Clear 3x3 area around bomb
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                if (sweetsCrushGrid[r][c]) {
                    sweetsCrushGrid[r][c] = null;
                    sweetsCrushScore += 20; // Bonus for bomb explosion
                }
            }
        }
    }
    
    updateSweetsCrushDisplay();
}

// Create sparkling effect
function createSparkles(row, col) {
    const piece = getPieceElement(row, col);
    if (!piece) return;
    
    const rect = piece.getBoundingClientRect();
    const containerRect = sweetsCrushGridElement.getBoundingClientRect();
    
    for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            left: ${rect.left - containerRect.left + rect.width / 2}px;
            top: ${rect.top - containerRect.top + rect.height / 2}px;
            --tx: ${(Math.random() - 0.5) * 100}px;
            --ty: ${(Math.random() - 0.5) * 100}px;
        `;
        sweetsCrushGridElement.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

// Trigger horizontal striped sweet
async function triggerStripedH(row, col) {
    // Clear entire row
    for (let c = 0; c < GRID_SIZE; c++) {
        if (sweetsCrushGrid[row][c] && sweetsCrushGrid[row][c].special !== SPECIAL_TYPES.LOCKED) {
            sweetsCrushGrid[row][c] = null;
            sweetsCrushScore += 15;
        }
    }
    updateSweetsCrushDisplay();
}

// Trigger vertical striped sweet
async function triggerStripedV(row, col) {
    // Clear entire column
    for (let r = 0; r < GRID_SIZE; r++) {
        if (sweetsCrushGrid[r][col] && sweetsCrushGrid[r][col].special !== SPECIAL_TYPES.LOCKED) {
            sweetsCrushGrid[r][col] = null;
            sweetsCrushScore += 15;
        }
    }
    updateSweetsCrushDisplay();
}

// Trigger wrapped sweet (3x3 explosion)
async function triggerWrapped(row, col) {
    await triggerBombExplosion(row, col);
}

// Trigger color bomb (clear all of one color)
async function triggerColorBomb(row, col, targetType) {
    // Clear all sweets of the same type
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (sweetsCrushGrid[r][c]?.type === targetType && 
                sweetsCrushGrid[r][c].special !== SPECIAL_TYPES.LOCKED) {
                sweetsCrushGrid[r][c] = null;
                sweetsCrushScore += 25;
            }
        }
    }
    updateSweetsCrushDisplay();
}

// Check for level up
function checkLevelUp() {
    const scoreThreshold = sweetsCrushLevel * 500;
    if (sweetsCrushScore >= scoreThreshold) {
        sweetsCrushLevel++;
        difficultyLevel = Math.min(sweetsCrushLevel, 10);
        
        // Increase time with each level: +15s base + (level × 5s)
        const timeBonus = 15 + (sweetsCrushLevel * 5);
        sweetsCrushTime += timeBonus;
        
        sweetsCrushMessageElement.textContent = `Level Up! Now Level ${sweetsCrushLevel}! +${timeBonus}s time bonus!`;
        updateSweetsCrushDisplay();
    }
}

// Drop pieces down to fill gaps
async function dropPieces() {
    for (let col = 0; col < GRID_SIZE; col++) {
        let emptyRow = GRID_SIZE - 1;
        
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
            if (sweetsCrushGrid[row][col] !== null) {
                if (row !== emptyRow) {
                    sweetsCrushGrid[emptyRow][col] = sweetsCrushGrid[row][col];
                    sweetsCrushGrid[row][col] = null;
                }
                emptyRow--;
            }
        }
    }
}

// Fill empty spaces with new pieces
async function fillEmptySpaces() {
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE; row++) {
            if (sweetsCrushGrid[row][col] === null) {
                let cellData = determineCellType(row, col);
                cellData.type = Math.floor(Math.random() * SWEET_TYPES.length);
                sweetsCrushGrid[row][col] = cellData;
            }
        }
    }
}

// Update grid display
function updateGridDisplay() {
    sweetsCrushGridElement.innerHTML = '';
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cellData = sweetsCrushGrid[row][col];
            if (cellData) {
                const piece = createSweetPiece(row, col, cellData);
                sweetsCrushGridElement.appendChild(piece);
            } else {
                // Empty cell placeholder
                const empty = document.createElement('div');
                empty.className = 'sweet-piece';
                empty.style.visibility = 'hidden';
                sweetsCrushGridElement.appendChild(empty);
            }
        }
    }
}

// Update display elements
function updateSweetsCrushDisplay() {
    sweetsCrushScoreElement.textContent = sweetsCrushScore;
    sweetsCrushLevelElement.textContent = sweetsCrushLevel;
    sweetsCrushTimeElement.textContent = sweetsCrushTime;
    sweetsCrushBestElement.textContent = sweetsCrushBest;
    
    // Update progress bar
    updateLevelProgress();
}

// Update level progress bar
function updateLevelProgress() {
    const currentLevelScore = sweetsCrushScore - ((sweetsCrushLevel - 1) * 500);
    const targetScore = 500;
    const progress = Math.min((currentLevelScore / targetScore) * 100, 100);
    
    if (sweetsCrushProgressFill) {
        sweetsCrushProgressFill.style.width = `${progress}%`;
    }
    
    if (sweetsCrushProgressScore) {
        sweetsCrushProgressScore.textContent = Math.max(0, currentLevelScore);
    }
    
    if (sweetsCrushProgressTarget) {
        sweetsCrushProgressTarget.textContent = targetScore;
    }
}

// End Sweets Crush game
function endSweetsCrush() {
    isProcessing = true;
    
    // Stop timer
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    // Update best score
    if (sweetsCrushScore > sweetsCrushBest) {
        sweetsCrushBest = sweetsCrushScore;
        localStorage.setItem("sweetsCrushBest", sweetsCrushBest);
        sweetsCrushBestElement.textContent = sweetsCrushBest;
    }
    
    // Show game over
    sweetsCrushFinalScoreElement.textContent = sweetsCrushScore;
    sweetsCrushGameOverModal.classList.remove('hidden');
}

// Restart Sweets Crush game
function restartSweetsCrush() {
    sweetsCrushGameOverModal.classList.add('hidden');
    startSweetsCrush();
}

// Stop Sweets Crush game (for cleanup)
function stopSweetsCrush() {
    isProcessing = false;
    
    // Stop timer
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    selectedPiece = null;
    sweetsCrushScreen.classList.remove('active');
    sweetsCrushGameOverModal.classList.add('hidden');
}

// Helper function for delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initSweetsCrush();
});