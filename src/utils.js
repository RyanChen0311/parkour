export function lightenColor(color, amount = 0.4) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  return `rgb(${newR}, ${newG}, ${newB})`;
}

export function darkenColor(color, amount = 0.3) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const newR = Math.round(r * (1 - amount));
  const newG = Math.round(g * (1 - amount));
  const newB = Math.round(b * (1 - amount));
  return `rgb(${newR}, ${newG}, ${newB})`;
}

export function getCharacterSize(windowWidth) {
  return windowWidth <= 480 ? 50 : 60;
}

export function clampPosition(posX, posY, containerWidth, containerHeight, characterSize) {
  const maxX = containerWidth - characterSize;
  const maxY = containerHeight - characterSize;
  return {
    x: Math.max(0, Math.min(maxX, posX)),
    y: Math.max(0, Math.min(maxY, posY)),
  };
}
