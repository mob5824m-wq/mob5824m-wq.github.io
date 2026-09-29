(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const WORLD_SIZE = 42;
  const MAX_HEALTH = 5;
  const FIELD_OF_VIEW = 68 * Math.PI / 180;
  const CAMERA_HEIGHT = 0.68;
  const RECORD_KEY = 'cubeclash-highscores-v1';
  const SOUND_KEY = 'cubeclash-sound-v1';
  const BLOCKS = [
    { id: 'dirt', name: 'Dirt', top: '#a9784e', left: '#805333', right: '#68432d', accent: '#c8915b' },
    { id: 'stone', name: 'Stone', top: '#a6aaa0', left: '#737c73', right: '#555f58', accent: '#c8cdc2' },
    { id: 'wood', name: 'Wood', top: '#cf9a55', left: '#986537', right: '#744a2d', accent: '#e5b76d' },
    { id: 'sand', name: 'Sand', top: '#e4cc78', left: '#ad9250', right: '#88723f', accent: '#f4df97' },
    { id: 'brick', name: 'Brick', top: '#d67c64', left: '#a64f49', right: '#793d3b', accent: '#f19b78' },
    { id: 'crystal', name: 'Crystal', top: '#95f3e4', left: '#3eb6b3', right: '#287f8d', accent: '#d0fff0' },
    { id: 'grass', name: 'Grass', top: '#84bf55', left: '#5b8e43', right: '#46713e', accent: '#b3de6a' },
    { id: 'planks', name: 'Planks', top: '#dbad6c', left: '#ad7c48', right: '#815937', accent: '#efd08a' },
    { id: 'leaves', name: 'Leaves', top: '#83c957', left: '#579847', right: '#3c783f', accent: '#a1e36a' }
  ];
  const BLOCK_BY_ID = Object.fromEntries(BLOCKS.map(block => [block.id, block]));
  const GEAR = [
    { id: 'wood_sword', name: 'Wooden Sword', slot: 'weapon', slotName: 'Weapon', glyph: '⚔', damage: 1.25, reach: 3.25, tint: '#d8a15d', recipe: { wood: 2, planks: 1 }, description: 'A sturdy starter blade.' },
    { id: 'stone_sword', name: 'Stone Sword', slot: 'weapon', slotName: 'Weapon', glyph: '⚔', damage: 1.55, reach: 3.5, tint: '#c1c6bc', recipe: { stone: 3, planks: 1 }, description: 'Hits harder and reaches farther.' },
    { id: 'crystal_blade', name: 'Crystal Blade', slot: 'weapon', slotName: 'Weapon', glyph: '✦', damage: 2.2, reach: 3.8, tint: '#94fff0', recipe: { crystal: 2, brick: 1 }, description: 'A bright blade that can fell a slime in one hit.' },
    { id: 'leaf_hood', name: 'Leaf Hood', slot: 'head', slotName: 'Head', glyph: '⌑', protection: 0.06, tint: '#a9e968', recipe: { leaves: 2, wood: 1 }, description: 'Soft leaves absorb a little damage.' },
    { id: 'bark_vest', name: 'Bark Vest', slot: 'chest', slotName: 'Chest', glyph: '▥', protection: 0.14, tint: '#d3a165', recipe: { leaves: 4, wood: 2 }, description: 'A layered vest of bark and leaves.' },
    { id: 'leaf_greaves', name: 'Leaf Greaves', slot: 'legs', slotName: 'Legs', glyph: '▥', protection: 0.10, tint: '#9ed95b', recipe: { leaves: 3, planks: 2 }, description: 'Light leg armor made from tough foliage.' },
    { id: 'bark_boots', name: 'Bark Boots', slot: 'feet', slotName: 'Feet', glyph: '⌑', protection: 0.07, tint: '#c18b52', recipe: { leaves: 2, planks: 1 }, description: 'Reinforced boots soften slime attacks.' }
  ];
  const GEAR_BY_ID = Object.fromEntries(GEAR.map(item => [item.id, item]));
  const GEAR_SLOTS = [
    { id: 'weapon', name: 'Weapon' }, { id: 'head', name: 'Head' }, { id: 'chest', name: 'Chest' },
    { id: 'legs', name: 'Legs' }, { id: 'feet', name: 'Feet' }
  ];
  const canvas = $('#world-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const stage = $('#game-stage');
  const gameHud = $('#game-hud');
  const startScreen = $('#start-screen');
  const pauseScreen = $('#pause-screen');
  const gameoverScreen = $('#gameover-screen');
  const hotbar = $('#hotbar');
  const inventoryScreen = $('#inventory-screen');
  const inventoryButton = $('#inventory-button');
  const inventoryCloseButton = $('#inventory-close');
  const inventoryItemsEl = $('#inventory-items');
  const craftingListEl = $('#crafting-list');
  const equipmentSlotsEl = $('#equipment-slots');
  const armorRatingEl = $('#armor-rating');
  const heartsEl = $('#hearts');
  const toastEl = $('#toast');
  const soundButton = $('#sound-toggle');
  const lookButton = $('#look-toggle');
  const attackButton = $('#attack-button');
  const headerMode = $('#header-mode');
  const headerBest = $('#header-best');
  const scoreEl = $('#hud-score');
  const scoreBestEl = $('#hud-best');
  const worldClockEl = $('#world-clock');
  const flightStatus = $('#flight-status');

  let ratio = 1;
  let width = 1;
  let height = 1;
  let tileW = 30;
  let tileH = 16;
  let blockH = 13;
  let state = 'menu';
  let mode = 'survival';
  let world = [];
  let sortedCells = [];
  let player;
  let mobs = [];
  let particles = [];
  let floaters = [];
  let inventory = {};
  let gearInventory = {};
  let equipment = { weapon: null, head: null, chest: null, legs: null, feet: null };
  let inventoryOpen = false;
  let selectedBlock = 0;
  let camera = { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
  let worldSeed = Math.random() * 100000;
  let mouse = { x: 0, y: 0, inCanvas: false, type: 'mouse', touchTarget: null, dragging: false, lastX: 0, lastY: 0 };
  let keys = new Set();
  let touchDirections = new Map();
  let touchActions = new Map();
  let touchRepeat = 0;
  let screenShake = 0;
  let toastTimer = 0;
  let uiTimer = 0;
  let lastFrame = 0;
  let lastUi = 0;
  let lastAttackAt = 0;
  let lastMineAt = 0;
  let lastBuildAt = 0;
  let lastSpaceTap = -Infinity;
  let spawnTimer = 0;
  let audioContext = null;
  let soundEnabled = readSoundSetting();
  let currentSession = null;

  function readSoundSetting() {
    try { return localStorage.getItem(SOUND_KEY) !== 'off'; } catch (_) { return true; }
  }

  function hash(x, y, salt = 0) {
    const v = Math.sin((x + worldSeed * 0.017) * 127.1 + (y - worldSeed * 0.009) * 311.7 + salt * 74.7) * 43758.5453123;
    return v - Math.floor(v);
  }

  function cellAt(x, y) {
    const cx = Math.floor(x);
    const cy = Math.floor(y);
    if (cx < 0 || cy < 0 || cx >= WORLD_SIZE || cy >= WORLD_SIZE) return null;
    return world[cy] && world[cy][cx] || null;
  }

  function cellXY(x, y) {
    if (x < 0 || y < 0 || x >= WORLD_SIZE || y >= WORLD_SIZE) return null;
    return world[y] && world[y][x] || null;
  }

  function generateWorld(seed = Math.random() * 100000) {
    worldSeed = seed;
    world = [];
    sortedCells = [];
    const center = WORLD_SIZE / 2;

    for (let y = 0; y < WORLD_SIZE; y++) {
      const row = [];
      for (let x = 0; x < WORLD_SIZE; x++) {
        const dx = (x + 0.5 - center) / 1.02;
        const dy = (y + 0.5 - center) / 0.96;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const hill = (Math.sin(x * 0.31) + Math.cos(y * 0.28) + Math.sin((x + y) * 0.19) + Math.cos((x - y) * 0.17)) / 4;
        const water = distance > 19.1 || x < 1 || y < 1 || x >= WORLD_SIZE - 1 || y >= WORLD_SIZE - 1;
        let type = 'grass';
        let elevation = Math.max(0, Math.min(2, 1 + Math.round(hill * 0.8)));
        if (water) {
          type = 'water';
          elevation = 0;
        } else if (distance > 16.5 || (distance > 14.5 && hash(x, y, 12) > 0.82)) {
          type = 'sand';
          elevation = distance > 18 ? 0 : Math.min(1, elevation);
        } else if (hash(x, y, 7) > 0.945) {
          type = 'stoneground';
        } else if (hash(x, y, 8) > 0.91) {
          type = 'dirtground';
        }
        const cell = {
          x, y, type, elevation, water, prop: null, blocks: [],
          harvested: false, pop: 0,
          decoration: !water && type === 'grass' && hash(x, y, 21) > 0.83 ? hash(x, y, 23) : 0,
          floorVariation: Math.floor(hash(x, y, 39) * 3),
          waterGlint: hash(x, y, 44) > 0.91
        };
        row.push(cell);
        sortedCells.push(cell);
      }
      world.push(row);
    }

    // Hand-placed starters make the first few seconds readable and rewarding.
    const c = Math.floor(center);
    const placeProp = (x, y, kind) => {
      const cell = cellXY(x, y);
      if (!cell || cell.water || cell.prop) return;
      cell.prop = { kind, hp: kind === 'tree' ? 3 : kind === 'crystal' ? 2 : 2, maxHp: kind === 'tree' ? 3 : kind === 'crystal' ? 2 : 2, flash: 0 };
    };
    placeProp(c + 4, c + 1, 'tree');
    placeProp(c - 4, c - 2, 'tree');
    placeProp(c - 2, c + 3, 'rock');
    placeProp(c + 2, c - 5, 'crystal');

    for (let y = 2; y < WORLD_SIZE - 2; y++) {
      for (let x = 2; x < WORLD_SIZE - 2; x++) {
        const cell = cellXY(x, y);
        if (!cell || cell.water || cell.prop) continue;
        const dx = x + 0.5 - center;
        const dy = y + 0.5 - center;
        const dist = Math.hypot(dx, dy);
        if (dist < 3.8 || dist > 15.2) continue;
        const r = hash(x, y, 2);
        if (cell.type === 'grass' && r > 0.975) placeProp(x, y, 'crystal');
        else if (cell.type === 'grass' && r > 0.935) placeProp(x, y, 'rock');
        else if (cell.type === 'grass' && r > 0.895) placeProp(x, y, 'tree');
      }
    }
    sortedCells.sort((a, b) => (a.x + a.y) - (b.x + b.y) || a.y - b.y || a.x - b.x);
  }

  function newPlayer() {
    return {
      x: WORLD_SIZE / 2 + 0.5,
      y: WORLD_SIZE / 2 + 0.5,
      angle: 0,
      pitch: 0,
      flying: false,
      altitude: 0,
      faceX: 1,
      faceY: 0,
      health: MAX_HEALTH,
      walk: 0,
      moving: false,
      swing: 0,
      hitFlash: 0,
      invulnerable: 0,
      attackPush: { x: 0, y: 0 }
    };
  }

  function pickSpawnCell(minDistance, maxDistance, occupied = []) {
    const center = WORLD_SIZE / 2 + 0.5;
    for (let tries = 0; tries < 300; tries++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = minDistance + Math.random() * (maxDistance - minDistance);
      const x = Math.floor(center + Math.cos(angle) * distance);
      const y = Math.floor(center + Math.sin(angle) * distance);
      const cell = cellXY(x, y);
      if (!cell || cell.water || cell.prop || Math.abs(cell.elevation - 1) > 1) continue;
      if (occupied.some(p => Math.hypot(p.x - (x + 0.5), p.y - (y + 0.5)) < 2.2)) continue;
      return { x: x + 0.5, y: y + 0.5 };
    }
    return { x: center + 5, y: center - 2 };
  }

  function makeMob(position, kind) {
    return {
      x: position.x,
      y: position.y,
      kind: kind || (Math.random() > 0.72 ? 'ember' : 'slime'),
      hp: 2,
      maxHp: 2,
      alive: true,
      bob: Math.random() * Math.PI * 2,
      hitFlash: 0,
      knockX: 0,
      knockY: 0,
      wanderX: 0,
      wanderY: 0,
      think: Math.random() * 1.5,
      biteAt: 0,
      respawnAt: 0
    };
  }

  function resetRun(newSeed = true) {
    if (inventoryOpen) closeInventory();
    if (newSeed) generateWorld(Math.random() * 100000);
    player = newPlayer();
    mobs = [];
    const occupied = [];
    const spawnCount = mode === 'survival' ? 4 : 4;
    for (let i = 0; i < spawnCount; i++) {
      const pos = pickSpawnCell(5.5, 9.5, occupied);
      occupied.push(pos);
      mobs.push(makeMob(pos));
    }
    particles = [];
    floaters = [];
    inventory = mode === 'creative'
      ? Object.fromEntries(BLOCKS.map(block => [block.id, Infinity]))
      : { dirt: 8, stone: 4, wood: 3, sand: 4, brick: 2, crystal: 0, grass: 4, planks: 4, leaves: 0 };
    gearInventory = mode === 'creative'
      ? Object.fromEntries(GEAR.map(item => [item.id, Infinity]))
      : Object.fromEntries(GEAR.map(item => [item.id, 0]));
    equipment = { weapon: null, head: null, chest: null, legs: null, feet: null };
    inventoryOpen = false;
    selectedBlock = 0;
    camera = { x: player.x, y: player.y };
    currentSession = {
      mode,
      score: 0,
      time: 0,
      combo: 0,
      lastScoreAt: -99,
      kills: 0,
      blocks: 0,
      highSaved: false,
      scoreTick: 0,
      day: 1
    };
    lastAttackAt = -1;
    lastMineAt = -1;
    lastBuildAt = -1;
    lastSpaceTap = -Infinity;
    spawnTimer = 11;
    screenShake = 0;
    touchRepeat = 0;
    touchActions.clear();
    mouse.inCanvas = false;
    mouse.touchTarget = null;
    mouse.dragging = false;
  }

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = rect.width;
    height = rect.height;
    ratio = Math.min(1.45, Math.max(1, (window.devicePixelRatio || 1) * 0.72));
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = false;
    tileW = Math.max(19, Math.min(47, Math.min(width / 23, height / 12)));
    tileH = tileW * 0.52;
    blockH = tileH * 0.82;
  }

  function horizonY() {
    const viewHorizon = height * 0.43 + (player ? player.pitch : 0) * height;
    return Math.max(height * 0.07, Math.min(height * 0.93, viewHorizon));
  }

  function adjustPitch(pointerDeltaY, sensitivity) {
    if (!player) return;
    player.pitch = Math.max(-0.42, Math.min(0.42, player.pitch - pointerDeltaY * sensitivity));
  }

  function focalLength() {
    return width / (2 * Math.tan(FIELD_OF_VIEW * 0.5));
  }

  function cameraWorldZ() {
    const groundCell = player ? cellAt(player.x, player.y) : null;
    return CAMERA_HEIGHT + (groundCell ? groundCell.elevation : 0) + (player ? player.altitude : 0);
  }

  function normalizeAngle(angle) {
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  }

  function angleForScreenX(screenX) {
    return player.angle + Math.atan((screenX - width * 0.5) / focalLength());
  }

  function project(x, y, z = 0) {
    if (!player) return { x: width * 0.5, y: height * 0.5, depth: 0 };
    const dx = x - player.x;
    const dy = y - player.y;
    const distance = Math.hypot(dx, dy);
    const relativeAngle = normalizeAngle(Math.atan2(dy, dx) - player.angle);
    const depth = distance * Math.cos(relativeAngle);
    const cameraZ = cameraWorldZ();
    const safeDepth = Math.max(0.08, depth);
    return {
      x: width * 0.5 + Math.tan(relativeAngle) * focalLength(),
      y: horizonY() + (cameraZ - z) * focalLength() / safeDepth,
      depth,
      relativeAngle
    };
  }

  function terrainColors(type, x, y) {
    if (type === 'sand') return hash(x, y, 44) > 0.67
      ? { top: '#ceb66b', left: '#947e48', right: '#78683d', accent: '#e6d18a' }
      : { top: '#d9c275', left: '#a28d52', right: '#806f42', accent: '#ead793' };
    if (type === 'stoneground') return { top: '#747f76', left: '#59635d', right: '#424e49', accent: '#909d90' };
    if (type === 'dirtground') return { top: '#755640', left: '#57402f', right: '#433329', accent: '#90704d' };
    return hash(x, y, 34) > 0.58
      ? { top: '#548a4d', left: '#3c6a43', right: '#2e5540', accent: '#77a957' }
      : { top: '#4c824a', left: '#365f3c', right: '#294d39', accent: '#6c9f54' };
  }

  function pathDiamond(cx, cy, halfW = tileW * 0.5, halfH = tileH * 0.5) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfH);
    ctx.lineTo(cx + halfW, cy);
    ctx.lineTo(cx, cy + halfH);
    ctx.lineTo(cx - halfW, cy);
    ctx.closePath();
  }

  function fillSide(points, color) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(8, 20, 13, .18)';
    ctx.lineWidth = Math.max(0.7, tileW * 0.014);
    ctx.stroke();
  }

  function drawGround(cell, time) {
    const cx = cell.x + 0.5;
    const cy = cell.y + 0.5;
    const center = project(cx, cy, cell.elevation);
    const halfW = tileW * 0.5;
    const halfH = tileH * 0.5;

    if (cell.water) {
      const wave = Math.sin(time * 1.2 + cell.x * 0.8 + cell.y * 0.6);
      pathDiamond(center.x, center.y);
      ctx.fillStyle = wave > 0.2 ? '#1e6b78' : '#1b626f';
      ctx.fill();
      ctx.strokeStyle = 'rgba(81, 189, 190, .17)';
      ctx.lineWidth = 0.75;
      ctx.stroke();
      if (hash(cell.x, cell.y, 5) > 0.69) {
        const stripeX = center.x + Math.sin(time * 1.3 + cell.x) * tileW * 0.1;
        const stripeY = center.y + Math.cos(time * 0.8 + cell.y) * tileH * 0.1;
        ctx.fillStyle = 'rgba(111, 221, 199, .35)';
        ctx.fillRect(Math.round(stripeX - tileW * 0.095), Math.round(stripeY), Math.max(2, tileW * 0.18), Math.max(1, tileH * 0.055));
      }
      return;
    }

    const east = cellXY(cell.x + 1, cell.y);
    const south = cellXY(cell.x, cell.y + 1);
    const eastHeight = east && !east.water ? east.elevation : 0;
    const southHeight = south && !south.water ? south.elevation : 0;
    const colors = terrainColors(cell.type, cell.x, cell.y);
    const n = cell.elevation;

    if (n > eastHeight) {
      const drop = (n - eastHeight) * blockH;
      fillSide([
        [center.x + halfW, center.y], [center.x, center.y + halfH],
        [center.x, center.y + halfH + drop], [center.x + halfW, center.y + drop]
      ], colors.right);
    }
    if (n > southHeight) {
      const drop = (n - southHeight) * blockH;
      fillSide([
        [center.x, center.y + halfH], [center.x - halfW, center.y],
        [center.x - halfW, center.y + drop], [center.x, center.y + halfH + drop]
      ], colors.left);
    }

    pathDiamond(center.x, center.y);
    ctx.fillStyle = colors.top;
    ctx.fill();
    ctx.strokeStyle = 'rgba(16, 39, 22, .3)';
    ctx.lineWidth = Math.max(0.65, tileW * 0.012);
    ctx.stroke();

    const pixel = Math.max(1, Math.round(tileW * 0.055));
    const speckle = hash(cell.x, cell.y, 3);
    if (cell.type === 'grass' && speckle > 0.18) {
      ctx.fillStyle = colors.accent;
      ctx.fillRect(Math.round(center.x - tileW * 0.19), Math.round(center.y - tileH * 0.04), pixel * 1.2, pixel);
      if (speckle > 0.52) ctx.fillRect(Math.round(center.x + tileW * 0.12), Math.round(center.y + tileH * 0.12), pixel, pixel);
    } else if ((cell.type === 'sand' || cell.type === 'dirtground') && speckle > 0.3) {
      ctx.fillStyle = colors.accent;
      ctx.fillRect(Math.round(center.x - tileW * 0.15), Math.round(center.y + tileH * 0.02), pixel, pixel);
      if (speckle > 0.7) ctx.fillRect(Math.round(center.x + tileW * 0.15), Math.round(center.y - tileH * 0.11), pixel * 0.8, pixel);
    } else if (cell.type === 'stoneground' && speckle > 0.25) {
      ctx.fillStyle = colors.accent;
      ctx.fillRect(Math.round(center.x - tileW * 0.09), Math.round(center.y - tileH * 0.04), pixel * 1.4, pixel * 0.8);
    }
    if (cell.harvested) {
      ctx.fillStyle = 'rgba(33, 42, 29, .23)';
      pathDiamond(center.x, center.y, halfW * 0.43, halfH * 0.36);
      ctx.fill();
      ctx.fillStyle = 'rgba(207, 224, 168, .5)';
      ctx.fillRect(Math.round(center.x - pixel), Math.round(center.y - pixel * 0.35), pixel, Math.max(1, pixel * 0.6));
    }
    if (cell.decoration && !cell.prop && !cell.blocks.length && !cell.harvested) {
      const flowerX = center.x + (cell.decoration > 0.93 ? tileW * 0.17 : -tileW * 0.16);
      const flowerY = center.y - tileH * 0.01;
      ctx.fillStyle = cell.decoration > 0.93 ? '#e9c8ff' : '#c7ee82';
      ctx.fillRect(Math.round(flowerX), Math.round(flowerY), Math.max(1, pixel), Math.max(1, pixel));
      ctx.fillStyle = '#365c38';
      ctx.fillRect(Math.round(flowerX), Math.round(flowerY + pixel), Math.max(1, pixel * 0.7), Math.max(1, pixel));
    }
  }

  function voxelPalette(type) {
    return BLOCK_BY_ID[type] || ({
      leaves: { top: '#83c957', left: '#579847', right: '#3c783f', accent: '#a1e36a' },
      grass: { top: '#74aa4e', left: '#4c803d', right: '#38653d', accent: '#a2ce5f' },
      slime: { top: '#9cfd78', left: '#53ce74', right: '#2e9d69', accent: '#c2ff91' },
      ember: { top: '#ffc36d', left: '#e77a55', right: '#b94850', accent: '#ffe09c' },
      skin: { top: '#ffd29b', left: '#d89164', right: '#ae674f', accent: '#ffe5b1' },
      shirt: { top: '#91f0ce', left: '#40bfa6', right: '#267f83', accent: '#c1ffdc' },
      pants: { top: '#617a9a', left: '#435c7b', right: '#30445f', accent: '#8095aa' },
      flash: { top: '#fff6d8', left: '#ffe59a', right: '#ffbe79', accent: '#ffffff' }
    })[type];
  }

  function drawVoxelShape(cx, topCy, material, widthScale = 1, units = 1, alpha = 1, pop = 1) {
    const colors = voxelPalette(material);
    if (!colors) return;
    const scale = widthScale * pop;
    const hw = tileW * 0.5 * scale;
    const hh = tileH * 0.5 * scale;
    const drop = blockH * units * pop;
    const north = [cx, topCy - hh];
    const east = [cx + hw, topCy];
    const south = [cx, topCy + hh];
    const west = [cx - hw, topCy];
    ctx.save();
    ctx.globalAlpha *= alpha;
    fillSide([east, south, [south[0], south[1] + drop], [east[0], east[1] + drop]], colors.right);
    fillSide([south, west, [west[0], west[1] + drop], [south[0], south[1] + drop]], colors.left);
    pathDiamond(cx, topCy, hw, hh);
    ctx.fillStyle = colors.top;
    ctx.fill();
    ctx.strokeStyle = 'rgba(19, 33, 20, .42)';
    ctx.lineWidth = Math.max(0.7, tileW * 0.016);
    ctx.stroke();
    const p = Math.max(1, Math.round(tileW * 0.052));
    ctx.fillStyle = colors.accent;
    ctx.fillRect(Math.round(cx - hw * 0.25), Math.round(topCy - hh * 0.08), p, p);
    ctx.restore();
  }

  function drawCell(cell, time) {
    const center = project(cell.x + 0.5, cell.y + 0.5, cell.elevation);
    if (center.x < -tileW * 2 || center.x > width + tileW * 2 || center.y < -blockH * 5 || center.y > height + blockH * 3) return;
    drawGround(cell, time);

    if (cell.prop) drawProp(cell, time);
    if (cell.blocks.length) {
      for (let i = 0; i < cell.blocks.length; i++) {
        const pop = cell.pop > 0 && i === cell.blocks.length - 1 ? 1 + Math.sin((1 - cell.pop / 0.2) * Math.PI) * 0.12 : 1;
        const top = project(cell.x + 0.5, cell.y + 0.5, cell.elevation + i + 1);
        drawVoxelShape(top.x, top.y, cell.blocks[i], 0.95, 1, 1, pop);
      }
    }
  }

  function drawProp(cell, time) {
    const prop = cell.prop;
    if (!prop) return;
    const cx = cell.x + 0.5;
    const cy = cell.y + 0.5;
    const ground = project(cx, cy, cell.elevation);
    const pixel = Math.max(1, Math.round(tileW * 0.075));
    const hitAlpha = prop.flash > 0 && Math.floor(time * 24) % 2 === 0 ? 0.45 : 1;
    ctx.fillStyle = 'rgba(5, 20, 12, .32)';
    ctx.fillRect(Math.round(ground.x - tileW * 0.2), Math.round(ground.y - tileH * 0.05), Math.round(tileW * 0.4), Math.max(2, pixel));

    if (prop.kind === 'tree') {
      const trunkTop = project(cx, cy, cell.elevation + 0.96);
      drawVoxelShape(trunkTop.x, trunkTop.y, 'wood', 0.43, 0.96, hitAlpha);
      const trunkUpper = project(cx, cy, cell.elevation + 1.8);
      drawVoxelShape(trunkUpper.x, trunkUpper.y, 'wood', 0.38, 0.88, hitAlpha);
      const leafLower = project(cx, cy, cell.elevation + 2.52);
      drawVoxelShape(leafLower.x - tileW * 0.04, leafLower.y, 'leaves', 1.17, 0.93, hitAlpha);
      const leafTop = project(cx - 0.03, cy - 0.02, cell.elevation + 3.22);
      drawVoxelShape(leafTop.x, leafTop.y, 'leaves', 1.0, 0.79, hitAlpha);
      ctx.fillStyle = '#c4ef77';
      ctx.fillRect(Math.round(leafTop.x - tileW * 0.15), Math.round(leafTop.y - tileH * 0.08), pixel, pixel);
      if (prop.hp < prop.maxHp) drawHealthNotches(ground.x, ground.y - blockH * 3.35, prop.hp, prop.maxHp);
      return;
    }
    if (prop.kind === 'rock') {
      const base = project(cx, cy, cell.elevation + 0.62);
      drawVoxelShape(base.x, base.y, 'stone', 0.92, 0.62, hitAlpha);
      const cap = project(cx - 0.09, cy - 0.07, cell.elevation + 0.95);
      drawVoxelShape(cap.x, cap.y, 'stone', 0.52, 0.44, hitAlpha);
      ctx.fillStyle = '#d2d7c9';
      ctx.fillRect(Math.round(cap.x - tileW * 0.09), Math.round(cap.y - tileH * 0.03), pixel, pixel);
      if (prop.hp < prop.maxHp) drawHealthNotches(ground.x, ground.y - blockH * 1.05, prop.hp, prop.maxHp);
      return;
    }
    if (prop.kind === 'crystal') {
      const base = project(cx, cy, cell.elevation + 0.65);
      drawVoxelShape(base.x, base.y, 'crystal', 0.68, 0.64, hitAlpha);
      const spireY = base.y - blockH * 0.48;
      ctx.fillStyle = '#aafff0';
      ctx.beginPath();
      ctx.moveTo(base.x, spireY - tileH * 0.38);
      ctx.lineTo(base.x + tileW * 0.1, spireY + tileH * 0.08);
      ctx.lineTo(base.x, spireY + tileH * 0.12);
      ctx.lineTo(base.x - tileW * 0.09, spireY + tileH * 0.03);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgba(199, 255, 238, .65)';
      ctx.fillRect(Math.round(base.x - pixel * 0.15), Math.round(spireY - tileH * 0.14), Math.max(1, pixel * 0.45), Math.max(1, pixel * 0.65));
      if (prop.hp < prop.maxHp) drawHealthNotches(ground.x, ground.y - blockH * 1.25, prop.hp, prop.maxHp);
    }
  }

  function drawHealthNotches(x, y, hp, maxHp) {
    const barW = tileW * 0.38;
    const unit = barW / maxHp;
    ctx.fillStyle = 'rgba(5, 12, 8, .8)';
    ctx.fillRect(x - barW / 2 - 1, y - 1, barW + 2, 4);
    ctx.fillStyle = '#ff766b';
    ctx.fillRect(x - barW / 2, y, Math.max(0, unit * hp - 1), 2);
  }

  function drawMob(mob, time) {
    const cell = cellAt(mob.x, mob.y);
    const ground = project(mob.x, mob.y, cell ? cell.elevation : 0);
    const bob = Math.sin(time * 6.2 + mob.bob) * blockH * 0.065;
    const kind = mob.kind === 'ember' ? 'ember' : 'slime';
    const top = project(mob.x, mob.y, (cell ? cell.elevation : 0) + 0.66);
    ctx.fillStyle = 'rgba(4, 19, 14, .34)';
    ctx.fillRect(Math.round(ground.x - tileW * 0.2), Math.round(ground.y - tileH * 0.025), Math.round(tileW * 0.4), Math.max(2, tileH * 0.12));
    const hitAlpha = mob.hitFlash > 0 && Math.floor(time * 24) % 2 === 0 ? 0.38 : 1;
    drawVoxelShape(top.x, top.y + bob, kind, 0.74, 0.66, hitAlpha);
    const eyeY = top.y + bob + blockH * 0.36;
    const eyeSize = Math.max(2, Math.round(tileW * 0.06));
    ctx.fillStyle = '#153229';
    ctx.fillRect(Math.round(top.x - tileW * 0.12), Math.round(eyeY), eyeSize, eyeSize);
    ctx.fillRect(Math.round(top.x + tileW * 0.055), Math.round(eyeY), eyeSize, eyeSize);
    if (mob.hp < mob.maxHp) drawHealthNotches(top.x, top.y - tileH * 0.56, mob.hp, mob.maxHp);
    if (mob.hitFlash > 0) {
      ctx.strokeStyle = 'rgba(255, 245, 209, .75)';
      ctx.lineWidth = 1;
      pathDiamond(top.x, top.y + bob, tileW * 0.4, tileH * 0.34);
      ctx.stroke();
    }
  }

  function drawPlayer(time) {
    const groundCell = cellAt(player.x, player.y);
    const groundZ = groundCell ? groundCell.elevation : 0;
    const ground = project(player.x, player.y, groundZ);
    const bob = player.moving ? Math.abs(Math.sin(player.walk * 11)) * blockH * 0.11 : Math.sin(time * 2.2) * blockH * 0.025;
    const blink = player.invulnerable > 0 && Math.floor(time * 22) % 2 === 0;
    if (blink) return;

    ctx.fillStyle = 'rgba(4, 17, 12, .4)';
    ctx.fillRect(Math.round(ground.x - tileW * 0.22), Math.round(ground.y - tileH * 0.03), Math.round(tileW * 0.44), Math.max(2, tileH * 0.14));

    // Tiny voxel adventurer: boots, jacket, then a chunky pixel head.
    const legY = ground.y - blockH * 0.26 + bob;
    ctx.fillStyle = '#2c4660';
    ctx.fillRect(Math.round(ground.x - tileW * 0.17), Math.round(legY), Math.max(3, tileW * 0.13), Math.max(3, blockH * 0.27));
    ctx.fillRect(Math.round(ground.x + tileW * 0.045), Math.round(legY), Math.max(3, tileW * 0.13), Math.max(3, blockH * 0.27));
    const body = project(player.x, player.y, groundZ + 0.54);
    drawVoxelShape(body.x, body.y + bob, 'shirt', 0.66, 0.55);
    ctx.fillStyle = '#d0fff0';
    ctx.fillRect(Math.round(body.x - tileW * 0.1), Math.round(body.y + blockH * 0.29 + bob), Math.max(2, tileW * 0.07), Math.max(1, tileH * 0.07));
    const head = project(player.x, player.y, groundZ + 1.02);
    drawVoxelShape(head.x, head.y + bob, 'skin', 0.54, 0.48);
    // Legacy avatar sprite retained for the optional isometric renderer.
    ctx.fillStyle = '#3b302a';
    ctx.fillRect(Math.round(head.x - tileW * 0.17), Math.round(head.y - tileH * 0.03 + bob), Math.max(2, tileW * 0.15), Math.max(2, tileH * 0.2));
    ctx.fillRect(Math.round(head.x + tileW * 0.015), Math.round(head.y - tileH * 0.12 + bob), Math.max(2, tileW * 0.16), Math.max(2, tileH * 0.18));
    ctx.fillStyle = '#18342a';
    const eyeY = head.y + blockH * 0.26 + bob;
    ctx.fillRect(Math.round(head.x - tileW * 0.095), Math.round(eyeY), Math.max(2, tileW * 0.045), Math.max(2, tileH * 0.12));
    ctx.fillRect(Math.round(head.x + tileW * 0.07), Math.round(eyeY), Math.max(2, tileW * 0.045), Math.max(2, tileH * 0.12));

    if (player.swing > 0) drawPlayerSwing(ground, time);
  }

  function drawPlayerSwing(ground, time) {
    const progress = 1 - player.swing / 0.23;
    const vx = player.faceX - player.faceY;
    const vy = (player.faceX + player.faceY) * (tileH / tileW);
    const angle = Math.atan2(vy, vx) + (progress - 0.5) * 2.3;
    const reach = tileW * 0.48;
    const sx = ground.x + Math.cos(angle) * tileW * 0.25;
    const sy = ground.y - blockH * 0.7 + Math.sin(angle) * tileH * 0.2;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(angle);
    ctx.fillStyle = '#e7f6c7';
    ctx.fillRect(0, -Math.max(2, tileH * 0.09), reach, Math.max(3, tileH * 0.16));
    ctx.fillStyle = '#73d9d6';
    ctx.fillRect(reach * 0.59, -Math.max(2, tileH * 0.09), reach * 0.16, Math.max(3, tileH * 0.16));
    ctx.fillStyle = '#b27847';
    ctx.fillRect(-tileW * 0.09, -tileH * 0.12, tileW * 0.12, tileH * 0.23);
    ctx.restore();
    if (progress < 0.75) {
      ctx.strokeStyle = `rgba(222, 255, 156, ${0.75 * (1 - progress)})`;
      ctx.lineWidth = Math.max(1.5, tileW * 0.055);
      ctx.beginPath();
      ctx.arc(ground.x + Math.cos(angle) * tileW * 0.2, ground.y - blockH * 0.65, tileW * 0.48, angle - 0.8, angle + 0.7);
      ctx.stroke();
    }
  }

  function drawTarget() {
    if (state !== 'playing') return;
    let target = null;
    if (mouse.inCanvas) {
      target = mouse.type === 'touch' && mouse.touchTarget
        ? cellXY(mouse.touchTarget.x, mouse.touchTarget.y)
        : pickCellAtScreen(mouse.x, mouse.y);
    }
    if (!target) target = getFrontCell();
    if (!target) return;
    const cell = target;
    const topZ = cell.elevation + cell.blocks.length;
    const center = project(cell.x + 0.5, cell.y + 0.5, topZ);
    const scale = cell.prop && cell.prop.kind === 'tree' ? 1.32 : 1.03;
    ctx.fillStyle = 'rgba(194, 255, 101, .07)';
    pathDiamond(center.x, center.y, tileW * 0.5 * scale, tileH * 0.5 * scale);
    ctx.fill();
    ctx.strokeStyle = 'rgba(202, 255, 121, .82)';
    ctx.lineWidth = Math.max(1.2, tileW * 0.027);
    ctx.setLineDash([Math.max(2, tileW * 0.07), Math.max(2, tileW * 0.055)]);
    ctx.stroke();
    ctx.setLineDash([]);
    if (cell.prop && cell.prop.hp < cell.prop.maxHp) {
      drawHealthNotches(center.x, center.y - tileH * 0.7, cell.prop.hp, cell.prop.maxHp);
    }
  }

  function drawEffects(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.life -= dt;
      if (particle.life <= 0) { particles.splice(i, 1); continue; }
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.z = Math.max(0, particle.z + particle.vz * dt);
      particle.vz -= 4.7 * dt;
      const p = project(particle.x, particle.y, particle.z);
      if (p.depth <= 0.05 || Math.abs(p.relativeAngle) > FIELD_OF_VIEW * 0.72) continue;
      const fade = Math.max(0, Math.min(1, particle.life / particle.maxLife));
      ctx.globalAlpha = fade;
      ctx.fillStyle = particle.color;
      const size = Math.max(2, particle.size * (0.6 + fade * 0.45));
      ctx.fillRect(Math.round(p.x - size / 2), Math.round(p.y - size / 2), size, size);
      ctx.globalAlpha = 1;
    }
    for (let i = floaters.length - 1; i >= 0; i--) {
      const floater = floaters[i];
      floater.life -= dt;
      if (floater.life <= 0) { floaters.splice(i, 1); continue; }
      floater.z += dt * 1.5;
      const p = project(floater.x, floater.y, floater.z);
      if (p.depth <= 0.05 || Math.abs(p.relativeAngle) > FIELD_OF_VIEW * 0.72) continue;
      const alpha = Math.min(1, floater.life / 0.25);
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${Math.max(9, Math.round(tileW * 0.24))}px "DM Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(5, 13, 9, .75)';
      ctx.strokeText(floater.text, p.x, p.y);
      ctx.fillStyle = floater.color;
      ctx.fillText(floater.text, p.x, p.y);
      ctx.globalAlpha = 1;
    }
  }

  function renderIsometric(time) {
    if (!width || !height) return;
    const sceneTime = state === 'paused' && currentSession ? currentSession.time : time;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#13221c';
    ctx.fillRect(0, 0, width, height);
    // Pixel star specks and low-contrast ambience outside the island.
    for (let i = 0; i < 34; i++) {
      const x = (hash(i, 5, 79) * width + time * (i % 2 ? 0.6 : -0.35)) % width;
      const y = hash(i, 18, 81) * height;
      ctx.fillStyle = i % 6 === 0 ? 'rgba(178, 233, 180, .13)' : 'rgba(138, 183, 155, .065)';
      ctx.fillRect((x + width) % width | 0, y | 0, i % 6 === 0 ? 2 : 1, i % 6 === 0 ? 2 : 1);
    }
    const glow = ctx.createRadialGradient(width * 0.48, height * 0.43, 1, width * 0.5, height * 0.49, Math.max(width, height) * 0.72);
    glow.addColorStop(0, 'rgba(44, 105, 65, .18)');
    glow.addColorStop(1, 'rgba(4, 10, 8, .3)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const shakeX = state === 'playing' && screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
    const shakeY = state === 'playing' && screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);
    const dynamic = [];
    for (const mob of mobs) if (mob.alive) dynamic.push({ depth: mob.x + mob.y, order: 1, type: 'mob', item: mob });
    if (player) dynamic.push({ depth: player.x + player.y, order: 2, type: 'player', item: player });
    dynamic.sort((a, b) => a.depth - b.depth || a.order - b.order);
    let dynamicIndex = 0;
    const drawDynamicBefore = (depth, includeEqual = false) => {
      while (dynamicIndex < dynamic.length && (dynamic[dynamicIndex].depth < depth - 0.0001 || (includeEqual && dynamic[dynamicIndex].depth <= depth + 0.0001))) {
        const entry = dynamic[dynamicIndex++];
        if (entry.type === 'mob') drawMob(entry.item, sceneTime);
        else drawPlayer(sceneTime);
      }
    };
    for (const cell of sortedCells) {
      const depth = cell.x + cell.y + 1;
      drawDynamicBefore(depth, false);
      drawCell(cell, sceneTime);
      drawDynamicBefore(depth, true);
    }
    while (dynamicIndex < dynamic.length) {
      const entry = dynamic[dynamicIndex++];
        if (entry.type === 'mob') drawMob(entry.item, sceneTime);
        else drawPlayer(sceneTime);
    }
    const effectDt = state === 'playing' ? Math.min(0.045, Math.max(0, time - (render.lastTime || time))) : 0;
    drawEffects(effectDt);
    render.lastTime = time;
    drawTarget();
    ctx.restore();
  }

  const FLOOR_BASES = {
    grass: '#71a94c', sand: '#e0c977', stoneground: '#909791',
    dirtground: '#966d48', water: '#3f9fc0'
  };
  const FLOOR_CACHE = new Map();
  const WALL_CACHE = new Map();

  function shadedColor(hex, distance, side = 1, cache = WALL_CACHE) {
    const bucket = Math.min(32, Math.max(0, Math.floor(distance * 0.8)));
    const key = `${hex}:${bucket}:${side}`;
    if (cache.has(key)) return cache.get(key);
    const raw = hex.replace('#', '');
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    const sideLight = side === 0 ? 0.73 : 0.94;
    const fog = Math.min(0.54, bucket / 32 * 0.54);
    const light = Math.max(0.22, 0.98 - bucket * 0.016) * sideLight;
    const fogColor = [102, 159, 179];
    const rgb = [r, g, b].map((channel, index) => Math.round(channel * light * (1 - fog) + fogColor[index] * fog));
    const value = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    cache.set(key, value);
    return value;
  }

  function floorColor(type, distance, edge = false, variation = 0) {
    const base = FLOOR_BASES[type] || FLOOR_BASES.grass;
    const bucket = Math.min(32, Math.max(0, Math.floor(distance * 0.8)));
    const key = `${base}:${bucket}:${edge ? 1 : 0}:${variation}`;
    if (FLOOR_CACHE.has(key)) return FLOOR_CACHE.get(key);
    const raw = base.replace('#', '');
    const channels = [0, 2, 4].map(offset => parseInt(raw.slice(offset, offset + 2), 16));
    const light = Math.max(0.28, 0.98 - bucket * 0.017 + (variation - 1) * 0.035) * (edge ? 0.68 : 1);
    const fog = Math.min(0.48, bucket / 32 * 0.48);
    const rgb = channels.map((channel, index) => Math.round(channel * light * (1 - fog) + [122, 177, 191][index] * fog));
    const color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    FLOOR_CACHE.set(key, color);
    return color;
  }

  function drawFirstPersonSky(horizon, time) {
    const sky = ctx.createLinearGradient(0, 0, 0, Math.max(1, horizon));
    sky.addColorStop(0, '#62b7f4');
    sky.addColorStop(0.58, '#9bdcff');
    sky.addColorStop(1, '#d6f0f4');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, horizon + 2);
    const sunX = width * (0.73 + Math.sin(player.angle * 0.18) * 0.08);
    const sunY = horizon * 0.38;
    const sunSize = Math.max(13, tileW * 0.62);
    ctx.fillStyle = 'rgba(255, 239, 174, .16)';
    ctx.fillRect(sunX - sunSize * 0.9, sunY - sunSize * 0.9, sunSize * 2.8, sunSize * 2.8);
    ctx.fillStyle = '#fff0a8';
    ctx.fillRect(Math.round(sunX), Math.round(sunY), Math.round(sunSize), Math.round(sunSize));
    ctx.fillStyle = '#fff9d1';
    ctx.fillRect(Math.round(sunX + sunSize * 0.2), Math.round(sunY + sunSize * 0.18), Math.max(2, sunSize * 0.17), Math.max(2, sunSize * 0.17));

    // Soft-edged clouds built from chunky pixel rectangles.
    for (let cloud = 0; cloud < 3; cloud++) {
      const cloudWidth = Math.max(34, width * (0.08 + (cloud % 2) * 0.025));
      const cloudX = ((width * (0.13 + cloud * 0.34) + time * (cloud % 2 ? 5 : -3) + player.angle * 14) % (width + cloudWidth) + width + cloudWidth) % (width + cloudWidth) - cloudWidth * 0.4;
      const cloudY = horizon * (0.17 + (cloud % 3) * 0.13);
      const unit = Math.max(4, Math.round(cloudWidth * 0.16));
      ctx.fillStyle = 'rgba(255, 255, 242, .68)';
      ctx.fillRect(Math.round(cloudX + unit), Math.round(cloudY + unit), Math.round(unit * 3), Math.round(unit));
      ctx.fillRect(Math.round(cloudX), Math.round(cloudY + unit * 1.5), Math.round(unit * 6), Math.round(unit * 1.3));
      ctx.fillRect(Math.round(cloudX + unit * 1.5), Math.round(cloudY), Math.round(unit * 2.8), Math.round(unit * 2.5));
    }

    // Layered, blocky treeline gives the island a clear horizon without image assets.
    const parallax = player.angle * 22 + time * 1.4;
    for (let layer = 0; layer < 2; layer++) {
      ctx.fillStyle = layer === 0 ? 'rgba(86, 157, 77, .76)' : 'rgba(67, 128, 63, .92)';
      ctx.beginPath();
      ctx.moveTo(0, horizon + 3);
      const step = Math.max(12, Math.round(width / 35));
      for (let x = 0; x <= width + step; x += step) {
        const wave = Math.sin((x + parallax * (layer + 1)) * 0.021) * 7 + Math.sin((x - parallax) * 0.047) * 4;
        const notch = (Math.floor(x / step) % 4 === 0 ? 5 : 0);
        ctx.lineTo(x, horizon - wave - notch + layer * 5);
        ctx.lineTo(x + step * 0.5, horizon - wave - notch + layer * 5);
        ctx.lineTo(x + step * 0.5, horizon + 3);
      }
      ctx.lineTo(width, horizon + 3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(189, 231, 143, .38)';
    ctx.fillRect(0, Math.floor(horizon), width, 1);
  }

  function drawFirstPersonFloor(horizon, time) {
    const focal = focalLength();
    const stepX = Math.max(3, Math.round(width / 125));
    const stepY = Math.max(5, Math.round(height / 80));
    const cameraHeight = CAMERA_HEIGHT + (player.altitude || 0);
    const columns = [];
    for (let x = 0; x < width; x += stepX) {
      const angle = player.angle + Math.atan((x + stepX * 0.5 - width * 0.5) / focal);
      columns.push({ x, rayX: Math.cos(angle), rayY: Math.sin(angle) });
    }
    const baseY = Math.max(0, Math.floor(horizon));
    for (let y = baseY; y < height; y += stepY) {
      const distance = Math.min(48, cameraHeight * focal / Math.max(1, y + stepY * 0.5 - horizon));
      for (const column of columns) {
        const wx = player.x + column.rayX * distance;
        const wy = player.y + column.rayY * distance;
        const cell = cellAt(wx, wy);
        const type = cell ? cell.type : 'water';
        const fracX = wx - Math.floor(wx);
        const fracY = wy - Math.floor(wy);
        const border = Math.min(fracX, 1 - fracX, fracY, 1 - fracY);
        const edge = distance < 12 && border < 0.055;
        const variant = cell ? cell.floorVariation : 0;
        let color = floorColor(type, distance, edge, variant);
        if (type === 'water' && cell && cell.waterGlint && (Math.floor(time * 3) + cell.x + cell.y) % 4 === 0) color = floorColor('water', Math.max(0, distance - 1.4), false, 2);
        ctx.fillStyle = color;
        ctx.fillRect(column.x, y, stepX + 1, stepY + 1);
      }
    }
  }

  function drawWallSegment(x, stripWidth, horizon, focal, distance, cell, topZ, bottomZ, palette, side, textureSeed) {
    if (topZ <= bottomZ) return;
    const cameraZ = cameraWorldZ();
    const topY = horizon + (cameraZ - topZ) * focal / distance;
    const bottomY = horizon + (cameraZ - bottomZ) * focal / distance;
    const visibleTop = Math.max(-height, topY);
    const visibleBottom = Math.min(height * 1.4, bottomY);
    if (visibleBottom <= visibleTop) return;
    const face = side === 0 ? palette.left : palette.right;
    ctx.fillStyle = shadedColor(face, distance, side);
    ctx.fillRect(Math.floor(x), Math.floor(visibleTop), stripWidth + 1, Math.max(1, Math.ceil(visibleBottom - visibleTop)));
    const pixel = Math.max(1, Math.round(stripWidth * 0.7));
    const textureStep = Math.max(4, Math.round(tileW * 0.15));
    const firstBand = Math.floor(visibleTop / textureStep);
    const lastBand = Math.floor(visibleBottom / textureStep);
    for (let band = firstBand; band <= lastBand; band++) {
      const grain = hash(textureSeed + Math.floor(x / (stripWidth * 3)), band, 63);
      if (grain < 0.48) continue;
      ctx.fillStyle = shadedColor(grain > 0.86 ? (palette.accent || palette.top) : palette.top, distance, 1);
      const y = band * textureStep + Math.round(textureStep * 0.18);
      ctx.fillRect(Math.floor(x), y, pixel, Math.max(1, Math.round(textureStep * (grain > 0.84 ? 0.72 : 0.4))));
    }
    ctx.fillStyle = shadedColor(palette.top, distance, 1);
    const capHeight = Math.max(1, Math.min(4, Math.round(tileW * 0.06)));
    ctx.fillRect(Math.floor(x), Math.floor(topY), stripWidth + 1, capHeight);
  }

  function drawFirstPersonWalls(horizon) {
    const focal = focalLength();
    const stripWidth = Math.max(2, Math.round(width / 520));
    const playerCell = cellAt(player.x, player.y);
    const playerElevation = playerCell ? playerCell.elevation : 0;
    for (let x = 0; x < width; x += stripWidth) {
      const rayAngle = angleForScreenX(x + stripWidth * 0.5);
      const hit = castMapRay(rayAngle, 26);
      if (!hit || hit.boundary || !hit.cell) continue;
      const distance = Math.max(0.12, hit.distance * Math.cos(rayAngle - player.angle));
      const cell = hit.cell;
      const seed = cell.x * 7 + cell.y * 11;
      if (hit.terrainRise) {
        const palette = terrainColors(cell.type, cell.x, cell.y);
        drawWallSegment(x, stripWidth, horizon, focal, distance, cell, cell.elevation, playerElevation, palette, hit.side, seed);
        continue;
      }
      if (cell.prop) {
        if (cell.prop.kind === 'tree') {
          const leaves = voxelPalette('leaves');
          const wood = BLOCK_BY_ID.wood;
          drawWallSegment(x, stripWidth, horizon, focal, distance, cell, cell.elevation + 3.15, cell.elevation + 1.38, leaves, hit.side, seed);
          drawWallSegment(x, stripWidth, horizon, focal, distance, cell, cell.elevation + 1.38, cell.elevation, wood, hit.side, seed + 2);
        } else if (cell.prop.kind === 'rock') {
          drawWallSegment(x, stripWidth, horizon, focal, distance, cell, cell.elevation + 0.96, cell.elevation, BLOCK_BY_ID.stone, hit.side, seed);
        } else {
          drawWallSegment(x, stripWidth, horizon, focal, distance, cell, cell.elevation + 1.32, cell.elevation, BLOCK_BY_ID.crystal, hit.side, seed);
        }
      }
      if (cell.blocks.length) {
        for (let i = 0; i < cell.blocks.length; i++) {
          const palette = BLOCK_BY_ID[cell.blocks[i]] || BLOCK_BY_ID.dirt;
          drawWallSegment(x, stripWidth, horizon, focal, distance, cell, cell.elevation + i + 1, cell.elevation + i, palette, hit.side, seed + i);
        }
      }
    }
  }

  function drawFirstPersonMobs(horizon, time) {
    const focal = focalLength();
    const cameraZ = cameraWorldZ();
    const visible = mobs.filter(mob => mob.alive).map(mob => ({ mob, distance: Math.hypot(mob.x - player.x, mob.y - player.y) })).sort((a, b) => b.distance - a.distance);
    for (const entry of visible) {
      const mob = entry.mob;
      const dx = mob.x - player.x;
      const dy = mob.y - player.y;
      const angle = normalizeAngle(Math.atan2(dy, dx) - player.angle);
      if (Math.abs(angle) > FIELD_OF_VIEW * 0.62) continue;
      const distance = Math.max(0.35, entry.distance);
      const blocker = castMapRay(player.angle + angle, distance);
      if (blocker && !blocker.boundary && blocker.distance < distance - 0.28) continue;
      const depth = Math.max(0.25, distance * Math.cos(angle));
      const screenX = width * 0.5 + Math.tan(angle) * focal;
      const cell = cellAt(mob.x, mob.y);
      const elevation = cell ? cell.elevation : 0;
      const scale = Math.min(height * 1.5, focal / depth);
      const spriteW = Math.max(5, scale * 0.72);
      const spriteH = Math.max(7, scale * 0.76);
      const groundY = horizon + (cameraZ - elevation + 0.015) * focal / depth;
      const bob = Math.sin(time * 6 + mob.bob) * Math.min(8, scale * 0.025);
      const topY = groundY - spriteH * 0.78 + bob;
      const x = screenX - spriteW * 0.5;
      const base = mob.kind === 'ember' ? ['#ffce76', '#ed8b58', '#b94b4e'] : ['#a9ff83', '#5bd581', '#318e69'];
      const size = Math.max(1, Math.round(spriteW * 0.1));
      ctx.fillStyle = 'rgba(3, 12, 9, .45)';
      ctx.fillRect(Math.round(screenX - spriteW * 0.38), Math.round(groundY - size), Math.max(2, spriteW * 0.76), Math.max(2, size * 1.3));
      ctx.fillStyle = mob.hitFlash > 0 && Math.floor(time * 24) % 2 === 0 ? '#fff5d6' : base[1];
      ctx.fillRect(Math.round(x + spriteW * 0.12), Math.round(topY + spriteH * 0.32), Math.max(2, spriteW * 0.76), Math.max(2, spriteH * 0.44));
      ctx.fillRect(Math.round(x + spriteW * 0.23), Math.round(topY + spriteH * 0.2), Math.max(2, spriteW * 0.54), Math.max(2, spriteH * 0.16));
      ctx.fillStyle = base[0];
      ctx.fillRect(Math.round(x + spriteW * 0.19), Math.round(topY + spriteH * 0.2), Math.max(2, spriteW * 0.57), Math.max(2, spriteH * 0.15));
      ctx.fillStyle = base[2];
      ctx.fillRect(Math.round(x + spriteW * 0.12), Math.round(topY + spriteH * 0.62), Math.max(2, spriteW * 0.76), Math.max(2, spriteH * 0.14));
      ctx.fillStyle = '#18352b';
      const eye = Math.max(2, Math.round(spriteW * 0.075));
      ctx.fillRect(Math.round(screenX - spriteW * 0.17), Math.round(topY + spriteH * 0.43), eye, eye);
      ctx.fillRect(Math.round(screenX + spriteW * 0.075), Math.round(topY + spriteH * 0.43), eye, eye);
      ctx.fillStyle = 'rgba(255, 255, 255, .64)';
      ctx.fillRect(Math.round(screenX - spriteW * 0.15), Math.round(topY + spriteH * 0.43), Math.max(1, eye * 0.35), Math.max(1, eye * 0.35));
      if (mob.hp < mob.maxHp) {
        const barW = Math.max(12, spriteW * 0.8);
        ctx.fillStyle = 'rgba(4, 11, 8, .78)';
        ctx.fillRect(screenX - barW * 0.5, topY - 5, barW, 3);
        ctx.fillStyle = '#ff766b';
        ctx.fillRect(screenX - barW * 0.5, topY - 5, barW * mob.hp / mob.maxHp, 3);
      }
    }
  }

  function drawHeldWeapon(item) {
    if (!item) return;
    const materialId = item.id === 'wood_sword' ? 'wood' : item.id === 'stone_sword' ? 'stone' : 'crystal';
    const material = BLOCK_BY_ID[materialId];
    ctx.save();
    ctx.translate(tileW * 0.42, -tileH * 0.75);
    ctx.rotate(-0.22);
    ctx.fillStyle = material.right;
    ctx.fillRect(-2, -37, 6, 24);
    ctx.fillStyle = material.top;
    ctx.fillRect(-1, -44, 4, 29);
    ctx.fillRect(-5, -39, 12, 4);
    ctx.fillStyle = material.left;
    ctx.fillRect(-2, -13, 5, 9);
    ctx.fillStyle = '#4a3428';
    ctx.fillRect(-6, -5, 13, 4);
    ctx.restore();
  }

  function drawHeldItem(time) {
    if (!player) return;
    const bob = player.moving ? Math.abs(Math.sin(player.walk * 10)) * Math.min(8, tileW * 0.12) : 0;
    const progress = player.swing > 0 ? 1 - player.swing / 0.23 : 1;
    const swing = player.swing > 0 ? Math.sin(progress * Math.PI) : 0;
    const x = width * 0.81 + swing * width * 0.035;
    const y = height * 0.82 + bob - swing * height * 0.08;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.18 + swing * 0.72);
    ctx.fillStyle = '#267f83';
    ctx.fillRect(-tileW * 0.05, tileH * 0.05, tileW * 0.92, height * 0.28);
    ctx.fillStyle = '#40bfa6';
    ctx.fillRect(-tileW * 0.02, tileH * 0.04, tileW * 0.84, Math.max(3, tileH * 0.25));
    ctx.fillStyle = '#ffd29b';
    ctx.fillRect(-tileW * 0.22, -tileH * 0.28, tileW * 0.42, tileH * 0.3);
    const weapon = GEAR_BY_ID[equipment.weapon];
    if (weapon) drawHeldWeapon(weapon);
    else {
      const block = BLOCKS[selectedBlock];
      drawVoxelShape(tileW * 0.42, -tileH * 0.75, block.id, 1.42, 1.06);
    }
    ctx.restore();
    if (player.swing > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress);
      ctx.strokeStyle = '#dcff9a';
      ctx.lineWidth = Math.max(2, tileW * 0.055);
      ctx.beginPath();
      ctx.arc(width * 0.67, height * 0.72, tileW * 1.1, 3.45 + progress, 4.55 + progress);
      ctx.stroke();
      ctx.restore();
    }
  }

  function renderFirstPerson(time) {
    if (!width || !height || !player) return;
    const sceneTime = state === 'paused' && currentSession ? currentSession.time : time;
    const horizon = horizonY();
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const shakeX = state === 'playing' && screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
    const shakeY = state === 'playing' && screenShake > 0 ? (Math.random() - 0.5) * screenShake : 0;
    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.fillStyle = '#152a23';
    ctx.fillRect(0, 0, width, height);
    drawFirstPersonSky(horizon, sceneTime);
    ctx.fillStyle = '#305d40';
    ctx.fillRect(0, horizon, width, height - horizon);
    drawFirstPersonFloor(horizon, sceneTime);
    drawFirstPersonWalls(horizon);
    drawFirstPersonMobs(horizon, sceneTime);
    const fxDt = state === 'playing' && !inventoryOpen ? Math.min(0.045, Math.max(0, time - (renderFirstPerson.lastTime || time))) : 0;
    drawEffects(fxDt);
    renderFirstPerson.lastTime = time;
    if (state === 'playing') drawHeldItem(sceneTime);
    ctx.restore();
  }

  function render(time) {
    renderFirstPerson(time);
  }

  function screenToWorld(sx, sy, z = 0.8) {
    const dx = (sx - width * 0.5) / (tileW * 0.5);
    const dy = (sy - height * 0.505 + z * blockH) / (tileH * 0.5);
    const alongX = (dx + dy) * 0.5;
    const alongY = (dy - dx) * 0.5;
    return { x: camera.x + alongX, y: camera.y + alongY };
  }

  function castMapRay(angle, maxDistance = 22) {
    const rayX = Math.cos(angle);
    const rayY = Math.sin(angle);
    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);
    const deltaX = Math.abs(1 / (rayX || 0.00001));
    const deltaY = Math.abs(1 / (rayY || 0.00001));
    const stepX = rayX < 0 ? -1 : 1;
    const stepY = rayY < 0 ? -1 : 1;
    let sideX = (rayX < 0 ? player.x - mapX : mapX + 1 - player.x) * deltaX;
    let sideY = (rayY < 0 ? player.y - mapY : mapY + 1 - player.y) * deltaY;
    let distance = 0;
    let side = 0;
    const playerGround = cellAt(player.x, player.y);
    const playerHeight = playerGround ? playerGround.elevation : 0;
    for (let step = 0; step < 96 && distance < maxDistance; step++) {
      if (sideX < sideY) {
        distance = sideX;
        sideX += deltaX;
        mapX += stepX;
        side = 0;
      } else {
        distance = sideY;
        sideY += deltaY;
        mapY += stepY;
        side = 1;
      }
      const cell = cellXY(mapX, mapY);
      if (!cell) return { cell: null, distance, side, boundary: true };
      if (cell.prop || cell.blocks.length) return { cell, distance, side, boundary: false };
      const rise = cell.elevation - playerHeight;
      if (rise > 0) return { cell, distance, side, boundary: false, terrainRise: rise };
    }
    return null;
  }

  function rayCell(angle, maxDistance = 3.4) {
    let firstGround = null;
    for (let distance = 0.62; distance <= maxDistance; distance += 0.12) {
      const x = player.x + Math.cos(angle) * distance;
      const y = player.y + Math.sin(angle) * distance;
      const cell = cellAt(x, y);
      if (!cell || cell.water) break;
      if (Math.hypot(player.x - (cell.x + 0.5), player.y - (cell.y + 0.5)) < 0.66) continue;
      if (cell.prop || cell.blocks.length) return cell;
      if (!firstGround) firstGround = cell;
    }
    const hit = castMapRay(angle, maxDistance);
    if (hit && !hit.boundary && hit.cell && hit.distance <= maxDistance) return hit.cell;
    return firstGround;
  }

  function pickCellAtScreen(sx, sy) {
    return rayCell(angleForScreenX(sx), 3.4);
  }

  function mobAtScreen(sx, sy) {
    let best = null;
    let bestDistance = Infinity;
    const focal = focalLength();
    const horizon = horizonY();
    for (const mob of mobs) {
      if (!mob.alive) continue;
      const cell = cellAt(mob.x, mob.y);
      const p = project(mob.x, mob.y, (cell ? cell.elevation : 0) + 0.36);
      if (p.depth <= 0.1 || Math.abs(p.x - sx) > Math.max(22, focal * 0.55 / p.depth)) continue;
      const spriteHeight = Math.min(height * 1.4, focal * 0.8 / p.depth);
      const groundY = horizon + (cameraWorldZ() - (cell ? cell.elevation : 0) - 0.04) * focal / p.depth;
      const topY = groundY - spriteHeight;
      if (sy < topY - 8 || sy > groundY + 8) continue;
      const dx = (sx - p.x) / Math.max(1, spriteHeight * 0.58);
      const dy = (sy - (topY + spriteHeight * 0.58)) / Math.max(1, spriteHeight * 0.58);
      const d = dx * dx + dy * dy;
      if (d < 1.15 && d < bestDistance) { best = mob; bestDistance = d; }
    }
    return best;
  }

  function worldDistanceToCell(cell) {
    if (!cell || !player) return Infinity;
    return Math.hypot(player.x - (cell.x + 0.5), player.y - (cell.y + 0.5));
  }

  function getFrontCell() {
    return player ? rayCell(player.angle, 3.4) : null;
  }

  function actionCell() {
    if (mouse.inCanvas) {
      const picked = mouse.type === 'touch' && mouse.touchTarget
        ? cellXY(mouse.touchTarget.x, mouse.touchTarget.y)
        : pickCellAtScreen(mouse.x, mouse.y);
      if (picked && worldDistanceToCell(picked) <= 3.4) return picked;
    }
    return getFrontCell();
  }

  function addToast(message, warning = false) {
    toastEl.textContent = message;
    toastEl.classList.toggle('warn', warning);
    toastEl.classList.add('show');
    toastTimer = 1.55;
  }

  function award(points, label, position, color = '#d5ff8b') {
    if (!currentSession) return;
    const now = currentSession.time;
    currentSession.combo = now - currentSession.lastScoreAt < 4.6 ? currentSession.combo + 1 : 1;
    currentSession.lastScoreAt = now;
    const multiplier = Math.min(4, 1 + Math.floor((currentSession.combo - 1) / 3));
    const total = points * multiplier;
    currentSession.score += total;
    const p = position || { x: player.x, y: player.y };
    floaters.push({ x: p.x, y: p.y, z: (cellAt(p.x, p.y)?.elevation || 0) + 1.1, text: `+${total}${multiplier > 1 ? `  ×${multiplier}` : ''}`, color, life: 0.78 });
    if (label) addToast(`${label}${multiplier > 1 ? `  ·  COMBO ×${multiplier}` : ''}`);
    playSound('score');
    uiTimer = 0;
  }

  function blockColorsFor(type) {
    const block = BLOCK_BY_ID[type] || BLOCK_BY_ID.dirt;
    return [block.accent, block.top, block.left, block.right];
  }

  function spawnBurst(x, y, type, count = 10, upward = 1.4) {
    const palette = blockColorsFor(type);
    const ground = cellAt(x, y);
    const baseZ = ground ? ground.elevation + ground.blocks.length * 0.2 + 0.4 : 0.7;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 0.34,
        y: y + (Math.random() - 0.5) * 0.34,
        z: baseZ + Math.random() * 0.22,
        vx: (Math.random() - 0.5) * 2.3,
        vy: (Math.random() - 0.5) * 2.3,
        vz: upward * (0.45 + Math.random() * 1.1),
        size: Math.max(2, tileW * (0.075 + Math.random() * 0.07)),
        color: palette[Math.floor(Math.random() * palette.length)],
        life: 0.45 + Math.random() * 0.35,
        maxLife: 0.8
      });
    }
  }

  function mineTarget() {
    if (state !== 'playing' || !player || currentSession.time - lastMineAt < 0.22) return;
    const cell = actionCell();
    if (!cell || cell.water || worldDistanceToCell(cell) > 3.4) {
      addToast('TOO FAR TO REACH', true);
      return;
    }
    lastMineAt = currentSession.time;
    player.swing = 0.22;
    const cx = cell.x + 0.5;
    const cy = cell.y + 0.5;

    if (cell.prop) {
      const prop = cell.prop;
      prop.hp -= 1;
      prop.flash = 0.2;
      const dropType = prop.kind === 'tree' ? 'wood' : prop.kind === 'crystal' ? 'crystal' : 'stone';
      spawnBurst(cx, cy, dropType, prop.hp <= 0 ? 12 : 6, 1.25);
      bumpShake(prop.hp <= 0 ? 3.8 : 1.4);
      if (prop.hp > 0) {
        award(12, prop.kind === 'tree' ? 'CHOP!' : prop.kind === 'crystal' ? 'ORE HIT!' : 'CRACK!', { x: cx, y: cy }, '#e6f5bf');
        playSound('hit');
      } else {
        const amount = prop.kind === 'tree' ? 3 : prop.kind === 'crystal' ? 1 : 2;
        inventory[dropType] = (inventory[dropType] || 0) + amount;
        const leafDrop = prop.kind === 'tree' ? 2 : 0;
        if (leafDrop) inventory.leaves = (inventory.leaves || 0) + leafDrop;
        cell.prop = null;
        currentSession.blocks += amount + leafDrop;
        const dropLabel = leafDrop ? `+${amount} WOOD · +${leafDrop} LEAVES` : `+${amount} ${dropType.toUpperCase()}`;
        award(prop.kind === 'crystal' ? 62 : 46, `${prop.kind.toUpperCase()} BROKEN · ${dropLabel}`, { x: cx, y: cy }, prop.kind === 'crystal' ? '#aafff0' : '#d5ff8b');
        playSound('break');
      }
      updateUi(true);
      return;
    }

    if (cell.blocks.length) {
      const type = cell.blocks.pop();
      inventory[type] = (inventory[type] || 0) + 1;
      currentSession.blocks++;
      cell.harvested = false;
      spawnBurst(cx, cy, type, 11, 1.35);
      bumpShake(2.5);
      award(24, `${BLOCK_BY_ID[type]?.name.toUpperCase() || 'BLOCK'} MINED · +1`, { x: cx, y: cy });
      playSound('break');
      updateUi(true);
      return;
    }

    if (!cell.harvested) {
      const type = cell.type === 'sand' ? 'sand' : cell.type === 'stoneground' ? 'stone' : cell.type === 'dirtground' ? 'dirt' : 'grass';
      cell.harvested = true;
      inventory[type] = (inventory[type] || 0) + 1;
      currentSession.blocks++;
      spawnBurst(cx, cy, type, 8, 0.9);
      bumpShake(1.45);
      award(10, `${BLOCK_BY_ID[type].name.toUpperCase()} +1`, { x: cx, y: cy });
      playSound('mine');
      updateUi(true);
    } else {
      addToast('PATCH ALREADY MINED · FIND A PROP', true);
      playSound('miss');
    }
  }

  function nearestMob(maxDistance = 2.35, from = player) {
    let best = null;
    let bestScore = Infinity;
    for (const mob of mobs) {
      if (!mob.alive) continue;
      const dx = mob.x - from.x;
      const dy = mob.y - from.y;
      const distance = Math.hypot(dx, dy);
      if (distance > maxDistance || distance < 0.01) continue;
      const aim = from.angle == null ? player.angle : from.angle;
      const angle = normalizeAngle(Math.atan2(dy, dx) - aim);
      if (Math.abs(angle) > 1.0) continue;
      const wall = castMapRay(aim + angle, distance);
      if (wall && !wall.boundary && wall.distance < distance - 0.48) continue;
      const score = distance + Math.abs(angle) * 1.5;
      if (score < bestScore) { bestScore = score; best = mob; }
    }
    return best;
  }

  function attackTarget(target = null) {
    if (state !== 'playing' || !player || currentSession.time - lastAttackAt < 0.28) return;
    const weapon = GEAR_BY_ID[equipment.weapon];
    const damage = weapon ? weapon.damage : 1;
    const reach = weapon ? weapon.reach : 3.0;
    const mob = target && target.alive ? target : nearestMob(reach);
    player.swing = 0.23;
    lastAttackAt = currentSession.time;
    if (!mob) {
      addToast('NO SLIME IN REACH · TURN OR MOVE CLOSER', true);
      playSound('swing');
      return;
    }
    const dx = mob.x - player.x;
    const dy = mob.y - player.y;
    const distance = Math.hypot(dx, dy);
    if (distance > reach + 0.12) {
      addToast('SLIME TOO FAR AWAY', true);
      playSound('miss');
      return;
    }
    player.angle = Math.atan2(dy, dx);
    player.faceX = Math.cos(player.angle);
    player.faceY = Math.sin(player.angle);
    mob.hp -= damage;
    mob.hitFlash = 0.18;
    mob.knockX = distance ? dx / distance * 0.75 : 0.4;
    mob.knockY = distance ? dy / distance * 0.75 : 0;
    spawnBurst(mob.x, mob.y, mob.kind === 'ember' ? 'brick' : 'grass', mob.hp <= 0 ? 14 : 7, 1.35);
    bumpShake(mob.hp <= 0 ? 4.4 : 2.3);
    playSound(mob.hp <= 0 ? 'break' : 'hit');
    if (mob.hp <= 0) {
      mob.alive = false;
      mob.respawnAt = currentSession.time + 10 + Math.random() * 6;
      currentSession.kills++;
      const drop = mob.kind === 'ember' ? 'brick' : 'crystal';
      if (mode === 'survival') inventory[drop] = (inventory[drop] || 0) + 1;
      award(100, `${mob.kind === 'ember' ? 'EMBER' : 'SLIME'} SPLAT · +1 ${drop.toUpperCase()}`, { x: mob.x, y: mob.y }, mob.kind === 'ember' ? '#ffd58c' : '#aaff98');
    } else {
      const weaponLabel = weapon ? ` · ${weapon.name.toUpperCase()}` : '';
      award(18, `NICE HIT${weaponLabel}!`, { x: mob.x, y: mob.y }, weapon ? weapon.tint : '#ffe298');
    }
    updateUi(true);
  }

  function placeBlock() {
    if (state !== 'playing' || !player || currentSession.time - lastBuildAt < 0.18) return;
    const cell = actionCell();
    if (!cell || cell.water || worldDistanceToCell(cell) > 3.4) {
      addToast('NO BUILD SPOT IN REACH', true);
      return;
    }
    const underPlayer = Math.hypot(player.x - (cell.x + 0.5), player.y - (cell.y + 0.5)) < 0.8;
    if (underPlayer || cell.prop || cell.blocks.length >= 4) {
      addToast(cell.prop ? 'CLEAR THE PROP FIRST' : 'BLOCKED · PICK ANOTHER TILE', true);
      playSound('miss');
      return;
    }
    const block = BLOCKS[selectedBlock];
    if (mode === 'survival' && (inventory[block.id] || 0) <= 0) {
      addToast(`OUT OF ${block.name.toUpperCase()} · MINE A BLOCK`, true);
      playSound('miss');
      return;
    }
    lastBuildAt = currentSession.time;
    if (mode === 'survival') inventory[block.id]--;
    cell.blocks.push(block.id);
    cell.pop = 0.2;
    currentSession.blocks++;
    spawnBurst(cell.x + 0.5, cell.y + 0.5, block.id, 8, 0.8);
    bumpShake(1.35);
    award(6, `${block.name.toUpperCase()} PLACED`, { x: cell.x + 0.5, y: cell.y + 0.5 });
    playSound('place');
    updateUi(true);
  }

  function toggleFlight() {
    if (state !== 'playing' || mode !== 'creative' || !player) return;
    player.flying = !player.flying;
    if (!player.flying) addToast('FLIGHT OFF · DESCENDING', true);
    else {
      player.altitude = Math.max(player.altitude, 0.55);
      addToast('FLIGHT ON · SPACE UP · SHIFT DOWN');
    }
    playSound('start');
    updateUi(true);
  }

  function damagePlayer(source) {
    if (mode === 'creative' || player.invulnerable > 0 || state !== 'playing') return;
    const protection = armorProtection();
    const damage = Math.max(0.25, 1 - protection);
    player.health = Math.max(0, player.health - damage);
    player.invulnerable = 1.05;
    player.hitFlash = 0.24;
    stage.classList.remove('is-hit');
    void stage.offsetWidth;
    stage.classList.add('is-hit');
    window.setTimeout(() => stage.classList.remove('is-hit'), 240);
    bumpShake(8.5);
    if (source) {
      const dx = player.x - source.x;
      const dy = player.y - source.y;
      const d = Math.max(0.01, Math.hypot(dx, dy));
      player.attackPush.x = dx / d * 1.3;
      player.attackPush.y = dy / d * 1.3;
      spawnBurst(player.x, player.y, 'brick', 8, 1.2);
    }
    const hitMessage = protection > 0 ? `ARMOR BLOCKED ${Math.round(protection * 100)}% · WATCH YOUR HEARTS` : 'OUCH! WATCH YOUR HEARTS';
    addToast(player.health > 0 ? hitMessage : 'THE SLIMES GOT YOU', true);
    playSound('hurt');
    updateUi(true);
    if (player.health <= 0) endRun();
  }

  function endRun() {
    if (state !== 'playing') return;
    if (document.pointerLockElement === canvas) document.exitPointerLock?.();
    state = 'gameover';
    stage.classList.remove('is-live');
    saveRun();
    $('#final-score').textContent = formatScore(currentSession.score);
    $('#final-detail').textContent = `DAY ${String(Math.floor(currentSession.time / 80) + 1).padStart(2, '0')} · ${currentSession.kills} SLIMES · ${currentSession.blocks} BLOCKS`;
    setScreen(gameoverScreen);
    renderHighScores($('#end-scores'), 5);
    updateUi(true);
    headerMode.textContent = 'RUN COMPLETE';
    gameoverScreen.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => $('[data-restart]', gameoverScreen)?.focus());
  }

  function bumpShake(amount) {
    screenShake = Math.max(screenShake, amount);
  }

  function canWalkAt(x, y, previousX, previousY, forMob = false) {
    const cell = cellAt(x, y);
    if (!cell || cell.water || cell.prop) return false;
    const previous = cellAt(previousX, previousY);
    if (previous && Math.abs(cell.elevation - previous.elevation) > 1) return false;
    if (!forMob && cell.blocks.length >= 1) return false;
    return true;
  }

  function moveActor(actor, dx, dy, dt, speed, isMob = false) {
    const nextX = actor.x + dx * speed * dt;
    const nextY = actor.y + dy * speed * dt;
    if (canWalkAt(nextX, nextY, actor.x, actor.y, isMob)) {
      actor.x = nextX;
      actor.y = nextY;
      return true;
    }
    let moved = false;
    if (dx && canWalkAt(nextX, actor.y, actor.x, actor.y, isMob)) { actor.x = nextX; moved = true; }
    if (dy && canWalkAt(actor.x, nextY, actor.x, actor.y, isMob)) { actor.y = nextY; moved = true; }
    return moved;
  }

  function movementInput() {
    const activeMoves = Array.from(touchDirections.values());
    if (activeMoves.length && mouse.type === 'touch') {
      mouse.touchTarget = null;
      mouse.inCanvas = false;
    }
    let forward = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0);
    let strafe = (keys.has('KeyD') ? 1 : 0) - (keys.has('KeyA') ? 1 : 0);
    let turn = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0);
    if (activeMoves.includes('up')) forward++;
    if (activeMoves.includes('down')) forward--;
    if (activeMoves.includes('left')) turn--;
    if (activeMoves.includes('right')) turn++;
    forward = Math.max(-1, Math.min(1, forward));
    strafe = Math.max(-1, Math.min(1, strafe));
    turn = Math.max(-1, Math.min(1, turn));
    const length = Math.hypot(forward, strafe);
    if (length > 1) { forward /= length; strafe /= length; }
    const vertical = mode === 'creative' && player && player.flying
      ? (keys.has('Space') ? 1 : 0) - (keys.has('ShiftLeft') || keys.has('ShiftRight') ? 1 : 0)
      : 0;
    return { forward, strafe, turn, vertical };
  }

  function update(dt, now) {
    if (inventoryOpen) return;
    if (state !== 'playing' || !currentSession) {
      camera.x += ((player ? player.x : WORLD_SIZE / 2) + Math.sin(now * 0.12) * 0.42 - camera.x) * Math.min(1, dt * 0.42);
      camera.y += ((player ? player.y : WORLD_SIZE / 2) + Math.cos(now * 0.1) * 0.3 - camera.y) * Math.min(1, dt * 0.42);
      return;
    }

    currentSession.time += dt;
    currentSession.day = Math.floor(currentSession.time / 80) + 1;
    currentSession.scoreTick += dt;
    if (currentSession.scoreTick >= 1) {
      currentSession.score += 2 * Math.floor(currentSession.scoreTick);
      currentSession.scoreTick %= 1;
      uiTimer = 0;
    }

    const input = movementInput();
    player.angle = normalizeAngle(player.angle + input.turn * dt * 2.65);
    player.faceX = Math.cos(player.angle);
    player.faceY = Math.sin(player.angle);
    let moveX = player.faceX * input.forward - player.faceY * input.strafe;
    let moveY = player.faceY * input.forward + player.faceX * input.strafe;
    const moveLength = Math.hypot(moveX, moveY);
    if (moveLength > 1) { moveX /= moveLength; moveY /= moveLength; }
    player.moving = moveLength > 0.01;
    if (player.moving) {
      if (mode === 'creative' && player.flying) {
        player.x = Math.max(0.15, Math.min(WORLD_SIZE - 0.15, player.x + moveX * 4.15 * dt));
        player.y = Math.max(0.15, Math.min(WORLD_SIZE - 0.15, player.y + moveY * 4.15 * dt));
      } else {
        moveActor(player, moveX, moveY, dt, 4.15, false);
      }
      player.walk += dt;
    } else {
      player.walk += dt * 0.4;
    }
    if (mode === 'creative') {
      if (player.flying) player.altitude = Math.max(0, Math.min(8, player.altitude + input.vertical * 4.4 * dt));
      else player.altitude = Math.max(0, player.altitude - 4.8 * dt);
    }
    if (player.attackPush.x || player.attackPush.y) {
      const moved = moveActor(player, player.attackPush.x, player.attackPush.y, dt, 1, false);
      player.attackPush.x *= Math.max(0, 1 - dt * 4.5);
      player.attackPush.y *= Math.max(0, 1 - dt * 4.5);
      if (!moved) { player.attackPush.x = 0; player.attackPush.y = 0; }
    }
    player.swing = Math.max(0, player.swing - dt);
    player.hitFlash = Math.max(0, player.hitFlash - dt);
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    camera.x += (player.x - camera.x) * Math.min(1, dt * 8);
    camera.y += (player.y - camera.y) * Math.min(1, dt * 8);

    let liveCount = 0;
    for (const mob of mobs) {
      if (!mob.alive) {
        if (mob.respawnAt && currentSession.time >= mob.respawnAt && liveCount < 5) {
          const p = pickSpawnCell(6, 10, mobs.filter(m => m.alive));
          Object.assign(mob, makeMob(p, mob.kind));
        }
        continue;
      }
      liveCount++;
      mob.bob += dt * 3.1;
      mob.hitFlash = Math.max(0, mob.hitFlash - dt);
      let dx = 0;
      let dy = 0;
      const toPlayerX = player.x - mob.x;
      const toPlayerY = player.y - mob.y;
      const distance = Math.hypot(toPlayerX, toPlayerY);
      if (mode === 'survival' && distance < 8.7) {
        const divisor = Math.max(0.01, distance);
        dx = toPlayerX / divisor;
        dy = toPlayerY / divisor;
      } else {
        mob.think -= dt;
        if (mob.think <= 0) {
          const angle = Math.random() * Math.PI * 2;
          mob.wanderX = Math.cos(angle);
          mob.wanderY = Math.sin(angle);
          mob.think = 0.7 + Math.random() * 1.7;
        }
        dx = mob.wanderX;
        dy = mob.wanderY;
      }
      const length = Math.hypot(dx, dy);
      if (length > 0) { dx /= length; dy /= length; }
      const knockLen = Math.hypot(mob.knockX, mob.knockY);
      if (knockLen > 0.05) {
        const pushed = moveActor(mob, mob.knockX, mob.knockY, dt, 1.4, true);
        mob.knockX *= Math.max(0, 1 - dt * 6);
        mob.knockY *= Math.max(0, 1 - dt * 6);
        if (!pushed) { mob.knockX = 0; mob.knockY = 0; }
      } else if (distance > 0.82 || mode === 'creative') {
        moveActor(mob, dx, dy, dt, mode === 'survival' && distance < 8.7 ? 1.22 : 0.42, true);
      }
      if (mode === 'survival' && distance < 0.82 && currentSession.time >= mob.biteAt) {
        mob.biteAt = currentSession.time + 1.35;
        damagePlayer(mob);
        if (state !== 'playing') break;
      }
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0 && liveCount < 4 && mode === 'survival') {
      const p = pickSpawnCell(7.5, 11, mobs.filter(m => m.alive));
      mobs.push(makeMob(p));
      spawnTimer = 13 + Math.random() * 6;
    }
    for (const cell of sortedCells) if (cell.pop > 0) cell.pop = Math.max(0, cell.pop - dt);
    screenShake = Math.max(0, screenShake - dt * 24);
    if (toastTimer > 0) {
      toastTimer -= dt;
      if (toastTimer <= 0) toastEl.classList.remove('show');
    }
    if (state === 'playing' && (now - lastUi > 110 || uiTimer === 0)) updateUi();

    // Touch buttons repeat gently while held so mining does not require frantic tapping.
    if (touchActions.size) {
      touchRepeat -= dt;
      if (touchRepeat <= 0) {
        const action = Array.from(touchActions.values())[0];
        if (action === 'mine') mineTarget();
        else if (action === 'attack') attackTarget();
        touchRepeat = action === 'build' ? 0.45 : 0.34;
      }
    }
  }

  function formatScore(value) {
    return Math.floor(value || 0).toString().padStart(6, '0');
  }

  function gearCount(id) {
    return gearInventory[id] || 0;
  }

  function armorProtection() {
    return GEAR.filter(item => item.slot !== 'weapon' && equipment[item.slot] === item.id)
      .reduce((total, item) => total + item.protection, 0);
  }

  function canCraftGear(item) {
    if (mode === 'creative') return true;
    return Object.entries(item.recipe).every(([blockId, amount]) => {
      const count = inventory[blockId] || 0;
      return count === Infinity || count >= amount;
    });
  }

  function recipeCostLabel(recipe) {
    return Object.entries(recipe).map(([blockId, amount]) => `${BLOCK_BY_ID[blockId].name} ×${amount}`).join(' · ');
  }

  function gearStatLabel(item) {
    return item.slot === 'weapon'
      ? `${item.damage.toFixed(1)} DMG · ${item.reach.toFixed(1)} REACH`
      : `${Math.round(item.protection * 100)}% DAMAGE REDUCTION`;
  }

  function renderInventory() {
    const blockCards = BLOCKS.map((block, index) => {
      const count = inventory[block.id] === Infinity ? '∞' : String(inventory[block.id] || 0);
      return `<button class="inventory-item-card block-item-card${index === selectedBlock ? ' selected' : ''}" type="button" data-inventory-block="${index}" aria-pressed="${index === selectedBlock}" aria-label="Select ${block.name}, ${count} available">
        <span class="inventory-block-icon" style="--block-top:${block.top};--block-left:${block.left};--block-right:${block.right}"><i></i></span>
        <span class="inventory-item-copy"><strong>${block.name}</strong><small>BLOCK</small></span><span class="inventory-stack">${count}</span>
      </button>`;
    }).join('');
    const gearCards = GEAR.map(item => {
      const count = gearCount(item.id);
      const countLabel = count === Infinity ? '∞' : String(count);
      const equipped = equipment[item.slot] === item.id;
      const stats = gearStatLabel(item);
      return `<article class="inventory-item-card gear-item-card${equipped ? ' equipped' : ''}${count === 0 ? ' empty' : ''}">
        <span class="inventory-gear-icon" style="--gear-tint:${item.tint}">${item.glyph}</span>
        <span class="inventory-item-copy"><strong>${item.name}</strong><small>${stats}</small></span>
        <span class="inventory-stack">${countLabel}</span>
        <button class="gear-action" type="button" data-equip-gear="${item.id}" ${count === 0 || equipped ? 'disabled' : ''}>${equipped ? 'ON' : 'EQUIP'}</button>
      </article>`;
    }).join('');
    inventoryItemsEl.innerHTML = blockCards + gearCards;

    equipmentSlotsEl.innerHTML = GEAR_SLOTS.map(slot => {
      const item = GEAR_BY_ID[equipment[slot.id]];
      const glyph = item ? item.glyph : (slot.id === 'weapon' ? '⚔' : '◌');
      const value = item ? gearStatLabel(item) : (slot.id === 'weapon' ? '1.0 DMG · FISTS' : 'EMPTY SLOT');
      return `<div class="equipment-slot${item ? ' occupied' : ''}">
        <span class="equipment-glyph" style="--gear-tint:${item ? item.tint : '#849488'}">${glyph}</span>
        <span class="equipment-copy"><small>${slot.name.toUpperCase()}</small><strong>${item ? item.name : slot.id === 'weapon' ? 'Unarmed' : 'Empty'}</strong><em>${value}</em></span>
        <button class="equipment-remove" type="button" data-unequip-slot="${slot.id}" aria-label="Unequip ${slot.name}" ${item ? '' : 'disabled'}>×</button>
      </div>`;
    }).join('');
    const armor = Math.round(armorProtection() * 100);
    armorRatingEl.textContent = armor ? `ARMOR ${armor}% · DAMAGE REDUCED` : 'ARMOR 0% · NO PROTECTION';
    armorRatingEl.classList.toggle('protected', armor > 0);

    craftingListEl.innerHTML = GEAR.map(item => {
      const ready = canCraftGear(item);
      return `<article class="craft-row">
        <span class="craft-glyph" style="--gear-tint:${item.tint}">${item.glyph}</span>
        <span class="craft-copy"><strong>${item.name}</strong><small>${mode === 'creative' ? 'CREATIVE · FREE GEAR' : recipeCostLabel(item.recipe)}</small></span>
        <button class="craft-button" type="button" data-craft-gear="${item.id}" ${ready ? '' : 'disabled'}>${mode === 'creative' ? 'TAKE' : ready ? 'CRAFT' : 'NEED ITEMS'}</button>
      </article>`;
    }).join('');

    $$('[data-inventory-block]', inventoryItemsEl).forEach(button => button.addEventListener('click', () => selectBlock(Number(button.dataset.inventoryBlock))));
    $$('[data-equip-gear]', inventoryItemsEl).forEach(button => button.addEventListener('click', () => equipGear(button.dataset.equipGear)));
    $$('[data-craft-gear]', craftingListEl).forEach(button => button.addEventListener('click', () => craftGear(button.dataset.craftGear)));
    $$('[data-unequip-slot]', equipmentSlotsEl).forEach(button => button.addEventListener('click', () => unequipGear(button.dataset.unequipSlot)));
  }

  function equipGear(id) {
    const item = GEAR_BY_ID[id];
    if (!item || (gearCount(id) !== Infinity && gearCount(id) <= 0)) return;
    equipment[item.slot] = id;
    addToast(`${item.name.toUpperCase()} EQUIPPED`);
    renderInventory();
    updateUi(true);
  }

  function unequipGear(slot) {
    if (!GEAR_SLOTS.some(entry => entry.id === slot) || !equipment[slot]) return;
    const item = GEAR_BY_ID[equipment[slot]];
    equipment[slot] = null;
    addToast(`${item ? item.name.toUpperCase() : slot.toUpperCase()} UNEQUIPPED`);
    renderInventory();
    updateUi(true);
  }

  function craftGear(id) {
    const item = GEAR_BY_ID[id];
    if (!item) return;
    if (mode === 'creative') {
      equipGear(id);
      return;
    }
    if (!canCraftGear(item)) {
      addToast('NOT ENOUGH MATERIALS TO CRAFT THAT', true);
      return;
    }
    for (const [blockId, amount] of Object.entries(item.recipe)) {
      if (inventory[blockId] !== Infinity) inventory[blockId] -= amount;
    }
    gearInventory[id] = gearCount(id) + 1;
    addToast(`${item.name.toUpperCase()} CRAFTED`);
    renderInventory();
    updateUi(true);
  }

  function openInventory() {
    if (state !== 'playing' || inventoryOpen) return;
    inventoryOpen = true;
    clearInput();
    if (document.pointerLockElement === canvas) document.exitPointerLock?.();
    inventoryScreen.classList.add('active');
    inventoryScreen.setAttribute('aria-hidden', 'false');
    inventoryButton.setAttribute('aria-label', 'Close inventory');
    inventoryButton.title = 'Close inventory (I or Esc)';
    renderInventory();
    inventoryCloseButton.focus();
  }

  function closeInventory() {
    if (!inventoryOpen) return;
    inventoryOpen = false;
    inventoryScreen.classList.remove('active');
    inventoryScreen.setAttribute('aria-hidden', 'true');
    inventoryButton.setAttribute('aria-label', 'Open inventory');
    inventoryButton.title = 'Inventory (I)';
    canvas.focus({ preventScroll: true });
  }

  function toggleInventory() {
    if (inventoryOpen) closeInventory();
    else openInventory();
  }

  function updateUi(force = false) {
    if (!currentSession) return;
    const now = performance.now();
    if (!force && now - lastUi < 90) return;
    lastUi = now;
    uiTimer = 1;
    scoreEl.textContent = formatScore(currentSession.score);
    scoreBestEl.textContent = `BEST ${formatScore(getBestScore())}`;
    const mins = Math.floor(currentSession.time / 60).toString().padStart(2, '0');
    const secs = Math.floor(currentSession.time % 60).toString().padStart(2, '0');
    worldClockEl.textContent = `DAY ${String(currentSession.day).padStart(2, '0')} · ${mins}:${secs}`;
    flightStatus.hidden = !(mode === 'creative' && player.flying);
    heartsEl.innerHTML = Array.from({ length: MAX_HEALTH }, (_, i) => {
      const fill = Math.max(0, Math.min(1, player.health - i));
      const kind = fill <= 0 ? ' empty' : fill < 1 ? ' partial' : '';
      return `<span class="heart${kind}" style="--heart-fill:${Math.round(fill * 100)}%">${fill <= 0 ? '♡' : '♥'}</span>`;
    }).join('');
    const healthLabel = Number.isInteger(player.health) ? player.health : player.health.toFixed(1);
    heartsEl.setAttribute('aria-label', `${healthLabel} of ${MAX_HEALTH} hearts`);
    $$('.hotbar-slot', hotbar).forEach((button, index) => {
      const item = BLOCKS[index];
      button.setAttribute('aria-pressed', String(index === selectedBlock));
      const count = inventory[item.id];
      const countEl = $('.hotbar-count', button);
      countEl.textContent = count === Infinity ? '∞' : String(count || 0);
      button.classList.toggle('empty', count !== Infinity && (count || 0) <= 0);
    });
    headerMode.textContent = `${mode.toUpperCase()} · DAY ${String(currentSession.day).padStart(2, '0')}`;
    if (state === 'paused') $('#pause-score').textContent = formatScore(currentSession.score);
  }

  function getRecords() {
    try {
      const records = JSON.parse(localStorage.getItem(RECORD_KEY) || '[]');
      return Array.isArray(records) ? records.filter(r => r && Number.isFinite(Number(r.score))) : [];
    } catch (_) { return []; }
  }

  function getBestScore() {
    return getRecords().reduce((best, record) => Math.max(best, Number(record.score) || 0), 0);
  }

  function saveRun() {
    if (!currentSession || currentSession.highSaved || currentSession.score <= 0) return;
    currentSession.highSaved = true;
    const record = {
      score: Math.floor(currentSession.score),
      mode: currentSession.mode,
      date: new Date().toISOString(),
      kills: currentSession.kills,
      blocks: currentSession.blocks
    };
    const records = getRecords();
    records.push(record);
    records.sort((a, b) => Number(b.score) - Number(a.score) || new Date(b.date || 0) - new Date(a.date || 0));
    try { localStorage.setItem(RECORD_KEY, JSON.stringify(records.slice(0, 8))); } catch (_) {}
    renderHighScores($('#start-scores'), 5);
    renderHighScores($('#end-scores'), 5);
    headerBest.textContent = formatScore(getBestScore());
    scoreBestEl.textContent = `BEST ${formatScore(getBestScore())}`;
  }

  function dateLabel(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return 'RECENT RUN';
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date).toUpperCase();
  }

  function renderHighScores(target, limit) {
    if (!target) return;
    const records = getRecords().sort((a, b) => Number(b.score) - Number(a.score)).slice(0, limit);
    if (!records.length) {
      target.innerHTML = '<div class="score-empty">NO RUNS YET<br>MAKE THE FIRST HIGH SCORE.</div>';
      return;
    }
    target.innerHTML = records.map((record, index) => `<div class="score-row"><span class="score-rank">${String(index + 1).padStart(2, '0')}</span><span><span class="score-mode">${record.mode === 'creative' ? 'Creative' : 'Survival'}</span><span class="score-date">${dateLabel(record.date)}</span></span><strong class="score-value">${formatScore(record.score)}</strong></div>`).join('');
  }

  function setScreen(screen) {
    if (inventoryOpen) closeInventory();
    [startScreen, pauseScreen, gameoverScreen].forEach(el => {
      const active = el === screen;
      el.classList.toggle('active', active);
      el.setAttribute('aria-hidden', String(!active));
    });
  }

  function startGame(nextMode) {
    mode = nextMode === 'creative' ? 'creative' : 'survival';
    resetRun(true);
    state = 'playing';
    gameHud.classList.remove('is-hidden');
    stage.classList.add('is-live');
    setScreen(null);
    headerMode.textContent = `${mode.toUpperCase()} · DAY 01`;
    $('#sound-toggle').classList.toggle('muted', !soundEnabled);
    initializeHotbar();
    updateUi(true);
    addToast(mode === 'survival' ? 'SLIMES INCOMING · I: INVENTORY · F: MINE' : 'CREATIVE · I: INVENTORY · DOUBLE-SPACE TO FLY');
    playSound('start');
    canvas.focus({ preventScroll: true });
  }

  function pauseGame() {
    if (inventoryOpen) closeInventory();
    if (state === 'playing') {
      if (document.pointerLockElement === canvas) document.exitPointerLock?.();
      state = 'paused';
      $('#pause-score').textContent = formatScore(currentSession.score);
      setScreen(pauseScreen);
      pauseScreen.setAttribute('aria-hidden', 'false');
      requestAnimationFrame(() => $('[data-resume]', pauseScreen)?.focus());
    } else if (state === 'paused') {
      resumeGame();
    }
  }

  function resumeGame() {
    if (state !== 'paused') return;
    state = 'playing';
    setScreen(null);
    canvas.focus({ preventScroll: true });
  }

  function backToMenu() {
    if (currentSession) saveRun();
    state = 'menu';
    mode = 'survival';
    gameHud.classList.add('is-hidden');
    stage.classList.remove('is-live');
    generateWorld(Math.random() * 100000);
    player = newPlayer();
    camera = { x: player.x, y: player.y };
    mobs = [];
    for (let i = 0; i < 3; i++) mobs.push(makeMob(pickSpawnCell(5.5, 9.5, mobs)));
    particles = [];
    floaters = [];
    setScreen(startScreen);
    headerMode.textContent = 'READY TO PLAY';
    renderHighScores($('#start-scores'), 5);
    headerBest.textContent = formatScore(getBestScore());
  }

  function initializeHotbar() {
    hotbar.innerHTML = BLOCKS.map((block, index) => `<button class="hotbar-slot" type="button" data-slot="${index}" aria-label="Select ${block.name}" aria-pressed="${index === selectedBlock}"><span class="block-icon" style="--block-top:${block.top};--block-left:${block.left};--block-right:${block.right}"><i></i></span><span class="hotbar-name">${block.name.toUpperCase()}</span><span class="hotbar-count">0</span><span class="hotbar-key">${index + 1}</span></button>`).join('');
    $$('.hotbar-slot', hotbar).forEach(button => button.addEventListener('click', () => selectBlock(Number(button.dataset.slot))));
  }

  function selectBlock(index) {
    if (!BLOCKS[index]) return;
    selectedBlock = index;
    $$('.hotbar-slot', hotbar).forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (inventoryOpen) $$('[data-inventory-block]', inventoryItemsEl).forEach((button, i) => {
      button.classList.toggle('selected', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    if (state === 'playing') addToast(`${BLOCKS[index].name.toUpperCase()} SELECTED`);
    updateUi(true);
  }

  function beginAudio() {
    if (!soundEnabled) return;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    if (!audioContext) {
      try { audioContext = new AudioCtor(); } catch (_) { audioContext = null; }
    }
    if (audioContext && audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  }

  function playSound(type) {
    if (!soundEnabled) return;
    beginAudio();
    if (!audioContext) return;
    const presets = {
      start: [520, 780, 0.11], mine: [280, 180, 0.075], hit: [220, 115, 0.1],
      break: [410, 820, 0.14], place: [330, 500, 0.08], swing: [390, 260, 0.07],
      score: [580, 900, 0.09], miss: [150, 120, 0.08], hurt: [120, 65, 0.2]
    };
    const [from, to, duration] = presets[type] || presets.mine;
    try {
      const now = audioContext.currentTime;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(from, now);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, to), now + duration);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (_) { /* Audio is a bonus; never interrupt play if it is unavailable. */ }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    soundButton.classList.toggle('muted', !soundEnabled);
    soundButton.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Enable sound');
    try { localStorage.setItem(SOUND_KEY, soundEnabled ? 'on' : 'off'); } catch (_) {}
    if (soundEnabled) { beginAudio(); playSound('place'); }
  }

  function requestMouseLook(showFallback = true) {
    if (document.pointerLockElement === canvas) return;
    if (!canvas.requestPointerLock) {
      if (showFallback) addToast('DRAG TO LOOK · OR USE ARROW KEYS');
      return;
    }
    try {
      const result = canvas.requestPointerLock();
      if (result && typeof result.catch === 'function') {
        result.catch(() => {
          if (showFallback) addToast('MOUSE LOOK UNAVAILABLE · DRAG TO TURN', true);
        });
      }
    } catch (_) {
      if (showFallback) addToast('MOUSE LOOK UNAVAILABLE · DRAG TO TURN', true);
    }
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  canvas.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { mouse.inCanvas = true; mouse.type = 'mouse'; }
  });
  canvas.addEventListener('pointerleave', event => {
    if (event.pointerType === 'mouse' && !mouse.dragging && document.pointerLockElement !== canvas) mouse.inCanvas = false;
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse') {
      const p = canvasPoint(event);
      if (document.pointerLockElement === canvas) {
        player.angle = normalizeAngle(player.angle + (event.movementX || 0) * 0.0028);
        adjustPitch(event.movementY || 0, 0.0022);
      } else if (mouse.dragging && state === 'playing') {
        player.angle = normalizeAngle(player.angle + (p.x - mouse.lastX) * 0.007);
        adjustPitch(p.y - mouse.lastY, 0.005);
      }
      mouse.lastX = p.x;
      mouse.lastY = p.y;
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.inCanvas = true;
      mouse.type = 'mouse';
    } else if (event.pointerType === 'touch' && event.buttons) {
      const p = canvasPoint(event);
      const dx = p.x - mouse.lastX;
      const dy = p.y - mouse.lastY;
      if (mouse.dragging && state === 'playing' && (Math.abs(dx) + Math.abs(dy) > 1)) {
        player.angle = normalizeAngle(player.angle + dx * 0.008);
        adjustPitch(dy, 0.005);
        mouse.touchTarget = null;
      }
      mouse.lastX = p.x;
      mouse.lastY = p.y;
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.inCanvas = true;
    }
  });
  canvas.addEventListener('pointerdown', event => {
    if (state !== 'playing') return;
    event.preventDefault();
    const p = canvasPoint(event);
    mouse.x = p.x;
    mouse.y = p.y;
    mouse.lastX = p.x;
    mouse.lastY = p.y;
    mouse.inCanvas = true;
    mouse.type = event.pointerType === 'mouse' ? 'mouse' : 'touch';
    if (event.pointerType === 'mouse' && event.button === 0) requestMouseLook(false);
    if (event.button === 0) {
      mouse.dragging = true;
      canvas.setPointerCapture?.(event.pointerId);
    }
    if (mouse.type === 'touch') {
      const cell = pickCellAtScreen(p.x, p.y);
      mouse.touchTarget = cell ? { x: cell.x, y: cell.y } : null;
    }
    const mob = event.button === 0 ? mobAtScreen(p.x, p.y) : null;
    if (event.pointerType === 'mouse' && event.button === 2) placeBlock();
    else if (mob) attackTarget(mob);
    else if (event.button === 0) {
      if (mouse.type === 'touch') {
        player.angle = angleForScreenX(p.x);
        player.faceX = Math.cos(player.angle);
        player.faceY = Math.sin(player.angle);
        const cell = rayCell(player.angle, 3.4);
        mouse.touchTarget = cell ? { x: cell.x, y: cell.y } : null;
      }
      mineTarget();
    }
  });
  canvas.addEventListener('pointerup', event => {
    if (event.button === 0) mouse.dragging = false;
  });
  canvas.addEventListener('contextmenu', event => event.preventDefault());
  canvas.addEventListener('pointercancel', () => { mouse.inCanvas = false; mouse.dragging = false; });

  lookButton.addEventListener('click', () => {
    if (document.pointerLockElement === canvas) {
      document.exitPointerLock?.();
      return;
    }
    requestMouseLook();
  });
  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === canvas;
    lookButton.classList.toggle('locked', locked);
    lookButton.setAttribute('aria-label', locked ? 'Disable mouse look' : 'Enable mouse look');
    lookButton.title = locked ? 'Mouse look enabled · Esc pauses and releases' : 'Enable mouse look · click the world to lock';
  });
  document.addEventListener('pointerlockerror', () => addToast('MOUSE LOOK UNAVAILABLE · DRAG TO TURN', true));

  function clearInput() {
    keys.clear();
    touchDirections.clear();
    touchActions.clear();
    mouse.dragging = false;
    $$('.dpad.held, .touch-action.held').forEach(button => button.classList.remove('held'));
  }

  window.addEventListener('keydown', event => {
    const code = event.code;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) event.preventDefault();
    if (inventoryOpen) {
      if ((code === 'Escape' || code === 'KeyI') && !event.repeat) {
        event.preventDefault();
        closeInventory();
      } else if (code === 'KeyP' && !event.repeat) pauseGame();
      return;
    }
    if (code === 'KeyI' && !event.repeat) {
      if (state === 'playing') openInventory();
      return;
    }
    if ((code === 'Escape' || code === 'KeyP') && !event.repeat) {
      if (state === 'playing' || state === 'paused') pauseGame();
      return;
    }
    if (state !== 'playing') {
      if ((code === 'Enter' || code === 'Space') && state === 'menu') startGame('survival');
      if ((code === 'Enter' || code === 'Space') && state === 'gameover') startGame(mode);
      return;
    }
    keys.add(code);
    if (event.repeat) return;
    if (code === 'Space') {
      if (mode === 'creative') {
        const now = performance.now();
        if (now - lastSpaceTap <= 340) {
          lastSpaceTap = -Infinity;
          toggleFlight();
        } else {
          lastSpaceTap = now;
          if (!player.flying) attackTarget();
        }
      } else attackTarget();
    }
    else if (code === 'KeyF') mineTarget();
    else if (code === 'KeyE') placeBlock();
    else if (/^Digit[1-9]$/.test(code)) selectBlock(Number(code.slice(-1)) - 1);
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  window.addEventListener('blur', clearInput);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInput();
      if (state === 'playing') pauseGame();
      saveRun();
    }
  });
  window.addEventListener('pagehide', saveRun);

  $$('.dpad').forEach(button => {
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      button.classList.add('held');
      touchDirections.set(event.pointerId, button.dataset.move);
    });
    const release = event => {
      touchDirections.delete(event.pointerId);
      button.classList.remove('held');
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', event => event.preventDefault());
  });
  $$('.touch-action').forEach(button => {
    button.addEventListener('pointerdown', event => {
      event.preventDefault();
      button.setPointerCapture?.(event.pointerId);
      const action = button.dataset.action;
      button.classList.add('held');
      touchActions.set(event.pointerId, action);
      touchRepeat = 0;
      if (action === 'mine') mineTarget();
      else if (action === 'attack') attackTarget();
      else if (action === 'build') placeBlock();
    });
    const release = event => {
      touchActions.delete(event.pointerId);
      button.classList.remove('held');
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('contextmenu', event => event.preventDefault());
  });

  $$('[data-start]').forEach(button => button.addEventListener('click', () => startGame(button.dataset.start)));
  $$('[data-resume]').forEach(button => button.addEventListener('click', resumeGame));
  $$('[data-restart]').forEach(button => button.addEventListener('click', () => {
    if (state === 'paused') saveRun();
    startGame(mode);
  }));
  $$('[data-menu]').forEach(button => button.addEventListener('click', backToMenu));
  $('#pause-button').addEventListener('click', pauseGame);
  attackButton.addEventListener('click', () => attackTarget());
  inventoryButton.addEventListener('click', toggleInventory);
  inventoryCloseButton.addEventListener('click', closeInventory);
  inventoryScreen.addEventListener('click', event => {
    if (event.target === inventoryScreen) closeInventory();
  });
  soundButton.addEventListener('click', toggleSound);
  window.addEventListener('keydown', event => {
    if (state === 'paused' && event.key === 'Enter') resumeGame();
  });

  function frame(timestamp) {
    if (!lastFrame) lastFrame = timestamp;
    const dt = Math.min(0.05, Math.max(0, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;
    update(dt, timestamp / 1000);
    render(timestamp / 1000);
    requestAnimationFrame(frame);
  }

  function boot() {
    generateWorld(worldSeed);
    player = newPlayer();
    camera = { x: player.x, y: player.y };
    mobs = [];
    for (let i = 0; i < 3; i++) mobs.push(makeMob(pickSpawnCell(5.5, 9.5, mobs)));
    initializeHotbar();
    renderHighScores($('#start-scores'), 5);
    headerBest.textContent = formatScore(getBestScore());
    soundButton.classList.toggle('muted', !soundEnabled);
    soundButton.setAttribute('aria-label', soundEnabled ? 'Mute sound' : 'Enable sound');
    resizeCanvas();
    if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(stage);
    else window.addEventListener('resize', resizeCanvas);
    requestAnimationFrame(frame);
  }

  boot();
})();
