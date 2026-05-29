import { describe, it, expect } from 'vitest';
import { lightenColor, darkenColor } from './utils.js';

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
