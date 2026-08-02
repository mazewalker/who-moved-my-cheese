// ===================================
// WHO MOVED MY CHEESE? - THE GAME
// Game Logic & Engine
// ===================================

// --- C64 Palette (canvas painting can't read CSS custom properties) ---
const C64 = {
    black: '#000000', white: '#FFFFFF', red: '#813338', cyan: '#75CEC8',
    purple: '#8E3C97', green: '#56AC4D', blue: '#2E2C9B', yellow: '#EDF171',
    orange: '#8E5029', brown: '#553800', lightRed: '#C46C71', darkGrey: '#4A4A4A',
    grey: '#7B7B7B', lightGreen: '#A9FF9F', lightBlue: '#706DEB', lightGrey: '#B2B2B2'
};

// Player identity colors, mirrored in CSS (--p1-color / --p2-color)
const PLAYER_COLORS = { 1: C64.cyan, 2: C64.lightRed };

// ===================================
// PIXEL SPRITES (C64-style bitmaps)
// Each map is 16 rows x 16 cols; letters index into a palette.
// ===================================
const SPRITE_DEFS = {
    mouse: [
        "................",
        "..OO........OO..",
        ".OEEO......OEEO.",
        ".OEEO......OEEO.",
        ".OBBOOOOOOOBBO..",
        ".OBBBBBBBBBBBBO.",
        "OBBBBBBBBBBBBBBO",
        "OBBYBBBBBBBBYBBO",
        "OBBBBBBBBBBBBBBO",
        "OBBBBBNNNNBBBBBO",
        ".OBBBBBNNBBBBBO.",
        ".OBBBBBBBBBBBBO.",
        "..OBBBBOOBBBBO..",
        "...OOOOOOOOOO...",
        "................",
        "................"
    ],
    owl: [
        "................",
        "..OO........OO..",
        "..OBO......OBO..",
        "..OBBOOOOOOBBO..",
        ".OBBBBBBBBBBBBO.",
        ".OBBWWBBBBWWBBO.",
        ".OBBWYBBBBWYBBO.",
        ".OBBBBBNNBBBBBO.",
        ".OBBBBBNNBBBBBO.",
        ".OBBBBBBBBBBBBO.",
        ".OBBOBBBBBBOBBO.",
        ".OBBOBBBBBBOBBO.",
        ".OBOOBBBBBBOOBO.",
        "..OOOOOOOOOOOO..",
        "................",
        "................"
    ],
    cheese: [
        "................",
        "................",
        ".......OO.......",
        "......OYYO......",
        ".....OYYYYO.....",
        "....OYYOYYO.....",
        "...OYYYYYYYO....",
        "..OYYOYYYYYYO...",
        ".OYYYYYYYOYYYO..",
        "OYYYYOYYYYYYYYO.",
        "OOOOOOOOOOOOOOOO",
        "................",
        "................",
        "................",
        "................",
        "................"
    ],
    bat: [
        "................",
        ".OO..........OO.",
        ".OBO........OBO.",
        ".OBBO..OO..OBBO.",
        ".OBBBOOBBOOBBBO.",
        ".OBBBBBBBBBBBBO.",
        "..OBBYBBBBYBBO..",
        "..OBBBBBBBBBBO..",
        "...OBOOBOOBO....",
        "....O..OO..O....",
        "................",
        "................",
        "................",
        "................",
        "................",
        "................"
    ],
    raccoon: [
        "................",
        "..OO........OO..",
        ".OEEO......OEEO.",
        ".OBOOOOOOOOOOBO.",
        ".OBBBBBBBBBBBBO.",
        "OBBMMMMMMMMMMBBO",
        "OBMWMMMMMMMWMBBO",
        "OBBMMMMMMMMMMBBO",
        "OBBBBBBBBBBBBBBO",
        ".OBBBNNNNNBBBO..",
        "..OBBBBBBBBBBBO.",
        "...OOOOOOOOOO...",
        "................",
        "................",
        "................",
        "................"
    ],
    wolf: [
        "................",
        "..OO........OO..",
        "..OBO......OBO..",
        "..OBBO....OBBO..",
        "...OBBOOOOBBO...",
        "...OBBBBBBBBO...",
        "..OBBYBBBBYBBO..",
        "..OBBBBBBBBBBO..",
        "..OBBBNNNNBBBO..",
        "...OBBNNNNBBO...",
        "....OBBBBBBO....",
        ".....OOOOOO.....",
        "................",
        "................",
        "................",
        "................"
    ],
    shield: [
        "................",
        ".OOOOOOOOOOOOOO.",
        ".OCCCCCCCCCCCCO.",
        ".OCCWWWCCCCCCCO.",
        ".OCWWWWCCCCCCCO.",
        ".OCCCCCCCCCCCCO.",
        ".OCCCCCCCCCCCCO.",
        "..OCCCCCCCCCCO..",
        "..OCCCCCCCCCCO..",
        "...OCCCCCCCCO...",
        "....OCCCCCCO....",
        ".....OCCCCO.....",
        "......OCCO......",
        ".......OO.......",
        "................",
        "................"
    ],
    apple: [
        "................",
        "........O.......",
        ".....OOOOO......",
        "...OOOOOOOOO....",
        "..OGGGGGGGGGO...",
        ".OGWGGGGGGGGGO..",
        ".OGGGGGGGGGGGO..",
        ".OGGGGGGGGGGGO..",
        ".OGGGGGGGGGGGO..",
        "..OGGGGGGGGGO...",
        "...OGGGGGGGO....",
        "....OOO.OOO.....",
        "................",
        "................",
        "................",
        "................"
    ]
};

// Palette letters used in the maps: O=outline, B=body, E=ear, Y=eye/detail,
// N=nose/beak, W=white, M=mask, C=shield fill, G=apple fill.
const SPRITE_PALETTES = {
    sniff:           { O: C64.black, B: C64.lightGrey, E: C64.lightRed, Y: C64.black, N: C64.lightRed },
    scurry:          { O: C64.black, B: C64.orange,    E: C64.lightRed, Y: C64.black, N: C64.lightRed },
    hem:             { O: C64.black, B: C64.grey,      E: C64.lightRed, Y: C64.black, N: C64.lightRed },
    haw:             { O: C64.black, B: C64.orange,    E: C64.brown,    Y: C64.black, N: C64.yellow, W: C64.white },
    wanderer:        { O: C64.black, B: C64.grey,      Y: C64.lightRed },
    thief:           { O: C64.black, B: C64.red,       E: C64.lightRed, M: C64.darkGrey, W: C64.white, N: C64.black },
    guardian:        { O: C64.black, B: C64.purple,    Y: C64.yellow,   N: C64.black },
    cheese:          { O: C64.orange, Y: C64.yellow },
    'cheese-golden': { O: '#C9CB5E', Y: '#F5F79B' },
    shield:          { O: C64.black, C: C64.cyan,   W: C64.white },
    apple:           { O: C64.black, G: C64.green,  W: C64.white },
    'mouse-green':   { O: C64.black, B: C64.green,  E: C64.lightRed, Y: C64.black, N: C64.lightRed },
    'mouse-yellow':  { O: C64.black, B: C64.yellow, E: C64.lightRed, Y: C64.black, N: C64.lightRed },
    'mouse-red':     { O: C64.black, B: C64.red,    E: C64.lightRed, Y: C64.black, N: C64.lightRed }
};

// Which sprite def + palette each playable character uses
const CHARACTER_SPRITES = {
    sniff: { def: 'mouse', palette: 'sniff' },
    scurry: { def: 'mouse', palette: 'scurry' },
    hem: { def: 'mouse', palette: 'hem' },
    haw: { def: 'owl', palette: 'haw' }
};
const ENEMY_SPRITES = { wanderer: { def: 'bat', palette: 'wanderer' }, thief: { def: 'raccoon', palette: 'thief' }, guardian: { def: 'wolf', palette: 'guardian' } };
const POWERUP_SPRITES = { shield: { def: 'shield', palette: 'shield' }, apple: { def: 'apple', palette: 'apple' } };

const spriteCache = new Map();

// Renders a sprite def with a palette onto an offscreen canvas (cached).
// scale is the size of one source pixel in the output canvas.
function getSprite(defName, paletteName, scale = 8) {
    const key = `${defName}:${paletteName}:${scale}`;
    if (spriteCache.has(key)) return spriteCache.get(key);

    const map = SPRITE_DEFS[defName];
    const palette = SPRITE_PALETTES[paletteName];
    const c = document.createElement('canvas');
    c.width = 16 * scale;
    c.height = 16 * scale;
    const cctx = c.getContext('2d');
    for (let y = 0; y < 16; y++) {
        const row = map[y];
        for (let x = 0; x < 16; x++) {
            const color = palette[row[x]];
            if (!color) continue;
            cctx.fillStyle = color;
            cctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
    spriteCache.set(key, c);
    return c;
}

// Data-URL version for <img> tags in the DOM (menus, HUD, cards)
function spriteDataURL(defName, paletteName, scale = 8) {
    return getSprite(defName, paletteName, scale).toDataURL();
}

// --- Achievements (icons are glyphs from the C64 charset) ---
const ACHIEVEMENTS = [
    { id: 'first-cheese', name: 'First Bite', icon: '●', description: 'Collect your first cheese.' },
    { id: 'century-score', name: 'Century Club', icon: '█', description: 'Reach 100 points in a single game.' },
    { id: 'golden-goal', name: 'Golden Goal', icon: '♦', description: 'Collect a golden cheese.' },
    { id: 'combo-master', name: 'Combo Master', icon: '♥', description: 'Reach a 5x combo streak.' },
    { id: 'level-5-survivor', name: 'Deep Maze Explorer', icon: '♣', description: 'Reach level 5.' },
    { id: 'no-hit-clear', name: 'Untouchable', icon: '▓', description: 'Finish a game with 5+ cheese and no life lost.' },
    { id: 'roster-complete', name: 'Met the Whole Crew', icon: '♠', description: 'Play a game as all 4 characters.' }
];

const ENEMY_TINTS = { thief: C64.red, wanderer: C64.grey, guardian: C64.purple };
const DIR_VECTORS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// --- Game State ---
const GameState = {
    currentScreen: 'loading-screen',
    selectedCharacter: null,
    difficulty: 'easy',
    score: 0,
    timeLeft: 60,
    level: 1,
    lives: 3,
    cheeseCollected: 0,
    isPlaying: false,
    isPaused: false,
    maze: [],
    mazeWidth: 0,
    mazeHeight: 0,
    cellSize: 0,
    player: { x: 0, y: 0, spawnX: 0, spawnY: 0, invulnerableUntil: 0, lastMoveTs: 0 },
    multiplayer: false,
    selectedCharacter2: null,
    player2: { x: 0, y: 0, spawnX: 0, spawnY: 0, invulnerableUntil: 0, lastMoveTs: 0 },
    score2: 0,
    cheese: { x: 0, y: 0, type: 'regular', moving: false },
    cheeseMoveInterval: null,
    cheeseMoveAt: 0,     // timestamp of the next relocation
    cheeseWarnAt: 0,     // timestamp when the "moving soon" warning starts
    cheeseWarned: false,
    pausedAt: 0,         // when the current pause began (to shift scheduled events on resume)
    gameTimer: null,
    enemyMoveInterval: null,
    lastKeyTime: 0,

    enemies: [],
    particles: [],
    shake: { remaining: 0, duration: 0, magnitude: 0, x: 0, y: 0 },
    combo: { count: 0, lastCollectTs: 0 },
    spokenQuotes: new Set(),
    powerups: { active: null, shieldCharges: 0, shieldCharges2: 0 },
    achievements: { unlocked: JSON.parse(localStorage.getItem('cheese_achievements') || '{}') },
    touch: { enabled: false },
    rafId: null,
    lastFrameTime: 0,

    quotes: [
        "The faster you let go of old cheese, the sooner you find new cheese.",
        "It is safer to search the maze for new cheese.",
        "What you fear is never as bad as what you imagine.",
        "Change happens. Anticipate, adapt, and enjoy change.",
        "The only thing that is constant is change.",
        "When you change what you believe, you change what you do.",
        "Movement in a new direction helps you find new cheese.",
        "They may move your cheese, but you can find new cheese too!",
        "If you do not change, you can become extinct.",
        "Notice the small changes. It prepares you for the big changes to come."
    ],
    resultQuotes: [
        "Everyone is changing their cheese. The question is, are you?",
        "If you are not afraid to wander in the maze, you will find more cheese.",
        "You can change what you feel by changing what you do and think.",
        "Sometimes you need to hold on tight to your cheese... and sometimes let it go."
    ],
    characters: {
        sniff: {
            name: 'Sniff',
            description: 'Smells out change early',
            ability: 'Cheese warning appears 2 seconds earlier',
            abilityClass: 'sniff',
            stats: { speed: 1, perception: 3, adaptability: 1 }
        },
        scurry: {
            name: 'Scurry',
            description: 'Runs fast through the maze',
            ability: 'Moves at double speed (half the usual delay between steps)',
            abilityClass: 'scurry',
            stats: { speed: 3, perception: 1, adaptability: 1 }
        },
        hem: {
            name: 'Hem',
            description: 'Resists change but learns',
            ability: '+1 extra life at start',
            abilityClass: 'hem',
            stats: { speed: 1, perception: 1, adaptability: 2 }
        },
        haw: {
            name: 'Haw',
            description: 'Sees the big picture',
            ability: 'Can see cheese location on minimap',
            abilityClass: 'haw',
            stats: { speed: 1, perception: 2, adaptability: 3 }
        }
    },
    leaderboard: {
        easy: JSON.parse(localStorage.getItem('cheese_leaderboard_easy') || '[]'),
        medium: JSON.parse(localStorage.getItem('cheese_leaderboard_medium') || '[]'),
        hard: JSON.parse(localStorage.getItem('cheese_leaderboard_hard') || '[]')
    }
};

// --- Canvas Setup ---
const canvas = document.getElementById('maze-canvas');
const ctx = canvas.getContext('2d');

// --- Screen Management ---
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    GameState.currentScreen = screenId;
}

function showMainMenu() {
    stopGame();
    showScreen('main-menu');
    populateMenuCharacters();
}

function showCharacterSelect() {
    GameState.selectedCharacter = null;
    GameState.selectedCharacter2 = null;
    showScreen('character-select');
    populateCharacterGrid();
    updateCharSelectSubtitle();
}

function startSinglePlayerSelect() {
    GameState.multiplayer = false;
    showCharacterSelect();
}

function startMultiplayerSelect() {
    GameState.multiplayer = true;
    showCharacterSelect();
}

function updateCharSelectSubtitle() {
    const subtitle = document.getElementById('select-subtitle');
    if (!subtitle) return;
    subtitle.classList.remove('pick-p1', 'pick-p2');
    const cursor = '<span class="blink">█</span>';
    if (!GameState.multiplayer) {
        subtitle.innerHTML = 'Each cheese eater has unique abilities! ' + cursor;
    } else if (!GameState.selectedCharacter) {
        subtitle.innerHTML = 'Player 1: Choose your character! (Arrow Keys / Joystick 1) ' + cursor;
        subtitle.classList.add('pick-p1');
    } else {
        subtitle.innerHTML = 'Player 2: Choose your character! (WASD / Joystick 2) ' + cursor;
        subtitle.classList.add('pick-p2');
    }
}

function showInstructions() {
    document.getElementById('instructions-modal').classList.add('active');
}

function showLeaderboard() {
    document.getElementById('leaderboard-modal').classList.add('active');
    switchLeaderboardTab(GameState.difficulty);
}

function showAchievements() {
    populateAchievementsGrid();
    document.getElementById('achievements-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// --- Character Selection ---
function characterSpriteImg(key, scale = 6) {
    const sprite = CHARACTER_SPRITES[key];
    return `<img src="${spriteDataURL(sprite.def, sprite.palette, scale)}" alt="${GameState.characters[key].name}">`;
}

function populateMenuCharacters() {
    const grid = document.getElementById('menu-char-grid');
    if (grid.children.length > 0) return; // Already populated

    Object.entries(GameState.characters).forEach(([key, char]) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <span class="char-icon">${characterSpriteImg(key)}</span>
            <div class="char-name">${char.name}</div>
        `;
        card.onclick = () => {
            GameState.multiplayer = false;
            GameState.selectedCharacter2 = null;
            GameState.selectedCharacter = key;
            showScreen('difficulty-select');
        };
        grid.appendChild(card);
    });
}

function populateCharacterGrid() {
    const grid = document.getElementById('char-grid');
    grid.innerHTML = '';

    Object.entries(GameState.characters).forEach(([key, char]) => {
        const card = document.createElement('div');
        card.className = 'char-card';
        if (GameState.multiplayer) {
            if (key === GameState.selectedCharacter) card.classList.add('selected-p1');
            if (key === GameState.selectedCharacter2) card.classList.add('selected-p2');
        } else if (key === GameState.selectedCharacter) {
            card.classList.add('selected-p1');
        }

        // "P1"/"P2" ribbon so it is always obvious who picked which character
        let badges = '';
        if (key === GameState.selectedCharacter) badges += '<span class="pick-badge">P1</span>';
        if (GameState.multiplayer && key === GameState.selectedCharacter2) badges += '<span class="pick-badge p2">P2</span>';

        card.innerHTML = `
            ${badges}
            <span class="char-icon">${characterSpriteImg(key)}</span>
            <div class="char-name">${char.name}</div>
            <p class="char-desc">${char.description}</p>
            <p class="char-ability">${char.ability}</p>
        `;
        card.onclick = () => selectCharacter(key);
        grid.appendChild(card);
    });
}

function selectCharacter(key) {
    if (!GameState.multiplayer) {
        GameState.selectedCharacter = key;
        showScreen('difficulty-select');
        return;
    }

    if (!GameState.selectedCharacter) {
        GameState.selectedCharacter = key;
        populateCharacterGrid();
        updateCharSelectSubtitle();
        return;
    }

    GameState.selectedCharacter2 = key;
    populateCharacterGrid();
    showScreen('difficulty-select');
}

// --- Maze Generation (Recursive Backtracker) ---
function generateMaze(width, height, startX = 0, startY = 0) {
    const maze = [];
    for (let y = 0; y < height; y++) {
        maze[y] = [];
        for (let x = 0; x < width; x++) {
            maze[y][x] = {
                top: true, right: true, bottom: true, left: true,
                visited: false
            };
        }
    }

    const stack = [];
    let current = { x: startX, y: startY };
    maze[startY][startX].visited = true;
    let visitedCount = 1;
    const totalCells = width * height;

    while (visitedCount < totalCells) {
        const neighbors = getUnvisitedNeighbors(current, maze, width, height);

        if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(current);
            removeWall(maze, current, next);
            current = next;
            maze[current.y][current.x].visited = true;
            visitedCount++;
        } else if (stack.length > 0) {
            current = stack.pop();
        }
    }

    return maze;
}

function getUnvisitedNeighbors(current, maze, width, height) {
    const neighbors = [];
    const { x, y } = current;

    if (y > 0 && !maze[y - 1][x].visited) neighbors.push({ x, y: y - 1 });
    if (x < width - 1 && !maze[y][x + 1].visited) neighbors.push({ x: x + 1, y });
    if (y < height - 1 && !maze[y + 1][x].visited) neighbors.push({ x, y: y + 1 });
    if (x > 0 && !maze[y][x - 1].visited) neighbors.push({ x: x - 1, y });

    return neighbors;
}

function removeWall(maze, current, next) {
    const dx = next.x - current.x;
    const dy = next.y - current.y;

    if (dx === 1) { maze[current.y][current.x].right = false; maze[next.y][next.x].left = false; }
    if (dx === -1) { maze[current.y][current.x].left = false; maze[next.y][next.x].right = false; }
    if (dy === 1) { maze[current.y][current.x].bottom = false; maze[next.y][next.x].top = false; }
    if (dy === -1) { maze[current.y][current.x].top = false; maze[next.y][next.x].bottom = false; }
}

// Recursive-backtracker output is a perfect (fully-spanning, loop-free) maze.
// Removing any additional wall can only ever create a loop, never disconnect
// the graph, so BFS reachability guarantees survive this pass for free.
function braidMaze(maze, width, height, loopFactor) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = maze[y][x];
            if (x < width - 1 && cell.right && Math.random() < loopFactor) {
                cell.right = false;
                maze[y][x + 1].left = false;
            }
            if (y < height - 1 && cell.bottom && Math.random() < loopFactor) {
                cell.bottom = false;
                maze[y + 1][x].top = false;
            }
        }
    }
}

function getOpenNeighbors(x, y) {
    const cell = GameState.maze[y][x];
    const neighbors = [];
    if (!cell.top && y > 0) neighbors.push({ x, y: y - 1 });
    if (!cell.right && x < GameState.mazeWidth - 1) neighbors.push({ x: x + 1, y });
    if (!cell.bottom && y < GameState.mazeHeight - 1) neighbors.push({ x, y: y + 1 });
    if (!cell.left && x > 0) neighbors.push({ x: x - 1, y });
    return neighbors;
}

// BFS distance map from a starting cell; also backs isReachable/getReachableCells.
function bfsDistances(startX, startY) {
    const dist = new Map();
    dist.set(`${startX},${startY}`, 0);
    const queue = [{ x: startX, y: startY }];

    while (queue.length > 0) {
        const { x, y } = queue.shift();
        const d = dist.get(`${x},${y}`);
        for (const n of getOpenNeighbors(x, y)) {
            const key = `${n.x},${n.y}`;
            if (!dist.has(key)) {
                dist.set(key, d + 1);
                queue.push(n);
            }
        }
    }
    return dist;
}

function isReachable(startX, startY, targetX, targetY) {
    return bfsDistances(startX, startY).has(`${targetX},${targetY}`);
}

function getReachableCells(startX, startY) {
    return [...bfsDistances(startX, startY).keys()].map(key => {
        const [x, y] = key.split(',').map(Number);
        return { x, y };
    });
}

function pickSpawnCorners() {
    const w = GameState.mazeWidth, h = GameState.mazeHeight;
    const pairs = [
        { p1: { x: 0, y: 0 }, p2: { x: w - 1, y: h - 1 } },
        { p1: { x: w - 1, y: 0 }, p2: { x: 0, y: h - 1 } }
    ];
    const pick = pairs[Math.floor(Math.random() * pairs.length)];
    GameState.player = { x: pick.p1.x, y: pick.p1.y, spawnX: pick.p1.x, spawnY: pick.p1.y, invulnerableUntil: 0, lastMoveTs: 0 };
    GameState.player2 = { x: pick.p2.x, y: pick.p2.y, spawnX: pick.p2.x, spawnY: pick.p2.y, invulnerableUntil: 0, lastMoveTs: 0 };
}

// --- Game Initialization ---
function startGame(difficulty) {
    GameState.difficulty = difficulty;
    GameState.score = 0;
    GameState.score2 = 0;
    GameState.level = 1;
    GameState.cheeseCollected = 0;
    GameState.combo = { count: 0, lastCollectTs: 0 };
    GameState.spokenQuotes = new Set();
    GameState.particles = [];
    GameState.shake = { remaining: 0, duration: 0, magnitude: 0, x: 0, y: 0 };
    GameState.powerups = { active: null, shieldCharges: 0, shieldCharges2: 0 };
    GameState.lastFrameTime = 0;

    // Set lives based on character ability
    GameState.lives = GameState.selectedCharacter === 'hem' ? 4 : 3; // Hem gets +1 life

    // Set time based on difficulty
    switch (difficulty) {
        case 'easy': GameState.timeLeft = 150; break;
        case 'medium': GameState.timeLeft = 100; break;
        case 'hard': GameState.timeLeft = 75; break;
    }

    // Set maze size based on level
    updateMazeSize();

    // Randomize spawn corners, then carve the maze starting from player 1's corner
    pickSpawnCorners();
    GameState.maze = generateMaze(GameState.mazeWidth, GameState.mazeHeight, GameState.player.spawnX, GameState.player.spawnY);
    braidMaze(GameState.maze, GameState.mazeWidth, GameState.mazeHeight, 0.12);

    // Place cheese at a reachable point, then populate enemies around it
    placeCheese();
    spawnEnemies();

    recordCharacterPlayed(GameState.selectedCharacter);

    GameState.touch.enabled = window.matchMedia('(pointer: coarse) and (hover: none)').matches && !GameState.multiplayer;
    const dpad = document.getElementById('touch-dpad');
    if (dpad) dpad.classList.toggle('visible', GameState.touch.enabled);
    document.body.classList.toggle('touch-controls-active', GameState.touch.enabled);

    // Setup canvas
    setupCanvas();

    // Start game
    GameState.isPlaying = true;
    GameState.isPaused = false;
    showScreen('game-screen');

    toggleMultiplayerUI();
    updateUI();
    updateQuote();

    // Reset the timer's low-time styling from any previous game
    document.getElementById('timer').classList.remove('time-low');

    // Start timers
    startGameTimer();
    startCheeseMovement();
    startEnemyMovement();

    cancelAnimationFrame(GameState.rafId);
    GameState.rafId = requestAnimationFrame(gameLoop);

    // Hide hint after 3 seconds. Skipped entirely on touch -- the on-screen D-pad
    // is self-explanatory and screen space is tight on mobile.
    const hint = document.getElementById('player-hint');
    if (hint) {
        if (GameState.touch.enabled) {
            hint.style.display = 'none';
        } else {
            hint.textContent = GameState.multiplayer ? 'P1 (cyan): Arrow Keys / Joy 1  --  P2 (red): WASD / Joy 2' : 'Use Arrow Keys or WASD to move';
            hint.style.display = '';
            setTimeout(() => { hint.style.display = 'none'; }, 4000);
        }
    }
}

// Shows/hides the P2 HUD panel and fills both player panels with the chosen
// characters' names + sprites so it is always visible who is P1 and who is P2.
function toggleMultiplayerUI() {
    const p2Panel = document.getElementById('p2-panel');
    if (p2Panel) p2Panel.style.display = GameState.multiplayer ? 'flex' : 'none';

    const p1Sprite = document.getElementById('p1-hud-sprite');
    const p2Sprite = document.getElementById('p2-hud-sprite');
    const p1Name = document.getElementById('p1-hud-name');
    const p2Name = document.getElementById('p2-hud-name');

    if (p1Sprite && GameState.selectedCharacter) {
        const s = CHARACTER_SPRITES[GameState.selectedCharacter];
        p1Sprite.src = spriteDataURL(s.def, s.palette);
    }
    if (p1Name && GameState.selectedCharacter) {
        p1Name.textContent = GameState.characters[GameState.selectedCharacter].name;
    }
    if (GameState.multiplayer && p2Sprite && GameState.selectedCharacter2) {
        const s = CHARACTER_SPRITES[GameState.selectedCharacter2];
        p2Sprite.src = spriteDataURL(s.def, s.palette);
    }
    if (GameState.multiplayer && p2Name && GameState.selectedCharacter2) {
        p2Name.textContent = GameState.characters[GameState.selectedCharacter2].name;
    }
}

function updateMazeSize() {
    const levelBonus = Math.min(GameState.level - 1, 6);

    switch (GameState.difficulty) {
        case 'easy':
            GameState.mazeWidth = 8 + levelBonus;
            GameState.mazeHeight = 6 + levelBonus;
            break;
        case 'medium':
            GameState.mazeWidth = 10 + levelBonus;
            GameState.mazeHeight = 8 + levelBonus;
            break;
        case 'hard':
            GameState.mazeWidth = 12 + levelBonus;
            GameState.mazeHeight = 10 + levelBonus;
            break;
    }
}

function placeCheese() {
    let cheeseX, cheeseY;
    let attempts = 0;

    do {
        cheeseX = Math.floor(Math.random() * GameState.mazeWidth);
        cheeseY = Math.floor(Math.random() * GameState.mazeHeight);
        attempts++;
    } while ((cheeseX === GameState.player.x && cheeseY === GameState.player.y) && attempts < 100);

    // Ensure cheese is always reachable via BFS
    if (!isReachable(GameState.player.x, GameState.player.y, cheeseX, cheeseY)) {
        const reachable = getReachableCells(GameState.player.x, GameState.player.y);
        let candidates = reachable.filter(c => !(c.x === GameState.player.x && c.y === GameState.player.y));
        if (candidates.length === 0) {
            candidates = [{ x: cheeseX, y: cheeseY }];
        }
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        cheeseX = pick.x;
        cheeseY = pick.y;
    }

    // Determine cheese type
    const rand = Math.random();
    let cheeseType = 'regular';
    if (GameState.level >= 3 && rand < 0.1) {
        cheeseType = 'golden';
    } else if (rand < 0.3) {
        cheeseType = 'double';
    }

    GameState.cheese = {
        x: cheeseX,
        y: cheeseY,
        type: cheeseType,
        moving: false
    };

    updateCheeseStatus();
}

function setupCanvas() {
    // The HUD floats over the maze now instead of reserving bars, so the canvas
    // can claim nearly the whole viewport. It still needs a vertical margin
    // (centered top+bottom via the wrapper's flex centering) large enough that
    // the corner HUD panels don't land directly on top of gameplay -- otherwise
    // a player spawning in a top/bottom corner can end up hidden behind the HUD.
    //
    // On touch devices the quote panel relocates near the top (stacking with the
    // stats HUD) to free the bottom row for the D-pad, so top/bottom reserves are
    // asymmetric there. These numbers must stay in sync with the `.touch-controls-active
    // .maze-wrapper { inset: ... }` rule in styles.css -- that CSS rule shrinks the
    // wrapper's own box so centering can't place the canvas under the HUD regardless
    // of this JS calculation, but the two need to agree or the canvas gets clipped.
    const marginX = 16;
    const topReserve = GameState.touch.enabled ? 230 : 110;
    const bottomReserve = GameState.touch.enabled ? 180 : 110;
    // The page padding around the playfield acts as the C64 "border" area
    const bezel = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bezel'), 10) || 14) * 2;
    const maxWidth = window.innerWidth - marginX * 2 - bezel;
    const maxHeight = window.innerHeight - topReserve - bottomReserve - bezel;

    const cellWidth = Math.floor(maxWidth / GameState.mazeWidth);
    const cellHeight = Math.floor(maxHeight / GameState.mazeHeight);
    // No upper cap: the maze should always fill the available screen, however large the cells get.
    GameState.cellSize = Math.max(Math.min(cellWidth, cellHeight), 10);

    canvas.width = GameState.mazeWidth * GameState.cellSize;
    canvas.height = GameState.mazeHeight * GameState.cellSize;
}

// --- Game Timer ---
function startGameTimer() {
    clearInterval(GameState.gameTimer);
    GameState.gameTimer = setInterval(() => {
        if (!GameState.isPaused && GameState.isPlaying) {
            GameState.timeLeft--;
            updateUI();

            if (GameState.timeLeft <= 0) {
                endGame('timeup');
            }

            // Warning at 10 seconds
            if (GameState.timeLeft === 10) {
                document.getElementById('timer').classList.add('time-low');
            }
        }
    }, 1000);
}

// --- Cheese Movement ---
// The cheese relocates on a schedule (cheeseMoveAt), with an on-screen warning
// that appears slightly before (cheeseWarnAt). Both timestamps are shifted when
// the game resumes from pause, so pausing never lets the cheese move "for free".
function getCheeseMoveDelay() {
    let moveInterval;
    switch (GameState.difficulty) {
        case 'easy': moveInterval = 8000 - (GameState.level * 500); break;
        case 'medium': moveInterval = 5000 - (GameState.level * 300); break;
        case 'hard': moveInterval = 3000 - (GameState.level * 200); break;
    }
    return Math.max(moveInterval, 1500); // Minimum 1.5 seconds
}

// Sniff smells change early: his warning shows 2 seconds before everyone else's.
function getCheeseWarningLead() {
    const sniffActive = GameState.selectedCharacter === 'sniff' ||
        (GameState.multiplayer && GameState.selectedCharacter2 === 'sniff');
    return sniffActive ? 3500 : 1500;
}

function scheduleCheeseMove() {
    const now = performance.now();
    GameState.cheeseMoveAt = now + getCheeseMoveDelay();
    GameState.cheeseWarnAt = GameState.cheeseMoveAt - getCheeseWarningLead();
    GameState.cheeseWarned = false;
    GameState.cheese.moving = false;
}

function startCheeseMovement() {
    clearInterval(GameState.cheeseMoveInterval);
    scheduleCheeseMove();
    GameState.cheeseMoveInterval = setInterval(tickCheeseMovement, 200);
}

function tickCheeseMovement() {
    if (!GameState.isPlaying || GameState.isPaused) return;
    const now = performance.now();

    if (!GameState.cheeseWarned && now >= GameState.cheeseWarnAt) {
        GameState.cheeseWarned = true;
        GameState.cheese.moving = true;
        SoundEngine.play('warning');
        updateCheeseStatus();
    }

    if (now >= GameState.cheeseMoveAt) {
        moveCheese();
    }
}

function moveCheese() {
    const possibleMoves = getOpenNeighbors(GameState.cheese.x, GameState.cheese.y);
    let newX = GameState.cheese.x;
    let newY = GameState.cheese.y;

    if (possibleMoves.length > 0) {
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        newX = move.x;
        newY = move.y;
    }

    // Don't place cheese on a player
    const onPlayer = (x, y) =>
        (x === GameState.player.x && y === GameState.player.y) ||
        (GameState.multiplayer && x === GameState.player2.x && y === GameState.player2.y);

    if (onPlayer(newX, newY)) {
        // Try to find another spot
        for (const move of possibleMoves) {
            if (!onPlayer(move.x, move.y)) {
                newX = move.x;
                newY = move.y;
                break;
            }
        }
    }

    GameState.cheese.x = newX;
    GameState.cheese.y = newY;

    scheduleCheeseMove();
    updateCheeseStatus();
}

function updateCheeseStatus() {
    const statusEl = document.getElementById('cheese-status');
    if (GameState.cheese.moving) {
        statusEl.textContent = 'Moving Soon!';
        statusEl.style.color = 'var(--primary)';
    } else {
        statusEl.textContent = 'Stable';
        statusEl.style.color = 'var(--c64-light-green)';
    }
}

// --- Enemies ---
function getEnemyComposition(difficulty, level) {
    if (difficulty === 'easy') {
        if (level <= 1) return [];
        if (level <= 3) return ['wanderer'];
        return ['wanderer', 'guardian'];
    }
    if (difficulty === 'medium') {
        if (level <= 1) return ['wanderer'];
        if (level <= 3) return ['wanderer', 'guardian'];
        return ['wanderer', 'guardian', 'thief'];
    }
    // hard
    if (level <= 1) return ['wanderer', 'thief'];
    if (level <= 3) return ['wanderer', 'thief', 'guardian'];
    return ['wanderer', 'wanderer', 'thief', 'guardian'];
}

function getEnemyMoveInterval(type, difficulty, level) {
    if (type === 'guardian') return Math.max(900, 1800 - level * 60);
    if (type === 'wanderer') {
        switch (difficulty) {
            case 'easy': return Math.max(1200, 2500 - level * 100);
            case 'medium': return Math.max(900, 2000 - level * 120);
            case 'hard': return Math.max(700, 1500 - level * 150);
        }
    }
    if (type === 'thief') {
        switch (difficulty) {
            case 'easy': return Math.max(1000, 2000 - level * 100);
            case 'medium': return Math.max(800, 1600 - level * 100);
            case 'hard': return Math.max(600, 1200 - level * 120);
        }
    }
    return 1500;
}

function spawnEnemies() {
    GameState.enemies = [];
    const types = getEnemyComposition(GameState.difficulty, GameState.level);
    if (types.length === 0) return;

    const distFromPlayer = bfsDistances(GameState.player.x, GameState.player.y);
    const distFromCheese = bfsDistances(GameState.cheese.x, GameState.cheese.y);
    const usedCells = new Set([`${GameState.player.x},${GameState.player.y}`, `${GameState.cheese.x},${GameState.cheese.y}`]);
    if (GameState.multiplayer) usedCells.add(`${GameState.player2.x},${GameState.player2.y}`);
    const minFarDist = Math.max(3, Math.floor(GameState.mazeWidth / 2));

    types.forEach((type, i) => {
        let candidates;
        if (type === 'guardian') {
            candidates = [...distFromCheese.entries()].filter(([key, d]) => d <= 3 && !usedCells.has(key)).map(([key]) => key);
        } else {
            candidates = [...distFromPlayer.entries()].filter(([key, d]) => d >= minFarDist && !usedCells.has(key)).map(([key]) => key);
            if (candidates.length === 0) {
                candidates = [...distFromPlayer.entries()].filter(([key]) => !usedCells.has(key)).map(([key]) => key);
            }
        }
        if (candidates.length === 0) return;

        const key = candidates[Math.floor(Math.random() * candidates.length)];
        const [x, y] = key.split(',').map(Number);
        usedCells.add(key);

        const now = performance.now();
        GameState.enemies.push({
            id: `e${i}-${now}`,
            type, x, y, prevX: x, prevY: y,
            moveStartTs: now, lastMoveTs: now,
            moveInterval: getEnemyMoveInterval(type, GameState.difficulty, GameState.level),
            fleeUntil: 0, fleeFrom: null,
            lastDx: 0, lastDy: 0
        });
    });
}

function startEnemyMovement() {
    clearInterval(GameState.enemyMoveInterval);
    GameState.enemyMoveInterval = setInterval(() => {
        if (!GameState.isPaused && GameState.isPlaying) moveEnemies();
    }, 400);
}

function moveEnemies() {
    const now = performance.now();
    GameState.enemies.forEach(enemy => {
        if (now - enemy.lastMoveTs < enemy.moveInterval) return;
        stepEnemy(enemy, now);
    });
    checkEnemyCollisions();
}

function stepEnemy(enemy, now) {
    let next;
    if (enemy.type === 'wanderer') next = stepWanderer(enemy);
    else if (enemy.type === 'thief') next = stepThief(enemy, now);
    else next = stepGuardian(enemy);

    if (next && (next.x !== enemy.x || next.y !== enemy.y)) {
        enemy.prevX = enemy.x;
        enemy.prevY = enemy.y;
        enemy.lastDx = next.x - enemy.x;
        enemy.lastDy = next.y - enemy.y;
        enemy.x = next.x;
        enemy.y = next.y;
        enemy.moveStartTs = now;
    }
    enemy.lastMoveTs = now;
}

function stepWanderer(enemy) {
    let neighbors = getOpenNeighbors(enemy.x, enemy.y);
    if (neighbors.length === 0) return null;
    if (neighbors.length > 1 && Math.random() < 0.7) {
        const filtered = neighbors.filter(n => !(n.x === enemy.x - enemy.lastDx && n.y === enemy.y - enemy.lastDy));
        if (filtered.length > 0) neighbors = filtered;
    }
    return neighbors[Math.floor(Math.random() * neighbors.length)];
}

function stepThief(enemy, now) {
    const neighbors = getOpenNeighbors(enemy.x, enemy.y);
    if (neighbors.length === 0) return null;

    if (now < enemy.fleeUntil) {
        const from = enemy.fleeFrom || GameState.player;
        let best = neighbors[0], bestDist = -1;
        neighbors.forEach(n => {
            const d = Math.abs(n.x - from.x) + Math.abs(n.y - from.y);
            if (d > bestDist) { bestDist = d; best = n; }
        });
        return best;
    }

    const targets = GameState.multiplayer ? [GameState.player, GameState.player2] : [GameState.player];
    let bestTarget = null, bestTargetDist = Infinity;
    targets.forEach(p => {
        const distFromP = bfsDistances(p.x, p.y);
        const d = distFromP.get(`${enemy.x},${enemy.y}`);
        if (d !== undefined && d < bestTargetDist) { bestTargetDist = d; bestTarget = p; }
    });
    if (!bestTarget) return null;

    const distFromTarget = bfsDistances(bestTarget.x, bestTarget.y);
    let best = null, bestDist = Infinity;
    neighbors.forEach(n => {
        const d = distFromTarget.get(`${n.x},${n.y}`);
        if (d !== undefined && d < bestDist) { bestDist = d; best = n; }
    });
    return best;
}

function stepGuardian(enemy) {
    const distFromCheese = bfsDistances(GameState.cheese.x, GameState.cheese.y);
    const myDist = distFromCheese.get(`${enemy.x},${enemy.y}`);
    const neighbors = getOpenNeighbors(enemy.x, enemy.y);
    if (neighbors.length === 0) return null;

    if (myDist === undefined || myDist > 2) {
        let best = null, bestDist = Infinity;
        neighbors.forEach(n => {
            const d = distFromCheese.get(`${n.x},${n.y}`);
            if (d !== undefined && d < bestDist) { bestDist = d; best = n; }
        });
        return best;
    }

    const withinRange = neighbors.filter(n => {
        const d = distFromCheese.get(`${n.x},${n.y}`);
        return d !== undefined && d <= 2;
    });
    if (withinRange.length === 0) return null;
    return withinRange[Math.floor(Math.random() * withinRange.length)];
}

function checkEnemyCollisions() {
    GameState.enemies.forEach(enemy => {
        if (enemy.x === GameState.player.x && enemy.y === GameState.player.y) {
            handleEnemyHit(1, enemy);
        }
        if (GameState.multiplayer && enemy.x === GameState.player2.x && enemy.y === GameState.player2.y) {
            handleEnemyHit(2, enemy);
        }
    });
}

function handleEnemyHit(playerNum, enemy) {
    const player = playerNum === 2 ? GameState.player2 : GameState.player;
    const now = Date.now();
    if (now < player.invulnerableUntil) return;

    player.invulnerableUntil = now + 1500;

    const hasShield = playerNum === 2 ? GameState.powerups.shieldCharges2 > 0 : GameState.powerups.shieldCharges > 0;
    if (hasShield) {
        if (playerNum === 2) GameState.powerups.shieldCharges2 = 0; else GameState.powerups.shieldCharges = 0;
        SoundEngine.play('shield-block');
        spawnParticles(player.x, player.y, C64.cyan, 10);
        updateUI();
        return;
    }

    if (enemy.type === 'thief') {
        const scoreKey = playerNum === 2 ? 'score2' : 'score';
        const stolen = Math.floor(GameState[scoreKey] * 0.15);
        GameState[scoreKey] = Math.max(0, GameState[scoreKey] - stolen);
        GameState.combo.count = 0;
        enemy.fleeFrom = { x: player.x, y: player.y };
        enemy.fleeUntil = performance.now() + enemy.moveInterval * 3;
    }

    SoundEngine.play('enemy-hit');
    triggerShake(8, 300);
    spawnParticles(player.x, player.y, C64.red, 14);

    // Knockback to this player's spawn corner
    player.x = player.spawnX;
    player.y = player.spawnY;

    if (playerNum === 1) {
        GameState.lives--;
        updateUI();
        if (GameState.lives <= 0) {
            endGame('defeated');
            return;
        }
    } else {
        updateUI();
    }
}

function getEnemyRenderPos(enemy, ts) {
    const glideDuration = 220;
    const t = Math.min(1, (ts - enemy.moveStartTs) / glideDuration);
    return {
        x: enemy.prevX + (enemy.x - enemy.prevX) * t,
        y: enemy.prevY + (enemy.y - enemy.prevY) * t
    };
}

function drawEnemy(enemy, ts) {
    const cs = GameState.cellSize;
    const pos = getEnemyRenderPos(enemy, ts);
    const px = pos.x * cs + cs / 2;
    const py = pos.y * cs + cs / 2;
    const size = cs * 0.42;

    ctx.fillStyle = ENEMY_TINTS[enemy.type];
    ctx.globalAlpha = 0.3;
    ctx.fillRect(px - size, py - size, size * 2, size * 2);
    ctx.globalAlpha = 1;

    const sprite = ENEMY_SPRITES[enemy.type];
    ctx.drawImage(getSprite(sprite.def, sprite.palette), px - size, py - size, size * 2, size * 2);
}

// --- Power-ups ---
function trySpawnPowerup() {
    if (GameState.powerups.active) return;
    if (Math.random() >= 0.25) return;

    const distMap = bfsDistances(GameState.player.x, GameState.player.y);
    const excluded = new Set([`${GameState.cheese.x},${GameState.cheese.y}`, `${GameState.player.x},${GameState.player.y}`]);
    if (GameState.multiplayer) excluded.add(`${GameState.player2.x},${GameState.player2.y}`);
    GameState.enemies.forEach(e => excluded.add(`${e.x},${e.y}`));

    const candidates = [...distMap.keys()].filter(k => !excluded.has(k));
    if (candidates.length === 0) return;

    const key = candidates[Math.floor(Math.random() * candidates.length)];
    const [x, y] = key.split(',').map(Number);
    GameState.powerups.active = { type: Math.random() < 0.5 ? 'shield' : 'apple', x, y };
}

function checkPowerupCollision() {
    const pu = GameState.powerups.active;
    if (!pu) return;
    if (GameState.player.x === pu.x && GameState.player.y === pu.y) {
        collectPowerup(1, pu);
    } else if (GameState.multiplayer && GameState.player2.x === pu.x && GameState.player2.y === pu.y) {
        collectPowerup(2, pu);
    }
}

function collectPowerup(playerNum, pu) {
    if (pu.type === 'shield') {
        if (playerNum === 2) GameState.powerups.shieldCharges2 = 1;
        else GameState.powerups.shieldCharges = 1;
    } else if (pu.type === 'apple') {
        const maxLives = GameState.selectedCharacter === 'hem' ? 4 : 3;
        if (playerNum === 1 && GameState.lives < maxLives) {
            GameState.lives++;
        } else {
            GameState.timeLeft += 15;
        }
    }

    SoundEngine.play('powerup');
    spawnParticles(pu.x, pu.y, pu.type === 'shield' ? C64.cyan : C64.green, 12);
    GameState.powerups.active = null;
    updateUI();
}

function drawPowerup(ts) {
    const pu = GameState.powerups.active;
    if (!pu) return;

    const cs = GameState.cellSize;
    const pulse = 1 + 0.1 * Math.sin(ts / 300);
    const size = cs * 0.38 * pulse;
    const px = pu.x * cs + cs / 2;
    const py = pu.y * cs + cs / 2;

    ctx.fillStyle = pu.type === 'shield' ? C64.cyan : C64.green;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(px - size, py - size, size * 2, size * 2);
    ctx.globalAlpha = 1;

    const sprite = POWERUP_SPRITES[pu.type];
    ctx.drawImage(getSprite(sprite.def, sprite.palette), px - size, py - size, size * 2, size * 2);
}

// --- Particles & Screen Shake ---
function spawnParticles(cellX, cellY, color, count = 12) {
    const cs = GameState.cellSize;
    const cx = cellX * cs + cs / 2;
    const cy = cellY * cs + cs / 2;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 120;
        const life = 400 + Math.random() * 300;
        GameState.particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life, maxLife: life,
            color, size: 2 + Math.random() * 3
        });
    }
}

function updateParticles(dt) {
    GameState.particles = GameState.particles.filter(p => {
        p.life -= dt;
        if (p.life <= 0) return false;
        p.x += p.vx * (dt / 1000);
        p.y += p.vy * (dt / 1000);
        p.vx *= 0.94;
        p.vy *= 0.94;
        return true;
    });
}

function drawParticles() {
    GameState.particles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
}

function triggerShake(magnitude = 8, duration = 300) {
    GameState.shake.magnitude = magnitude;
    GameState.shake.duration = duration;
    GameState.shake.remaining = duration;
}

function updateShake(dt) {
    const shake = GameState.shake;
    if (shake.remaining <= 0) {
        shake.x = 0;
        shake.y = 0;
        return;
    }
    shake.remaining = Math.max(0, shake.remaining - dt);
    const power = shake.magnitude * (shake.remaining / shake.duration);
    shake.x = (Math.random() * 2 - 1) * power;
    shake.y = (Math.random() * 2 - 1) * power;
}

// --- Game Loop (rendering + particle/shake physics only; setInterval timers own game-logic ticks) ---
// --- Gamepad / Joystick Support ---
// Works for both "standard"-mapped gamepads (D-pad on buttons 12-15) and simple
// digital USB joysticks (e.g. Speedlink Competition Pro, THEC64 Joystick) that
// report direction via axes or low-index buttons instead.
//
// Pads are assigned dynamically: the FIRST connected pad found anywhere in
// navigator.getGamepads() drives Player 1, the second drives Player 2. Earlier
// versions only looked at slots 0 and 1, so a joystick that enumerated at a
// higher index (very common when other devices/stale entries occupy the low
// slots) silently never worked.
const GAMEPAD_DEADZONE = 0.5;
const gamepadPrevStart = {};
const gamepadLastDiagLog = {};
let gamepadAssignmentMsg = '';

// All currently connected pads, in slot order.
function getConnectedGamepads() {
    if (!navigator.getGamepads) return [];
    const out = [];
    const pads = navigator.getGamepads();
    for (let i = 0; i < pads.length; i++) {
        if (pads[i] && pads[i].connected) out.push(pads[i]);
    }
    return out;
}

// Simple/older USB joysticks often don't get recognized by the browser's
// "standard" gamepad database, so their buttons/axes can land at different
// indices than a modern controller. Rather than assume one fixed layout, scan
// every axis pair for deflection (not just axes[0]/[1]) and check both the
// standard D-pad button range (12-15) and the low button range (0-3) some
// simple pads use instead.
function getGamepadDirection(pad) {
    const buttons = pad.buttons || [];
    const axes = pad.axes || [];
    const btn = (n) => !!(buttons[n] && buttons[n].pressed);

    if (btn(12)) return [0, -1];
    if (btn(13)) return [0, 1];
    if (btn(14)) return [-1, 0];
    if (btn(15)) return [1, 0];

    // Fallback low-index D-pad mapping seen on some non-standard USB joysticks.
    if (btn(0) && !btn(1) && !btn(2) && !btn(3)) return [0, -1];
    if (btn(1) && !btn(0) && !btn(2) && !btn(3)) return [0, 1];
    if (btn(2) && !btn(0) && !btn(1) && !btn(3)) return [-1, 0];
    if (btn(3) && !btn(0) && !btn(1) && !btn(2)) return [1, 0];

    for (let a = 0; a + 1 < axes.length; a += 2) {
        const axX = axes[a] || 0;
        const axY = axes[a + 1] || 0;
        if (axY < -GAMEPAD_DEADZONE) return [0, -1];
        if (axY > GAMEPAD_DEADZONE) return [0, 1];
        if (axX < -GAMEPAD_DEADZONE) return [-1, 0];
        if (axX > GAMEPAD_DEADZONE) return [1, 0];
    }

    return null;
}

// Start toggles pause/resume. Standard mapping puts Start at index 9; cheap
// joysticks without a "standard" mapping may place it at 8 or 10 instead.
function isStartPressed(pad) {
    const buttons = pad.buttons || [];
    return [9, 8, 10].some(n => !!(buttons[n] && buttons[n].pressed));
}

function logGamepadDiagnostics(pad, index) {
    const now = performance.now();
    const pressed = pad.buttons.map((b, i) => (b.pressed ? i : null)).filter(v => v !== null);
    const axesActive = pad.axes.some(v => Math.abs(v) > 0.15);
    if (pressed.length === 0 && !axesActive) return;
    if (now - (gamepadLastDiagLog[index] || 0) < 500) return; // throttle to twice/sec while active
    gamepadLastDiagLog[index] = now;
    console.log(`[gamepad ${index}] "${pad.id}" pressed buttons: [${pressed.join(', ')}] axes: [${pad.axes.map(v => v.toFixed(2)).join(', ')}]`);
}

function pollGamepads() {
    const assigned = getConnectedGamepads().slice(0, 2);

    // Announce (once per assignment change) which physical pad drives which
    // player -- also logged so users can verify their joystick was detected.
    const signature = assigned.map(p => `${p.index}:${p.id}`).join('|');
    if (signature !== gamepadAssignmentMsg) {
        gamepadAssignmentMsg = signature;
        assigned.forEach((pad, slot) => {
            console.log(`Joystick ${slot + 1} assigned to Player ${slot + 1}: "${pad.id}" (browser index ${pad.index})`);
        });
        if (assigned.length > 0 && GameState.isPlaying) {
            showToast('♥', 'Joystick Assigned',
                assigned.map((p, i) => `P${i + 1}: ${p.id}`).join('  ·  '));
        }
    }

    assigned.forEach((pad, slot) => {
        logGamepadDiagnostics(pad, slot);

        const startPressed = isStartPressed(pad);
        const prevKey = `pad${pad.index}`;
        if (startPressed && !gamepadPrevStart[prevKey]) {
            if (GameState.isPlaying && !GameState.isPaused) pauseGame();
            else if (GameState.isPaused) resumeGame();
        }
        gamepadPrevStart[prevKey] = startPressed;

        if (!GameState.isPlaying || GameState.isPaused) return;
        const playerNum = slot + 1;
        if (playerNum === 2 && !GameState.multiplayer) return;

        const dir = getGamepadDirection(pad);
        if (dir) handleDirectionInput(dir[0], dir[1], playerNum);
    });
}

window.addEventListener('gamepadconnected', (e) => {
    const g = e.gamepad;
    console.log(`Gamepad connected at index ${g.index}: "${g.id}" — mapping: "${g.mapping}", ${g.axes.length} axes, ${g.buttons.length} buttons.`);
    showToast('●', 'Controller Connected', g.id);
});

window.addEventListener('gamepaddisconnected', (e) => {
    console.log(`Gamepad disconnected at index ${e.gamepad.index}: "${e.gamepad.id}"`);
});

// Runs independently of the game loop so a plugged-in controller shows up in the
// console (and via the connected toast) immediately from any screen, including
// the main menu -- useful for confirming the browser actually sees the device
// before ever starting a game. Skips work while a game is active since
// pollGamepads() already covers diagnostics there.
function diagnosticGamepadLoop() {
    if (!GameState.isPlaying) {
        getConnectedGamepads().forEach((pad, slot) => logGamepadDiagnostics(pad, slot));
    }
    requestAnimationFrame(diagnosticGamepadLoop);
}
requestAnimationFrame(diagnosticGamepadLoop);

function gameLoop(ts) {
    const dt = GameState.lastFrameTime ? ts - GameState.lastFrameTime : 16;
    GameState.lastFrameTime = ts;

    pollGamepads();

    if (GameState.isPlaying && !GameState.isPaused) {
        updateShake(dt);
        updateParticles(dt);
        drawGame(ts);
    }

    GameState.rafId = requestAnimationFrame(gameLoop);
}

// --- Drawing ---
function drawGame(ts = performance.now()) {
    if (!ctx) return;

    const cs = GameState.cellSize;
    const maze = GameState.maze;

    ctx.imageSmoothingEnabled = false; // crisp pixels, always

    // Clear at full extent first so screen shake never reveals gaps at the edges
    ctx.fillStyle = C64.black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(GameState.shake.x, GameState.shake.y);

    // Maze walls as chunky solid blocks straddling the cell edges, PETSCII-maze
    // style. Each wall rect overshoots its ends by half a thickness so adjoining
    // walls always join into solid corners.
    const t = Math.max(3, Math.round(cs * 0.22));
    const half = t / 2;
    ctx.fillStyle = C64.lightBlue;
    for (let y = 0; y < GameState.mazeHeight; y++) {
        for (let x = 0; x < GameState.mazeWidth; x++) {
            const cell = maze[y][x];
            const px = x * cs;
            const py = y * cs;

            if (cell.top)    ctx.fillRect(px - half, py - half, cs + t, t);
            if (cell.bottom) ctx.fillRect(px - half, py + cs - half, cs + t, t);
            if (cell.left)   ctx.fillRect(px - half, py - half, t, cs + t);
            if (cell.right)  ctx.fillRect(px + cs - half, py - half, t, cs + t);
        }
    }

    // Draw cheese path hint for Haw
    if (GameState.selectedCharacter === 'haw') {
        drawCheesePath(GameState.player, 1);
    }
    if (GameState.multiplayer && GameState.selectedCharacter2 === 'haw') {
        drawCheesePath(GameState.player2, 2);
    }

    drawPowerup(ts);
    drawCheese();

    GameState.enemies.forEach(enemy => drawEnemy(enemy, ts));

    // Draw players
    drawPlayer(GameState.player, GameState.selectedCharacter, 1);
    if (GameState.multiplayer) {
        drawPlayer(GameState.player2, GameState.selectedCharacter2, 2);
    }

    drawParticles();

    ctx.restore();
}

function drawCheese() {
    const cs = GameState.cellSize;
    const cx = GameState.cheese.x * cs + cs / 2;
    const cy = GameState.cheese.y * cs + cs / 2;
    const size = cs * 0.42;

    const golden = GameState.cheese.type === 'golden';
    ctx.fillStyle = golden ? C64.white : C64.yellow;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(cx - size, cy - size, size * 2, size * 2);
    ctx.globalAlpha = 1;

    const sprite = getSprite('cheese', golden ? 'cheese-golden' : 'cheese');
    if (GameState.cheese.type === 'double') {
        // Double cheese: two overlapping wedges
        const s = size * 1.4;
        ctx.drawImage(sprite, cx - s, cy - s * 0.55, s * 1.6, s * 1.6);
        ctx.drawImage(sprite, cx - s * 0.35, cy - s * 0.55, s * 1.6, s * 1.6);
    } else {
        ctx.drawImage(sprite, cx - size, cy - size, size * 2, size * 2);
    }

    // Golden cheese sparkles
    if (golden && Math.floor(performance.now() / 200) % 2 === 0) {
        ctx.fillStyle = C64.white;
        ctx.fillRect(cx - size - 3, cy - size - 3, 4, 4);
        ctx.fillRect(cx + size - 1, cy + size - 1, 4, 4);
    }
}

function drawPlayer(player, characterKey, playerNum) {
    const cs = GameState.cellSize;
    const px = player.x * cs + cs / 2;
    const py = player.y * cs + cs / 2;
    const size = cs * 0.42;
    const playerColor = PLAYER_COLORS[playerNum];

    // Dim (never fully hide) while briefly invulnerable after a hit, so a single
    // frame/screenshot never reads as "the player vanished".
    const invulnerable = Date.now() < player.invulnerableUntil;
    const flickerAlpha = invulnerable && Math.floor(Date.now() / 100) % 2 === 0 ? 0.35 : 1;

    // Backing plate in the player's identity color (cyan P1 / red P2)
    ctx.globalAlpha = flickerAlpha * 0.35;
    ctx.fillStyle = playerColor;
    ctx.fillRect(px - size, py - size, size * 2, size * 2);

    ctx.globalAlpha = flickerAlpha;
    const sprite = CHARACTER_SPRITES[characterKey];
    if (sprite) {
        ctx.drawImage(getSprite(sprite.def, sprite.palette), px - size, py - size, size * 2, size * 2);
    }

    // "P1"/"P2" label above the sprite so both players are identifiable at a glance
    const label = `P${playerNum}`;
    const fontSize = Math.max(10, Math.round(cs * 0.32));
    ctx.font = `${fontSize}px C64, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const labelY = py - size - 2;
    ctx.fillStyle = C64.black;
    ctx.fillText(label, px + 2, labelY + 2);
    ctx.fillStyle = playerColor;
    ctx.fillText(label, px, labelY);

    ctx.globalAlpha = 1;
}

function drawCheesePath(player, playerNum = 1) {
    // Simple path visualization for Haw's ability, tinted in the player's color
    const cs = GameState.cellSize;
    const startX = player.x * cs + cs / 2;
    const startY = player.y * cs + cs / 2;
    const endX = GameState.cheese.x * cs + cs / 2;
    const endY = GameState.cheese.y * cs + cs / 2;

    ctx.strokeStyle = PLAYER_COLORS[playerNum];
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
}

// --- Player Movement ---
const MOVE_COOLDOWN = 150; // ms between steps for normal characters
const SCURRY_MOVE_COOLDOWN = 75; // Scurry moves one cell at a time too, just twice as often

function movePlayer(player, dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;

    // Must stay within maze bounds
    if (nx < 0 || nx >= GameState.mazeWidth || ny < 0 || ny >= GameState.mazeHeight) return false;

    // Check wall between current cell and next cell
    const currentCell = GameState.maze[player.y][player.x];
    let blocked = false;
    if (dy === -1 && currentCell.top) blocked = true;
    if (dy ===  1 && currentCell.bottom) blocked = true;
    if (dx ===  1 && currentCell.right) blocked = true;
    if (dx === -1 && currentCell.left) blocked = true;

    if (blocked) return false; // Wall ahead

    player.x = nx;
    player.y = ny;
    return true;
}

function handleDirectionInput(dx, dy, playerNum = 1) {
    if (!GameState.isPlaying || GameState.isPaused) return;

    const player = playerNum === 2 ? GameState.player2 : GameState.player;
    const characterKey = playerNum === 2 ? GameState.selectedCharacter2 : GameState.selectedCharacter;
    const char = GameState.characters[characterKey];

    const cooldown = char.abilityClass === 'scurry' ? SCURRY_MOVE_COOLDOWN : MOVE_COOLDOWN;
    const now = performance.now();
    if (now - player.lastMoveTs < cooldown) return;

    const moved = movePlayer(player, dx, dy);

    if (moved) {
        player.lastMoveTs = now;
        checkCheeseCollision();
        checkPowerupCollision();
        checkEnemyCollisions();
    }
}

document.addEventListener('keydown', (e) => {
    if (!GameState.isPlaying) return;

    if (e.key === ' ') {
        e.preventDefault();
        if (GameState.isPaused) resumeGame();
        else pauseGame();
        return;
    }

    // Keep arrow keys from scrolling the page/modals during play
    if (e.key.startsWith('Arrow')) e.preventDefault();
    if (GameState.isPaused) return;

    if (GameState.multiplayer) {
        switch (e.key) {
            case 'ArrowUp':    handleDirectionInput(0, -1, 1); return;
            case 'ArrowRight': handleDirectionInput(1, 0, 1); return;
            case 'ArrowDown':  handleDirectionInput(0, 1, 1); return;
            case 'ArrowLeft':  handleDirectionInput(-1, 0, 1); return;
            case 'w': case 'W': handleDirectionInput(0, -1, 2); return;
            case 'd': case 'D': handleDirectionInput(1, 0, 2); return;
            case 's': case 'S': handleDirectionInput(0, 1, 2); return;
            case 'a': case 'A': handleDirectionInput(-1, 0, 2); return;
        }
    } else {
        switch (e.key) {
            case 'ArrowUp': case 'w': case 'W': handleDirectionInput(0, -1, 1); return;
            case 'ArrowRight': case 'd': case 'D': handleDirectionInput(1, 0, 1); return;
            case 'ArrowDown': case 's': case 'S': handleDirectionInput(0, 1, 1); return;
            case 'ArrowLeft': case 'a': case 'A': handleDirectionInput(-1, 0, 1); return;
        }
    }
});

// --- Touch Controls ---
document.addEventListener('DOMContentLoaded', () => {
    const dpad = document.getElementById('touch-dpad');
    if (dpad) {
        dpad.querySelectorAll('.dpad-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const [dx, dy] = DIR_VECTORS[btn.dataset.dir];
                handleDirectionInput(dx, dy, 1);
            }, { passive: false });
            btn.addEventListener('click', () => {
                const [dx, dy] = DIR_VECTORS[btn.dataset.dir];
                handleDirectionInput(dx, dy, 1);
            });
        });
    }

    const mazeWrapper = document.querySelector('.maze-wrapper');
    if (mazeWrapper) {
        let touchStartX = 0, touchStartY = 0;
        mazeWrapper.addEventListener('touchstart', (e) => {
            const t = e.changedTouches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
        }, { passive: true });
        mazeWrapper.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStartX;
            const dy = t.clientY - touchStartY;
            if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                handleDirectionInput(dx > 0 ? 1 : -1, 0, 1);
            } else {
                handleDirectionInput(0, dy > 0 ? 1 : -1, 1);
            }
        }, { passive: true });
    }
});

// --- Cheese Collision ---
function checkCheeseCollision() {
    if (GameState.player.x === GameState.cheese.x && GameState.player.y === GameState.cheese.y) {
        collectCheese(1);
        return;
    }
    if (GameState.multiplayer && GameState.player2.x === GameState.cheese.x && GameState.player2.y === GameState.cheese.y) {
        collectCheese(2);
    }
}

function collectCheese(playerNum = 1) {
    let points = 0;
    switch (GameState.cheese.type) {
        case 'golden': points = 50; break;
        case 'double': points = 25; break;
        default: points = 10;
    }

    // Speed bonus for easy/medium
    if (GameState.timeLeft > 30) {
        points = Math.floor(points * 1.2);
    }

    // Combo streak: consecutive collections within an 8s window scale the bonus, capped at +100%
    const now = Date.now();
    if (now - GameState.combo.lastCollectTs <= 8000) {
        GameState.combo.count++;
    } else {
        GameState.combo.count = 1;
    }
    GameState.combo.lastCollectTs = now;
    const comboMultiplier = Math.min(1 + (GameState.combo.count - 1) * 0.1, 2.0);
    points = Math.floor(points * comboMultiplier);

    if (GameState.cheese.type === 'golden') unlockAchievement('golden-goal');
    if (GameState.combo.count >= 5) unlockAchievement('combo-master');

    if (playerNum === 2) {
        GameState.score2 += points;
    } else {
        GameState.score += points;
    }
    GameState.cheeseCollected++;

    if (GameState.cheeseCollected === 1) unlockAchievement('first-cheese');
    if (GameState.score >= 100) unlockAchievement('century-score');

    SoundEngine.play(GameState.cheese.type === 'golden' ? 'collect-golden' : 'collect');
    spawnParticles(GameState.cheese.x, GameState.cheese.y, C64.yellow, GameState.cheese.type === 'golden' ? 18 : 10);

    // Level up every 5 cheese
    if (GameState.cheeseCollected % 5 === 0) {
        GameState.level++;
        addTime();
        updateMazeSize();
        pickSpawnCorners();
        GameState.maze = generateMaze(GameState.mazeWidth, GameState.mazeHeight, GameState.player.spawnX, GameState.player.spawnY);
        braidMaze(GameState.maze, GameState.mazeWidth, GameState.mazeHeight, 0.12);
        spawnEnemies();
        setupCanvas(); // the maze grid grows with level; the canvas element must grow to match or its new edge cells render off-canvas
        SoundEngine.play('level-up');
        spawnParticles(GameState.player.x, GameState.player.y, C64.lightGreen, 20);
        if (GameState.level >= 5) unlockAchievement('level-5-survivor');
    }

    // Play collect animation
    showFloatingText(`+${points}`, GameState.cheese.x, GameState.cheese.y);

    updateUI();
    updateQuote();
    placeCheese();
    trySpawnPowerup();

    // Restart cheese movement timer
    startCheeseMovement();
}

function addTime() {
    GameState.timeLeft += 15;
}

function showFloatingText(text, x, y) {
    const cs = GameState.cellSize;
    // Position relative to the canvas (which is centered in the wrapper), not
    // the wrapper itself -- cell coordinates are canvas-relative.
    const wrapper = document.querySelector('.maze-wrapper');
    if (!wrapper) return;
    const canvasRect = canvas.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const px = canvasRect.left - wrapperRect.left + x * cs + cs / 2;
    const py = canvasRect.top - wrapperRect.top + y * cs + cs / 2;

    const el = document.createElement('div');
    el.textContent = text;
    el.className = 'float-text';
    el.style.left = `${px}px`;
    el.style.top = `${py}px`;

    wrapper.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

// --- UI Updates ---
function updateUI() {
    document.getElementById('score').textContent = GameState.score;
    document.getElementById('timer').textContent = GameState.timeLeft;
    document.getElementById('level').textContent = GameState.level;
    document.getElementById('lives').textContent = GameState.lives;
    if (GameState.multiplayer) {
        document.getElementById('score2').textContent = GameState.score2;
    }

    const shieldBadge = document.getElementById('shield-badge');
    if (shieldBadge) {
        const p1Shield = GameState.powerups.shieldCharges > 0;
        const p2Shield = GameState.multiplayer && GameState.powerups.shieldCharges2 > 0;
        const holders = [];
        if (p1Shield) holders.push('P1');
        if (p2Shield) holders.push('P2');
        shieldBadge.style.display = holders.length > 0 ? '' : 'none';
        shieldBadge.textContent = holders.length > 0 ? `[Shield: ${holders.join('+')}]` : '';
    }

    updateComboBadge();
}

function updateComboBadge() {
    const badge = document.getElementById('combo-badge');
    if (!badge) return;
    if (GameState.combo.count >= 2) {
        badge.style.display = '';
        badge.textContent = `Combo x${GameState.combo.count}`;
    } else {
        badge.style.display = 'none';
    }
}

// Reads a quote aloud at most once per game session, even if it gets picked
// again later -- the displayed text can still repeat, just not the narration.
function speakOnce(quote) {
    if (GameState.spokenQuotes.has(quote)) return;
    GameState.spokenQuotes.add(quote);
    SoundEngine.speak(quote);
}

function updateQuote() {
    const quoteEl = document.getElementById('maze-quote');
    if (quoteEl) {
        const quote = GameState.quotes[Math.floor(Math.random() * GameState.quotes.length)];
        quoteEl.textContent = `"${quote}"`;
        quoteEl.title = quote; // full text on hover (panel is single-line + ellipsis)
        speakOnce(quote);
    }
}

// --- Game Control ---
function pauseGame() {
    if (!GameState.isPlaying) return;
    GameState.isPaused = true;
    GameState.pausedAt = performance.now();
    showScreen('pause-screen');
}

function resumeGame() {
    // Shift scheduled cheese events by the paused duration so the warning/move
    // countdown continues where it left off instead of firing while paused.
    const pausedFor = performance.now() - GameState.pausedAt;
    GameState.cheeseMoveAt += pausedFor;
    GameState.cheeseWarnAt += pausedFor;
    GameState.isPaused = false;
    showScreen('game-screen');
}

function restartGame() {
    stopGame();
    showCharacterSelect();
}

function stopGame() {
    GameState.isPlaying = false;
    clearInterval(GameState.gameTimer);
    clearInterval(GameState.cheeseMoveInterval);
    clearInterval(GameState.enemyMoveInterval);
    cancelAnimationFrame(GameState.rafId);
}

function showResultQuote() {
    const quote = GameState.resultQuotes[Math.floor(Math.random() * GameState.resultQuotes.length)];
    document.getElementById('result-quote').textContent = `"${quote}"`;
    speakOnce(quote);
}

function endGame(reason = 'timeup') {
    stopGame();
    SoundEngine.play('game-over');

    const cheeseImg = `<img src="${spriteDataURL('cheese', 'cheese', 8)}" alt="Cheese">`;

    if (GameState.multiplayer) {
        const p1 = GameState.score, p2 = GameState.score2;
        const tied = p1 === p2;
        const winnerKey = p1 > p2 ? GameState.selectedCharacter : GameState.selectedCharacter2;
        const winnerSprite = CHARACTER_SPRITES[winnerKey];
        const winnerImg = `<img src="${spriteDataURL(winnerSprite.def, winnerSprite.palette, 8)}" alt="Winner">`;

        document.getElementById('result-icon').innerHTML = tied ? cheeseImg + cheeseImg : winnerImg + cheeseImg;
        document.getElementById('result-title').textContent =
            p1 > p2 ? 'Player 1 Wins!' : p2 > p1 ? 'Player 2 Wins!' : "It's a Tie!";
        showResultQuote();

        document.getElementById('final-score').textContent = `${p1} - ${p2}`;
        document.getElementById('final-level').textContent = GameState.level;
        document.getElementById('final-cheese').textContent = GameState.cheeseCollected;

        showScreen('game-over-screen');
        return;
    }

    const maxLives = GameState.selectedCharacter === 'hem' ? 4 : 3;
    if (reason === 'timeup' && GameState.lives === maxLives && GameState.cheeseCollected >= 5) {
        unlockAchievement('no-hit-clear');
    }

    const defeated = reason === 'defeated';
    const won = !defeated && GameState.score >= 50;

    const wolfImg = `<img src="${spriteDataURL('wolf', 'guardian', 8)}" alt="Enemy">`;
    document.getElementById('result-icon').innerHTML = defeated ? wolfImg : (won ? cheeseImg + cheeseImg : cheeseImg);
    document.getElementById('result-title').textContent = defeated ? 'The Cheese Got You!' : (won ? 'Cheese Master!' : 'Time\'s Up!');
    showResultQuote();

    document.getElementById('final-score').textContent = GameState.score;
    document.getElementById('final-level').textContent = GameState.level;
    document.getElementById('final-cheese').textContent = GameState.cheeseCollected;

    showScreen('game-over-screen');

    // Show name entry
    setTimeout(() => {
        document.getElementById('name-modal').classList.add('active');
    }, 1000);
}

// --- Leaderboard ---
function switchLeaderboardTab(difficulty) {
    GameState.difficulty = difficulty;

    // Update tab styles (find the tab by its data attribute -- relying on a
    // global `event` breaks when called programmatically and in Firefox)
    document.querySelectorAll('.leaderboard-tabs .tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.difficulty === difficulty);
    });

    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';

    const entries = GameState.leaderboard[difficulty] || [];

    if (entries.length === 0) {
        list.innerHTML = '<p style="text-align: center; padding: 2rem;">No scores yet. Be the first!</p>';
        return;
    }

    entries.slice(0, 10).forEach((entry, index) => {
        const el = document.createElement('div');
        el.className = 'leaderboard-entry';
        el.innerHTML = `
            <span class="entry-rank">${index + 1}.</span>
            <span class="entry-name">${entry.name}</span>
            <span class="entry-score">${entry.score}</span>
        `;
        list.appendChild(el);
    });
}

function saveScore() {
    const name = document.getElementById('player-name').value.trim() || 'Anonymous';

    if (!GameState.leaderboard[GameState.difficulty]) {
        GameState.leaderboard[GameState.difficulty] = [];
    }

    GameState.leaderboard[GameState.difficulty].push({
        name: name,
        score: GameState.score,
        level: GameState.level,
        date: new Date().toISOString()
    });

    // Sort and keep top 10
    GameState.leaderboard[GameState.difficulty].sort((a, b) => b.score - a.score);
    GameState.leaderboard[GameState.difficulty] = GameState.leaderboard[GameState.difficulty].slice(0, 10);

    // Save to localStorage
    localStorage.setItem(`cheese_leaderboard_${GameState.difficulty}`, JSON.stringify(GameState.leaderboard[GameState.difficulty]));

    closeModal('name-modal');
    showLeaderboard();
}

// --- Achievements ---
function loadCharsPlayed() {
    try {
        return new Set(JSON.parse(localStorage.getItem('cheese_achievements_chars_played') || '[]'));
    } catch {
        return new Set();
    }
}

function recordCharacterPlayed(key) {
    const charsPlayed = loadCharsPlayed();
    charsPlayed.add(key);
    localStorage.setItem('cheese_achievements_chars_played', JSON.stringify([...charsPlayed]));
    if (charsPlayed.size >= 4) unlockAchievement('roster-complete');
}

function unlockAchievement(id) {
    if (GameState.achievements.unlocked[id]) return;

    GameState.achievements.unlocked[id] = new Date().toISOString();
    localStorage.setItem('cheese_achievements', JSON.stringify(GameState.achievements.unlocked));

    SoundEngine.play('achievement');
    const def = ACHIEVEMENTS.find(a => a.id === id);
    if (def) showAchievementToast(def);

    if (GameState.isPlaying) {
        spawnParticles(GameState.player.x, GameState.player.y, C64.yellow, 16);
    }

    const modal = document.getElementById('achievements-modal');
    if (modal && modal.classList.contains('active')) {
        populateAchievementsGrid();
    }
}

function showToast(icon, title, message) {
    const el = document.createElement('div');
    el.className = 'achievement-toast';
    el.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <div>
            <div class="toast-title">${title}</div>
            <div class="toast-name">${message}</div>
        </div>
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

function showAchievementToast(def) {
    showToast(def.icon, 'Achievement Unlocked!', def.name);
}

function populateAchievementsGrid() {
    const grid = document.getElementById('achievements-grid');
    if (!grid) return;
    grid.innerHTML = '';

    ACHIEVEMENTS.forEach(a => {
        const unlocked = !!GameState.achievements.unlocked[a.id];
        const card = document.createElement('div');
        card.className = 'achievement-card' + (unlocked ? ' unlocked' : ' locked');
        card.innerHTML = `
            <div class="achievement-icon">${unlocked ? a.icon : '░'}</div>
            <div class="achievement-name">${a.name}</div>
            <div class="achievement-desc">${a.description}</div>
        `;
        grid.appendChild(card);
    });
}

// --- Loading Screen: authentic C64 BASIC boot sequence ---
const BOOT_LINES = [
    '',
    '    **** COMMODORE 64 BASIC V2 ****',
    '',
    ' 64K RAM SYSTEM  38911 BASIC BYTES FREE',
    '',
    'READY.',
    'LOAD"CHEESE",8,1',
    '',
    'SEARCHING FOR CHEESE',
    'LOADING',
    '',
    'READY.',
    'RUN',
    ''
];

function runBootSequence() {
    const log = document.getElementById('boot-log');
    if (!log) { showScreen('main-menu'); populateMenuCharacters(); return; }

    const cursor = document.createElement('span');
    cursor.className = 'boot-cursor';
    cursor.textContent = '█';
    log.appendChild(cursor);

    let lineIndex = 0;
    let finished = false;

    const finish = () => {
        if (finished) return;
        finished = true;
        document.removeEventListener('keydown', skip);
        showScreen('main-menu');
        populateMenuCharacters();
    };
    const skip = () => finish();

    // Click or any key jumps straight to the menu
    document.getElementById('boot-panel').addEventListener('click', skip);
    document.addEventListener('keydown', skip);

    const typeNext = () => {
        if (finished) return;
        if (lineIndex >= BOOT_LINES.length) {
            setTimeout(finish, 500);
            return;
        }
        const line = BOOT_LINES[lineIndex];
        log.insertBefore(document.createTextNode((lineIndex > 0 ? '\n' : '') + line), cursor);
        lineIndex++;
        // Disk-access lines linger a little, like a real 1541 drive would
        const delay = (line === 'LOADING' || line.startsWith('SEARCHING')) ? 550 : 170;
        setTimeout(typeNext, delay);
    };
    typeNext();
}

// Fill static sprite slots (logo, difficulty icons) once the DOM exists
function populateStaticSprites() {
    const logo = document.getElementById('logo-cheese');
    if (logo) logo.src = spriteDataURL('cheese', 'cheese', 8);
    const easy = document.getElementById('diff-icon-easy');
    if (easy) easy.src = spriteDataURL('mouse', 'mouse-green');
    const medium = document.getElementById('diff-icon-medium');
    if (medium) medium.src = spriteDataURL('mouse', 'mouse-yellow');
    const hard = document.getElementById('diff-icon-hard');
    if (hard) hard.src = spriteDataURL('mouse', 'mouse-red');
}

window.addEventListener('load', () => {
    populateStaticSprites();
    setTimeout(runBootSequence, 250);
});

// --- Window Resize Handler ---
window.addEventListener('resize', () => {
    if (!GameState.isPlaying) return;
    setupCanvas();
    // The rAF loop skips repaints while paused, so this is the sole manual draw() call outside gameLoop.
    if (GameState.isPaused) drawGame();
});
