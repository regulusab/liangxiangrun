# 梁湘潤論八字

https://regulusab.github.io/liangxiangrun/

依梁湘潤（1930–2013）論八字法的公開資料整理的排盤與論法網站。

- **排盤論命**：盤面事實由共用模組 `/workspace/shared/mingpan-facts`（`computeFacts`）計算。出生時間為地方平時，照輸入使用；節氣換成出生地地方平時比較；東經 70° 以西日柱干支進一位（日期不動）；0:00 換日。本站不做任何換日口徑比對。
- **原局檢索**：依梁氏論命次第（五行缺一 → 月令財官 → 雙沖三刑全陽全陰 → 拱夾 → 各柱雙沖 → 格局順逆 → 調候 → 特別格 → 日主強弱最後）。
- **大運流年**：金不換大運主線；檢索十干敗亡運、墓庫運、雙沖伏吟、調候字、格局喜忌；流年檢索歲運並臨、天剋地沖、沖合日支、三刑三合；流月依五虎遁排列。
- **子女**：食神、傷官以天干陰陽分，陽干為子、陰干為女。
- **知識頁**：梁氏論法十一節、生平與著作、參考資料（見 SOURCES.md）。

## 指令

- `npm run dev`：開發
- `npm run build`：建置（vite.config.js 在打包時把 facts.mjs 的 Node 專用行換成瀏覽器寫法，不改動原檔；模組改版導致修補失敗時會直接報錯）
- `npm run preview`：預覽，網址為 http://localhost:4175/liangxiangrun/
- `npm run qa`：排盤口徑與規則檢查、桌機與手機截圖，輸出到 /workspace/fig/liangxiangrun/

## 部署

main 分支放原始碼；`dist/` 內容推到 gh-pages 分支（GitHub Pages）。
