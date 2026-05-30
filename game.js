// --- Color Utilities ---

function lightenColor(color, amount = 0.4) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  return `rgb(${newR}, ${newG}, ${newB})`;
}

function darkenColor(color, amount = 0.3) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));
  return `rgb(${newR}, ${newG}, ${newB})`;
}

function randomHexColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function getCharacterSize(windowWidth) {
  return windowWidth <= 480 ? 50 : 60;
}

function clampPosition(posX, posY, containerWidth, containerHeight, characterSize) {
  const maxX = containerWidth - characterSize;
  const maxY = containerHeight - characterSize;
  return {
    x: Math.max(0, Math.min(maxX, posX)),
    y: Math.max(0, Math.min(maxY, posY)),
  };
}

// --- Constants ---

const CRAYON_CURSOR = (() => {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">` +
    `<path d="M20.71 5.63l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-3.12 3.12-1.41-1.42-1.42 1.42 1.41 1.41-6.6 6.6A2 2 0 0 0 5 16v3h3a2 2 0 0 0 1.42-.59l6.6-6.6 1.41 1.42 1.42-1.42-1.42-1.41 3.12-3.12c.39-.39.39-1.02 0-1.41z" fill="#222"/>` +
    `</svg>`
  );
  return `url("data:image/svg+xml,${svg}") 10 38, crosshair`;
})();

const RAINBOW_BG = `linear-gradient(to right,
  hsl(0,80%,35%), hsl(45,80%,35%), hsl(90,80%,35%),
  hsl(135,80%,35%), hsl(180,80%,35%), hsl(225,80%,35%),
  hsl(270,80%,35%), hsl(315,80%,35%), hsl(360,80%,35%))`;

const classData = {
  archer:    { emoji: '🏹', name: '弓箭手', defaultColor: '#228B22' },
  mage:      { emoji: '🔮', name: '法師',   defaultColor: '#4169E1' },
  swordsman: { emoji: '⚔️', name: '劍士',   defaultColor: '#DC143C' },
  assassin:  { emoji: '🗡️', name: '刺客',   defaultColor: '#9370DB' },
};

// --- DOM References ---

const character    = document.getElementById('character');
const container    = document.getElementById('character-container');
const select       = document.getElementById('classSelect');
const autoMoveBtn  = document.getElementById('autoMoveBtn');
const autoClassBtn = document.getElementById('autoClassBtn');
const resetBtn     = document.getElementById('resetBtn');
const touchHint    = document.getElementById('touchHint');
const speedControl = document.getElementById('speedControl');

// --- State ---

let posX = 320;
let posY = 195;
let currentClass = 'archer';
let currentColor = '#228B22';
let classColors = {
  archer: '#228B22',
  mage: '#4169E1',
  swordsman: '#DC143C',
  assassin: '#9370DB',
};
let isAutoMoving = false;
let isAutoClassChanging = false;
let autoMoveDirection = { x: 1, y: 0.5 };
let keys = {};
let moveSpeed = 6;
let lastMoveTime = 0;
let isDragging = false;
let isMouseDown = false;
let dragOffset = { x: 0, y: 0 };
let touchStartTime = 0;
let hasInteracted = false;

// --- Rendering ---

function updateCharacter() {
  const color = classColors[currentClass];
  const lightColor = lightenColor(color);
  const darkColor = darkenColor(color);
  character.className = `character ${currentClass}`;
  character.textContent = classData[currentClass].emoji;
  character.style.background = `radial-gradient(circle, ${color}, ${darkColor})`;
  character.style.color = lightColor;
  character.style.boxShadow = `0 0 20px ${color}`;
  currentColor = color;
  document.title = `🏃‍♂️ 跑酷幻影遊戲 - ${classData[currentClass].name}`;
}

function createAfterImage() {
  const color = classColors[currentClass];
  const lightColor = lightenColor(color, 0.6);
  const after = document.createElement('div');
  after.className = `afterimage ${currentClass}`;
  after.style.left = `${posX}px`;
  after.style.top = `${posY}px`;
  after.style.background = `radial-gradient(circle, ${lightColor}, ${color})`;
  after.style.boxShadow = `0 0 15px ${color}`;
  after.style.color = '#ffffff';
  after.style.textShadow = `2px 2px 4px ${color}`;
  after.textContent = classData[currentClass].emoji;
  container.appendChild(after);
  setTimeout(() => {
    after.style.opacity = '0';
    setTimeout(() => {
      if (container.contains(after)) container.removeChild(after);
    }, 800);
  }, 100);
}

function updatePosition() {
  const containerRect = container.getBoundingClientRect();
  const characterSize = getCharacterSize(window.innerWidth);
  ({ x: posX, y: posY } = clampPosition(posX, posY, containerRect.width, containerRect.height, characterSize));
  character.style.left = `${posX}px`;
  character.style.top = `${posY}px`;
  const currentTime = Date.now();
  if (currentTime - lastMoveTime > 70) {
    createAfterImage();
    lastMoveTime = currentTime;
  }
}

function hideTouchHint() {
  if (!hasInteracted) {
    touchHint.style.opacity = '0';
    setTimeout(() => { touchHint.style.display = 'none'; }, 300);
    hasInteracted = true;
  }
}

// --- Event Handlers ---

function getEventPos(e) {
  const rect = container.getBoundingClientRect();
  const src = e.touches && e.touches.length > 0 ? e.touches[0] : e;
  return { x: src.clientX - rect.left, y: src.clientY - rect.top };
}

function stopAutoMovement() {
  if (isAutoMoving) {
    isAutoMoving = false;
    autoMoveBtn.textContent = '🏃 開始跑酷';
    container.style.background = RAINBOW_BG;
  }
}

function handleTouchStart(e) {
  if (e.type === 'mousedown') isMouseDown = true;
  e.preventDefault();
  const pos = getEventPos(e);
  const characterRect = character.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const charX = characterRect.left - containerRect.left;
  const charY = characterRect.top - containerRect.top;
  const characterSize = getCharacterSize(window.innerWidth);
  const distance = Math.sqrt(
    Math.pow(pos.x - (charX + characterSize / 2), 2) +
    Math.pow(pos.y - (charY + characterSize / 2), 2)
  );
  if (distance <= characterSize * 0.8) {
    isDragging = true;
    dragOffset.x = pos.x - charX;
    dragOffset.y = pos.y - charY;
    character.classList.add('dragging');
    touchStartTime = Date.now();
    stopAutoMovement();
    hideTouchHint();
    if (e.type === 'mousedown') container.style.cursor = 'grabbing';
  }
}

function handleTouchMove(e) {
  const isTouch = e.type === 'touchmove';
  if (isDragging) {
    e.preventDefault();
    const pos = getEventPos(e);
    const characterSize = getCharacterSize(window.innerWidth);
    const containerRect = container.getBoundingClientRect();
    posX = pos.x - dragOffset.x;
    posY = pos.y - dragOffset.y;
    ({ x: posX, y: posY } = clampPosition(posX, posY, containerRect.width, containerRect.height, characterSize));
    updatePosition();
  } else if (isTouch || isMouseDown) {
    e.preventDefault();
    const pos = getEventPos(e);
    const containerRect = container.getBoundingClientRect();
    const hue = Math.round((pos.x / containerRect.width) * 360);
    classColors[currentClass] = hslToHex(hue, 80, 55);
    updateCharacter();
    hideTouchHint();
  }
  if (!isTouch && !isDragging) {
    const pos = getEventPos(e);
    const characterRect = character.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const charCX = characterRect.left - containerRect.left + characterRect.width / 2;
    const charCY = characterRect.top - containerRect.top + characterRect.height / 2;
    const dist = Math.sqrt(Math.pow(pos.x - charCX, 2) + Math.pow(pos.y - charCY, 2));
    container.style.cursor = dist <= getCharacterSize(window.innerWidth) * 0.8 ? 'grab' : CRAYON_CURSOR;
  }
}

function handleTouchEnd(e) {
  if (e.type === 'mouseup' || e.type === 'mouseleave') isMouseDown = false;
  if (!isDragging) return;
  e.preventDefault();
  isDragging = false;
  character.classList.remove('dragging');
  if (e.type === 'mouseup' || e.type === 'mouseleave') container.style.cursor = CRAYON_CURSOR;
  const touchDuration = Date.now() - touchStartTime;
  if (touchDuration < 200) {
    character.style.transform = 'scale(1.2)';
    setTimeout(() => { character.style.transform = ''; }, 150);
  }
}

function handleKeyboardMovement() {
  let moved = false;
  if (keys['w'] || keys['arrowup'])    { posY -= moveSpeed; moved = true; stopAutoMovement(); }
  if (keys['s'] || keys['arrowdown'])  { posY += moveSpeed; moved = true; stopAutoMovement(); }
  if (keys['a'] || keys['arrowleft'])  { posX -= moveSpeed; moved = true; stopAutoMovement(); }
  if (keys['d'] || keys['arrowright']) { posX += moveSpeed; moved = true; stopAutoMovement(); }
  if (moved) { hideTouchHint(); updatePosition(); }
}

// --- Auto Behaviors ---

function autoMove() {
  if (!isAutoMoving) return;
  const containerRect = container.getBoundingClientRect();
  const characterSize = getCharacterSize(window.innerWidth);
  const maxX = containerRect.width - characterSize;
  const maxY = containerRect.height - characterSize;
  posX += autoMoveDirection.x * moveSpeed * 0.67;
  posY += autoMoveDirection.y * moveSpeed * 0.5;
  if (posX >= maxX || posX <= 0) autoMoveDirection.x *= -1;
  if (posY >= maxY || posY <= 0) autoMoveDirection.y *= -1;
  updatePosition();
}

function autoChangeClass() {
  if (!isAutoClassChanging) return;
  const classes = Object.keys(classData);
  const randomClass = classes[Math.floor(Math.random() * classes.length)];
  if (randomClass !== currentClass) {
    currentClass = randomClass;
    classColors[currentClass] = randomHexColor();
    select.value = currentClass;
    updateCharacter();
  }
  setTimeout(autoChangeClass, 2000);
}

// --- Event Listeners ---

container.addEventListener('mousedown', handleTouchStart);
container.addEventListener('mousemove', handleTouchMove);
container.addEventListener('mouseup', handleTouchEnd);
container.addEventListener('mouseleave', handleTouchEnd);
container.addEventListener('touchstart', handleTouchStart, { passive: false });
container.addEventListener('touchmove', handleTouchMove, { passive: false });
container.addEventListener('touchend', handleTouchEnd, { passive: false });
container.addEventListener('touchcancel', handleTouchEnd, { passive: false });

select.addEventListener('change', () => {
  currentClass = select.value;
  updateCharacter();
});

speedControl.addEventListener('input', () => {
  moveSpeed = parseInt(speedControl.value);
});

autoMoveBtn.addEventListener('click', () => {
  isAutoMoving = !isAutoMoving;
  autoMoveBtn.textContent = isAutoMoving ? '⏸️ 停止跑酷' : '🏃 開始跑酷';
  if (isAutoMoving) {
    hideTouchHint();
    container.style.background = '#000000';
    autoMoveDirection.x = Math.random() > 0.5 ? 1 : -1;
    autoMoveDirection.y = (Math.random() - 0.5) * 2;
  } else {
    container.style.background = RAINBOW_BG;
  }
});

autoClassBtn.addEventListener('click', () => {
  isAutoClassChanging = !isAutoClassChanging;
  autoClassBtn.textContent = isAutoClassChanging ? '⏹️ 停止切換' : '🎲 切換職業';
  if (isAutoClassChanging) { hideTouchHint(); autoChangeClass(); }
});

resetBtn.addEventListener('click', () => {
  const containerRect = container.getBoundingClientRect();
  const characterSize = getCharacterSize(window.innerWidth);
  posX = (containerRect.width - characterSize) / 2;
  posY = (containerRect.height - characterSize) / 2;
  isAutoMoving = false;
  isAutoClassChanging = false;
  isDragging = false;
  container.style.background = RAINBOW_BG;
  container.style.cursor = CRAYON_CURSOR;
  autoMoveBtn.textContent = '🏃 開始跑酷';
  autoClassBtn.textContent = '🎲 切換職業';
  character.classList.remove('dragging');
  classColors = { archer: '#228B22', mage: '#4169E1', swordsman: '#DC143C', assassin: '#9370DB' };
  currentClass = 'archer';
  select.value = currentClass;
  moveSpeed = 6;
  speedControl.value = 6;
  updateCharacter();
  updatePosition();
  container.querySelectorAll('.afterimage').forEach(img => {
    if (container.contains(img)) container.removeChild(img);
  });
  hasInteracted = false;
  touchHint.style.display = 'block';
  touchHint.style.opacity = '0.7';
});

document.addEventListener('keydown', (e) => {
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
  const key = e.key.toLowerCase();
  if (!keys[key]) keys[key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

document.addEventListener('touchmove', (e) => {
  if (e.target.closest('#character-container')) e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) e.preventDefault();
  lastTouchEnd = now;
}, false);

window.addEventListener('resize', () => {
  const containerRect = container.getBoundingClientRect();
  const characterSize = getCharacterSize(window.innerWidth);
  ({ x: posX, y: posY } = clampPosition(posX, posY, containerRect.width, containerRect.height, characterSize));
  updatePosition();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    const containerRect = container.getBoundingClientRect();
    const characterSize = getCharacterSize(window.innerWidth);
    ({ x: posX, y: posY } = clampPosition(posX, posY, containerRect.width, containerRect.height, characterSize));
    updatePosition();
  }, 500);
});

document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('#character-container')) e.preventDefault();
});

// --- Init ---

function animate() {
  handleKeyboardMovement();
  autoMove();
  requestAnimationFrame(animate);
}

function initGame() {
  updateCharacter();
  const containerRect = container.getBoundingClientRect();
  const characterSize = getCharacterSize(window.innerWidth);
  posX = (containerRect.width - characterSize) / 2;
  posY = (containerRect.height - characterSize) / 2;
  container.style.cursor = CRAYON_CURSOR;
  updatePosition();
  animate();
  setTimeout(() => {
    if (!hasInteracted) touchHint.style.opacity = '0.5';
  }, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
