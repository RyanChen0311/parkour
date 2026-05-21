# 🏃‍♂️ 跑酷幻影遊戲 | Parkour Phantom Game

一個純 HTML5 跑酷幻影特效遊戲，無需安裝任何依賴，直接開啟瀏覽器即可遊玩。

## 🎮 遊戲功能

- **4 種職業角色**：弓箭手、法師、劍士、刺客
- **自訂顏色**：每個職業可設定專屬顏色，殘影效果同步變化
- **多種控制方式**：鍵盤 WASD / 方向鍵 + 觸控拖曳（支援手機）
- **殘影特效**：移動時產生炫酷的幻影拖尾
- **自動模式**：自動移動 & 自動切換職業
- **響應式設計**：支援桌機、平板、手機

## 🕹️ 操作說明

| 操作 | 說明 |
|------|------|
| `W` / `↑` | 向上移動 |
| `S` / `↓` | 向下移動 |
| `A` / `←` | 向左移動 |
| `D` / `→` | 向右移動 |
| 觸控拖曳 | 直接拖動角色（手機/平板） |

## 🚀 快速開始

```bash
git clone https://github.com/<your-username>/parkour.git
cd parkour
# 直接用瀏覽器開啟 index.html
open index.html   # macOS
start index.html  # Windows
```

或者直接在瀏覽器開啟 `index.html` 即可遊玩，無需伺服器。

## 🎭 職業介紹

| 職業 | 表情 | 預設顏色 | 特色 |
|------|------|----------|------|
| 弓箭手 | 🏹 | 森林綠 | 敏捷射手 |
| 法師 | 🔮 | 皇家藍 | 神秘施法者 |
| 劍士 | ⚔️ | 深紅 | 勇猛戰士 |
| 刺客 | 🗡️ | 紫羅蘭 | 暗影殺手 |

## 🛠️ 技術細節

- 純 HTML5 + CSS3 + Vanilla JavaScript
- 使用 `requestAnimationFrame` 實現流暢動畫迴圈
- 支援 Pointer Events API（觸控 + 滑鼠統一處理）
- CSS `backdrop-filter` 毛玻璃效果
- 響應式 Grid 佈局

## 📄 授權

MIT License
