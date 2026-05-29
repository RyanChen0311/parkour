# 🏃‍♂️ 跑酷幻影遊戲 | Parkour Phantom Game

🎮 **[立即遊玩 → https://ryanchen0311.github.io/parkour/](https://ryanchen0311.github.io/parkour/)**

一個純 HTML5 跑酷幻影特效遊戲，無需安裝任何依賴，直接開啟瀏覽器即可遊玩。

---

## 🎮 遊戲功能

- **4 種職業角色**：弓箭手、法師、劍士、刺客，每種有專屬 emoji 與預設顏色
- **調色盤背景**：遊戲框是 HSL 彩虹漸層，在背景上滑動即可即時改變角色顏色
- **殘影特效**：移動時產生炫酷的幻影拖尾
- **🏃 開始跑酷**：自動移動模式，背景轉黑
- **🎲 切換職業**：自動輪替職業，每次切換同步隨機換色
- **速度控制**：長條滑桿調整移動速度
- **多種控制方式**：鍵盤 WASD / 方向鍵 + 觸控拖曳（支援手機）
- **響應式設計**：支援桌機、平板、手機（480px 以下縮小角色）
- **情境游標**：滑鼠移到角色顯示手掌，移到調色盤顯示滴管

## 🕹️ 操作說明

| 操作 | 說明 |
|------|------|
| `W` / `↑` | 向上移動 |
| `S` / `↓` | 向下移動 |
| `A` / `←` | 向左移動 |
| `D` / `→` | 向右移動 |
| 拖曳角色圈圈 | 直接移動角色（滑鼠 / 觸控） |
| 滑動背景 | 依 X 軸位置改變角色顏色（HSL 色相 0–360°） |

---

## 🛠️ 技術細節

- 純 HTML5 + CSS3 + Vanilla JavaScript（無框架、無依賴）
- `requestAnimationFrame` 動畫迴圈
- `touchstart` / `touchmove` / `mousedown` / `mousemove` 統一事件處理
- `passive: false` 允許 `preventDefault()` 防止系統捲動干擾
- CSS `linear-gradient` + HSL 色彩空間實作彩虹調色盤
- `encodeURIComponent` 將 SVG 嵌入 CSS cursor data URI

---

## 🧪 測試架構

使用 [Vitest](https://vitest.dev/) 搭配 jsdom 環境，測試核心工具函式。

```bash
npm install
npm test
```

測試涵蓋 `src/utils.js` 中的四個函式（共 23 個測試案例）：

| 函式 | 測試案例數 | 說明 |
|------|-----------|------|
| `lightenColor` | 7 | 亮化顏色，驗證 RGB 輸出與邊界值 |
| `darkenColor` | 7 | 暗化顏色，驗證 RGB 輸出與邊界值 |
| `getCharacterSize` | 3 | 視窗寬度 ≤480px 回傳 50，否則 60 |
| `clampPosition` | 6 | 角色位置邊界夾緊（防止超出容器） |

GitHub Actions CI 在每次 push / PR 時自動執行測試。

---

## 🗓️ 本次開發紀錄（Claude Code Session）

以下記錄本次 AI 輔助開發的完整過程。

### 第一階段：建立測試基礎

**起點**：專案只有 `index.html`，沒有任何測試。

1. 安裝 Vitest + jsdom，建立 `vitest.config.js` 與 `package.json`
2. 將 `lightenColor`、`darkenColor` 從 `index.html` 抽出至 `src/utils.js`（加上 `export`）
3. 新增 `src/utils.test.js`，為這兩個函式各寫 7 個測試案例
4. 再抽出 `getCharacterSize`、`clampPosition`，補齊共 23 個測試案例
5. 建立 `.github/workflows/test.yml`：push / PR 觸發，Node 22，`npm ci && npm test`

**遇到的問題**：測試預期值算錯（`lightenColor('#228B22')` 預期 `rgb(119, 195, 119)` 但實際是 `rgb(122, 185, 122)`），執行測試後看輸出修正。

> `src/utils.js` 僅供測試用（有 `export`）；`index.html` 為避免 `file://` 協議無法載入 ES Module，**將四個函式重新內嵌**，兩份並行維護。

---

### 第二階段：修復手機拖曳 Bug

**問題**：為了引入 `import` 而加上 `type="module"` 後，手機完全無法拖曳。

**原因**：`type="module"` 在 `file://` 協議下受 CORS 限制，整個 script 載入失敗。

**修復**：移除 `type="module"` 與 `import`，改為直接在 HTML 內聯函式。`src/utils.js` 保留 `export` 供 Vitest 使用。

---

### 第三階段：UI / UX 全面改版

原始介面有說明卡、頁尾、功能列表，畫面雜亂。逐步迭代如下：

| 步驟 | 改動 |
|------|------|
| 刪除說明卡、footer、副標題 | 讓遊戲框成為視覺主角 |
| 職業與顏色控制項統一尺寸 | 移除文字標籤，框框改成長方形按鈕 |
| 新增速度滑桿 | `<input type="range">`，寬度與其他按鈕相同 |
| 顏色改為背景滑動換色 | 移除 `<input type="color">`，改用手指/滑鼠在遊戲框拖曳 |
| 遊戲框背景改為彩虹漸層 | `linear-gradient` HSL 0°→360°，背景即是調色盤 |
| 自動移動 → 開始跑酷 | 按鈕改名，自動移動時背景轉黑，停止後還原彩虹 |
| 切換職業加入換色 | `autoChangeClass` 切換時同步隨機換色 |
| 網頁背景改白色 | `body { background: #ffffff }` |
| 標題只留 emoji | `<h1>🏃‍♂️</h1>` |

---

### 第四階段：細節修復

| 問題 | 修復方式 |
|------|---------|
| 按「開始跑酷」提示詞不消失 | `autoMoveBtn` click handler 補呼叫 `hideTouchHint()` |
| 按「隨機職業」提示詞不消失 | `autoClassBtn` click handler 補呼叫 `hideTouchHint()` |
| 按鈕顯示「自動選擇職業」 | 統一改為「切換職業」（HTML 初始值 + JS toggle） |
| 提示詞被角色遮住 | `.touch-hint { top: 25% }` 上移至遊戲框上方四分之一 |

---

### 第五階段：情境游標

根據滑鼠位置動態切換游標：

- **調色盤區域**（預設）：滴管游標（48×48 SVG data URI，模擬小畫家色彩選擇器）
- **角色圈圈範圍內**（距圓心 ≤ 角色尺寸 × 0.8）：`grab`
- **拖曳角色時**：`grabbing`
- **放開 / 重置後**：恢復滴管

實作方式：
- `CRAYON_CURSOR` 常數：`encodeURIComponent` 將 SVG 嵌入 data URI，hotspot 設為 `10 38`（滴管尖端）
- `handleTouchMove`：mouse 移動時計算與角色中心距離，決定游標
- `handleTouchStart`：開始拖曳時設為 `grabbing`
- `handleTouchEnd` / reset：恢復為滴管

---

## 🎭 職業介紹

| 職業 | 表情 | 預設顏色 |
|------|------|----------|
| 弓箭手 | 🏹 | 森林綠 `#228B22` |
| 法師 | 🔮 | 皇家藍 `#4169E1` |
| 劍士 | ⚔️ | 深紅 `#DC143C` |
| 刺客 | 🗡️ | 紫羅蘭 `#9370DB` |

---

## 📄 授權

MIT License
