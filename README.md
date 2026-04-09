# Basketball Next Site

以 `Next.js 15` 建立的台灣職籃賽程網站，整合 `PLG`、`TPBL` 與 `BCL Asia-East` 三個來源，提供近期賽程、已完賽事、球隊篩選與分頁瀏覽。前端同時包含首頁動畫、分聯盟視覺主題，以及 TPBL 即時資料代理 API。

線上站點：`https://twprobasketball.vercel.app`

## 功能重點

- 顯示 `PLG`、`TPBL`、`BCL Asia-East` 三個聯盟的賽程
- 區分 `upcoming` 與 `completed` 賽事
- 支援月份篩選、球隊篩選與分頁
- 以統一的資料模型渲染不同來源的賽事資料
- TPBL 透過 Next.js API route 代理上游 API，失敗時可退回本地 JSON
- PLG 透過 Playwright scraper 產生本地 JSON，並由 GitHub Actions 定時更新

## 技術棧

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `GSAP`
- `Playwright`

## 專案結構

```text
app/
  api/tpbl/games/route.ts          TPBL API proxy
  components/                      首頁動畫、導覽、賽程 UI
  constants/                       常數設定
  domain/                          共用型別與主題規則
  hooks/                           資料、動畫、賽程 hooks
  lib/                             各聯盟 mapper
  page.tsx                         首頁入口

components/ui/                     基礎 UI 元件
data/                              本地賽程 JSON
docs/                              設計文件
public/                            靜態資產與隊徽
scripts/                           scraper 腳本
```

## 資料來源

### PLG

- 本地資料檔：`data/plg_schedule_2025_26.json`
- 來源腳本：`scripts/scrape-plg-schedule.ts`
- 更新方式：抓取 `pleagueofficial.com` 賽程頁面後輸出為統一 JSON

### TPBL

- API proxy：`app/api/tpbl/games/route.ts`
- client hook：`app/hooks/data/useTpblGames.ts`
- fallback 檔案：`data/tpbl_schedule_2025_26_openers.json`
- mapper：`app/lib/tpblMapper.ts`

### BCL Asia-East

- 本地資料檔：`data/bcl_schedule_2026.json`
- mapper：`app/lib/bclMapper.ts`

## 渲染流程

首頁入口在 `app/page.tsx`，主要組裝邏輯位於 `app/components/experience/HomePageExperience.tsx`。

```text
資料來源(API / JSON)
-> mapper 正規化
-> useLeagueData
-> useLeagueSchedules / useSchedule
-> 各聯盟 section component
-> UI render
```

共用賽程狀態由 `app/hooks/schedule/useSchedule.ts` 管理，負責：

- 切分 `upcoming` / `completed`
- 月份與球隊篩選
- 分頁
- 當前顯示資料整理

## 安裝與啟動

### 環境需求

- `Node.js 20+`
- `npm`

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

預設會啟動 Next.js 開發伺服器。

### 正式建置與啟動

```bash
npm run build
npm run start
```

## 可用指令

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run build:scrapers
npm run scrape:plg
```

### 指令說明

- `build:scrapers`：編譯 `scripts/` 底下的 TypeScript 腳本
- `scrape:plg`：執行 PLG scraper，並更新 `data/plg_schedule_2025_26.json`

## PLG Scraper

PLG scraper 位於 `scripts/scrape-plg-schedule.ts`，流程如下：

1. 先用 `fetch` 取得 PLG 賽程頁
2. 若抓取或解析失敗，退回 `Playwright Chromium`
3. 解析賽程、比分、場館、隊名與隊徽
4. 輸出為專案使用的 JSON 格式

可覆寫的環境變數：

- `PLG_SEASON`
- `PLG_SCHEDULE_URL`
- `PLG_OUTPUT_PATH`

執行方式：

```bash
npm run scrape:plg
```

## 自動更新

GitHub Actions 工作流程位於 `.github/workflows/plg-scraper.yml`。

目前設定：

- 排程：每小時執行一次
- 行為：安裝依賴、安裝 Playwright Chromium、執行 scraper、提交 `data/` 變更並推送

這代表 `PLG` 的本地 JSON 會由 workflow 持續維護，部署平台只需要重新吃到最新 repository 內容。

## 部署

本專案以 `Vercel` 為主要部署目標。

- Next.js 頁面與 API route 由 Vercel 提供 hosting
- GitHub 內容更新後可觸發新的部署
- TPBL 即時資料由 `/api/tpbl/games` 在 server side 代理上游 API

## 重要檔案

- `app/components/experience/HomePageExperience.tsx`：首頁主組裝元件
- `app/hooks/schedule/useSchedule.ts`：共用賽程狀態與篩選邏輯
- `app/hooks/data/useLeagueData.ts`：整合三個聯盟資料
- `app/lib/plgMapper.ts`：PLG 資料轉換
- `app/lib/tpblMapper.ts`：TPBL API / fallback 資料轉換
- `app/lib/bclMapper.ts`：BCL 資料轉換
- `app/api/tpbl/games/route.ts`：TPBL API proxy
- `scripts/scrape-plg-schedule.ts`：PLG scraper

## 維護建議

- 若 TPBL 上游 API schema 變動，優先檢查 `app/lib/tpblMapper.ts`
- 若 PLG 官網版型改動導致 scraper 失效，檢查 `scripts/scrape-plg-schedule.ts`
- 若賽程 UI 需要新增篩選或排序邏輯，優先從 `app/hooks/schedule/useSchedule.ts` 著手
- 若 README 再次出現亂碼，請確認編輯器與提交內容使用 `UTF-8`
