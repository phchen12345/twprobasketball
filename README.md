# Basketball Next Site

台灣職籃賽程展示網站，整合 `PLG`、`TPBL`、`BCL Asia-East` 賽程資料，並用滾動式首頁動畫呈現內容。

## Overview

這個專案使用 `Next.js App Router` 建立前端網站，首頁以長頁滾動體驗串接不同聯盟的賽程區塊。

- `PLG` 與 `BCL` 目前主要讀取本地 JSON 資料
- `TPBL` 優先讀取官方 API，失敗時退回本地 fallback 資料
- `PLG` 提供 Playwright scraper，可將官方賽程整理成專案可用的 JSON

## Tech Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `GSAP`
- `Playwright`

## Features

- 首頁滾動動畫與分段式聯盟切換體驗
- 顯示 `PLG`、`TPBL`、`BCL` 賽程
- 已完成 / 即將開始賽事切換
- 月份與球隊篩選
- `TPBL` API 即時資料載入與 fallback 機制
- `PLG` 賽程爬蟲與 JSON 匯出流程

## Project Structure

```text
app/
  api/tpbl/games/route.ts     TPBL API proxy route
  components/                 首頁與賽程相關元件
  constants/                  常數設定
  hooks/                      動畫、賽程、日期等 hooks
  lib/                        資料轉換邏輯
components/ui/                共用 UI 元件
data/                         靜態賽程資料
scripts/                      資料抓取腳本
public/                       圖片與靜態資源
```

## Data Sources

### PLG

- 主要資料檔：`data/plg_schedule_2025_26.json`
- 可透過 `scripts/scrape-plg-schedule.ts` 更新
- scraper 會解析官方賽程頁面，輸出標準化 JSON

### TPBL

- API 常數定義於 `app/constants/tpbl.ts`
- client 端透過 `app/hooks/useTpblGames.ts` 載入資料
- 轉換邏輯位於 `app/lib/tpblMapper.ts`
- 若 API 請求失敗，會退回 `data/tpbl_schedule_2025_26_openers.json`

### BCL

- 主要資料檔：`data/bcl_schedule_2026.json`
- 目前由本地 JSON 提供資料

## Rendering Flow

首頁入口在 `app/page.tsx`，主要畫面由 `app/components/HomePageExperience.tsx` 組成。

整體流程如下：

1. 載入 `PLG`、`BCL` 本地 JSON 與 `TPBL` 資料
2. 透過 `useSchedule` 將賽事切分為 `upcoming` / `completed`
3. 產生月份、球隊篩選結果與分頁資料
4. 交由各聯盟 section component 負責畫面呈現
5. 由動畫 hooks 控制首頁滾動互動與區段切換

## Getting Started

### Requirements

- `Node.js 20+` 建議
- `npm`

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

預設會啟動 Next.js 開發伺服器。

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run build:scrapers
npm run scrape:plg
```

### Script Notes

- `build:scrapers`：編譯 `scripts/` 內的 TypeScript 腳本
- `scrape:plg`：執行 PLG 賽程抓取並輸出 JSON

## PLG Scraper

`scripts/scrape-plg-schedule.ts` 會先嘗試直接抓取 HTML；若失敗，會 fallback 到 `Playwright`。

執行方式：

```bash
npm run scrape:plg
```

也可透過環境變數調整：

- `PLG_SEASON`
- `PLG_SCHEDULE_URL`
- `PLG_OUTPUT_PATH`

## Important Modules

- `app/components/HomePageExperience.tsx`
  首頁主要容器，整合動畫、三個聯盟區塊與資料載入

- `app/hooks/useSchedule.ts`
  將賽程資料切成已完成 / 未來賽事，並處理篩選與分頁

- `app/hooks/useTpblGames.ts`
  載入 TPBL API，失敗時切回 fallback JSON

- `app/lib/tpblMapper.ts`
  將 TPBL API 與 fallback 資料轉成統一前端格式

- `app/api/tpbl/games/route.ts`
  TPBL API proxy route

## Maintenance Notes

- 若賽程資料更新頻繁，優先確認 JSON 是否仍符合目前前端格式
- 若 TPBL API 欄位改版，需同步調整 `tpblMapper`
- 若 PLG 官方頁面結構變動，可能需要修正 scraper parsing 規則
- 專案中部分中文文字目前有編碼異常跡象，建議統一檔案為 `UTF-8`

## Documentation Writing Suggestion

如果你要繼續補技術文件，建議下一步新增：

- `docs/architecture.md`：說明元件、hooks、資料流
- `docs/data-flow.md`：說明三個聯盟資料來源與 fallback 策略
- `docs/development.md`：說明本機開發與資料更新流程
