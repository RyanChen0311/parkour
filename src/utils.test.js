import { describe, it, expect } from 'vitest';
import { lightenColor, darkenColor, getCharacterSize, clampPosition } from './utils.js';

describe('lightenColor', () => {
  it('回傳格式為 rgb(...)', () => {
    const result = lightenColor('#228B22');
    expect(result).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });

  it('預設 amount=0.4，讓顏色變亮', () => {
    // #228B22 = rgb(34, 139, 34)
    // 亮化後每個 channel 應該比原本大
    expect(lightenColor('#228B22')).toBe('rgb(122, 185, 122)');
  });

  it('amount=0 時回傳原本的顏色值', () => {
    expect(lightenColor('#228B22', 0)).toBe('rgb(34, 139, 34)');
  });

  it('amount=1 時所有 channel 都變成 255（純白）', () => {
    expect(lightenColor('#228B22', 1)).toBe('rgb(255, 255, 255)');
  });

  it('純黑 #000000 亮化後不會還是 0', () => {
    const result = lightenColor('#000000', 0.4);
    expect(result).toBe('rgb(102, 102, 102)');
  });

  it('純白 #FFFFFF 亮化後仍是 255（Math.min 保護不溢位）', () => {
    expect(lightenColor('#ffffff', 0.4)).toBe('rgb(255, 255, 255)');
  });

  it('遊戲四個職業預設顏色都能正確處理', () => {
    expect(() => lightenColor('#228B22')).not.toThrow(); // archer
    expect(() => lightenColor('#4169E1')).not.toThrow(); // mage
    expect(() => lightenColor('#DC143C')).not.toThrow(); // swordsman
    expect(() => lightenColor('#9370DB')).not.toThrow(); // assassin
  });
});

describe('darkenColor', () => {
  it('回傳格式為 rgb(...)', () => {
    const result = darkenColor('#228B22');
    expect(result).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });

  it('預設 amount=0.3，讓顏色變暗', () => {
    // #228B22 = rgb(34, 139, 34)
    // 暗化後每個 channel 應該比原本小
    expect(darkenColor('#228B22')).toBe('rgb(24, 97, 24)');
  });

  it('amount=0 時回傳原本的顏色值', () => {
    expect(darkenColor('#228B22', 0)).toBe('rgb(34, 139, 34)');
  });

  it('amount=1 時所有 channel 都變成 0（純黑）', () => {
    expect(darkenColor('#228B22', 1)).toBe('rgb(0, 0, 0)');
  });

  it('純黑 #000000 暗化後仍是 0', () => {
    expect(darkenColor('#000000', 0.3)).toBe('rgb(0, 0, 0)');
  });

  it('純白 #FFFFFF 暗化後會變灰', () => {
    expect(darkenColor('#ffffff', 0.3)).toBe('rgb(179, 179, 179)');
  });

  it('遊戲四個職業預設顏色都能正確處理', () => {
    expect(() => darkenColor('#228B22')).not.toThrow(); // archer
    expect(() => darkenColor('#4169E1')).not.toThrow(); // mage
    expect(() => darkenColor('#DC143C')).not.toThrow(); // swordsman
    expect(() => darkenColor('#9370DB')).not.toThrow(); // assassin
  });
});

describe('getCharacterSize', () => {
  it('視窗寬度大於 480 時回傳 60', () => {
    expect(getCharacterSize(481)).toBe(60);
    expect(getCharacterSize(768)).toBe(60);
    expect(getCharacterSize(1920)).toBe(60);
  });

  it('視窗寬度等於 480 時回傳 50（手機臨界點）', () => {
    expect(getCharacterSize(480)).toBe(50);
  });

  it('視窗寬度小於 480 時回傳 50', () => {
    expect(getCharacterSize(375)).toBe(50);
    expect(getCharacterSize(320)).toBe(50);
  });
});

describe('clampPosition', () => {
  it('正常位置不被改變', () => {
    const result = clampPosition(100, 100, 800, 600, 60);
    expect(result).toEqual({ x: 100, y: 100 });
  });

  it('超出右側邊界時夾緊到 containerWidth - characterSize', () => {
    const result = clampPosition(900, 100, 800, 600, 60);
    expect(result.x).toBe(740); // 800 - 60
  });

  it('超出下方邊界時夾緊到 containerHeight - characterSize', () => {
    const result = clampPosition(100, 700, 800, 600, 60);
    expect(result.y).toBe(540); // 600 - 60
  });

  it('負值時夾緊到 0', () => {
    const result = clampPosition(-10, -5, 800, 600, 60);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it('剛好在邊界上不被改變', () => {
    // maxX = 800 - 60 = 740, maxY = 600 - 60 = 540
    const result = clampPosition(740, 540, 800, 600, 60);
    expect(result).toEqual({ x: 740, y: 540 });
  });

  it('手機尺寸（characterSize=50）的邊界計算正確', () => {
    const result = clampPosition(999, 999, 375, 667, 50);
    expect(result).toEqual({ x: 325, y: 617 }); // 375-50, 667-50
  });
});
