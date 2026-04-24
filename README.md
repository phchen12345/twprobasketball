# Basketball Next Site

以 `Next.js 15` 建構的台灣職籃賽程網站，整合 `PLG`、`TPBL`、`BCL Asia-East` 的賽程資料，提供近期與已完賽事檢視、資料轉換、前端展示，以及部分資料來源的抓取與代理能力。

網站：`https://twprobasketball.vercel.app`

## 功能特色

- 顯示 `PLG`、`TPBL`、`BCL Asia-East` 賽程資料
- 支援 `upcoming` 與 `completed` 賽程切換
- 統一不同來源資料格式後再進行前端渲染
- 提供首頁體驗、動畫展示與導覽元件
- `TPBL` 使用 Next.js API route 代理上游 API
- `PLG` 使用 Playwright scraper 產出本地 JSON，並可透過 GitHub Actions 更新

## 技術棧

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `GSAP`
- `Playwright`

## 專案架構

```text
app/
  api/tpbl/games/route.ts          TPBL API proxy
  admin/page.tsx                   管理頁入口
  my-teams/                        我的球隊頁路由與頁內元件
  globals.css                      全域樣式
  layout.tsx                       layout
  page.tsx                         首頁入口
  robots.ts                        robots 設定
  sitemap.ts                       sitemap 設定

components/
  animation/                       首頁動畫相關 UI
  auth/                            登入與帳號操作 UI
  experience/                      首頁體驗與主組裝元件
  metrics/                         訪客計數等展示元件
  navigation/                      導覽與頁首 UI
  ui/                              基礎 UI 元件

features/
  notifications/                   通知功能元件與 hooks
  schedule/                        各聯盟賽程區塊元件

domain/
  mappers/                         各聯盟資料 mapper
  schedules/                       賽程模型與主題規則
  teams/                           球隊識別、logo、通知設定

hooks/
  animation/                       動畫 hooks
  data/                            資料讀取 hooks
  schedule/                        賽程整理與篩選 hooks

lib/
  api/                             API client
  storage/                         token、csrf 等儲存 helper
  types/                           共用型別
  utils.ts                         共用工具

context/                           React context
data/                              本地賽程 JSON
docs/                              設計文件
public/                            靜態資產與隊徽
scripts/                           scraper 腳本
```

## 資料來源

### PLG

- 本地資料檔：`data/plg_schedule_2025_26.json`
- 來源腳本：`scripts/scrape-plg-schedule.ts`
- 由 scraper 從 `pleagueofficial.com` 擷取並整理為前端可用 JSON

### TPBL

- API proxy：`app/api/tpbl/games/route.ts`
- client hook：`hooks/data/useTpblGames.ts`
- fallback 檔案：`data/tpbl_schedule_2025_26_openers.json`
- mapper：`domain/mappers/tpblMapper.ts`

### BCL Asia-East

- 本地資料檔：`data/bcl_schedule_2026.json`
- mapper：`domain/mappers/bclMapper.ts`

## 資料流程

首頁入口在 `app/page.tsx`，主要組裝邏輯位於 `components/experience/HomePageExperience.tsx`。

```text
賽程資料來源 (API / JSON)
-> mapper 正規化
-> useLeagueData
-> useLeagueSchedules / useSchedule
-> schedule section component
-> UI render
```

共用賽程狀態由 `hooks/schedule/useSchedule.ts` 管理，負責：

- 切換 `upcoming` / `completed`
- 日期排序與資料篩選
- 整合各聯盟賽程顯示狀態

## 開發需求

### 環境需求

- `Node.js 20+`
- `npm`

### 安裝依賴

```bash
npm install
```

### 啟動開發環境

```bash
npm run dev
```

### 建置與正式啟動

```bash
npm run build
npm run start
```

## 常用指令

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

1. 先嘗試用 `fetch` 取得 PLG 賽程頁面。
2. 若遇到動態內容或頁面限制，改用 `Playwright Chromium`。
3. 擷取賽程資訊並整理成結構化資料。
4. 輸出為前端可直接使用的 JSON 檔案。

可用環境變數：

- `PLG_SEASON`
- `PLG_SCHEDULE_URL`
- `PLG_OUTPUT_PATH`

手動執行：

```bash
npm run scrape:plg
```

## 自動更新

GitHub Actions workflow 位於 `.github/workflows/plg-scraper.yml`。

目前流程包含：

- 安裝專案依賴
- 安裝 Playwright Chromium
- 執行 scraper
- 提交 `data/` 變更並推送

## 部署

本專案部署於 `Vercel`：

- Next.js 頁面與 API route 由 Vercel hosting 提供
- GitHub push 後可自動觸發部署
- TPBL 資料透過 `/api/tpbl/games` 由 server side 代理上游 API

## 重要檔案

- `components/experience/HomePageExperience.tsx`：首頁主組裝元件
- `hooks/schedule/useSchedule.ts`：共用賽程狀態與篩選邏輯
- `hooks/data/useLeagueData.ts`：整合三個聯盟資料
- `domain/mappers/plgMapper.ts`：PLG 資料轉換
- `domain/mappers/tpblMapper.ts`：TPBL API / fallback 資料轉換
- `domain/mappers/bclMapper.ts`：BCL 資料轉換
- `app/api/tpbl/games/route.ts`：TPBL API proxy
- `scripts/scrape-plg-schedule.ts`：PLG scraper

## 維護建議

- 若 TPBL 上游 API schema 變動，優先檢查 `domain/mappers/tpblMapper.ts`
- 若 PLG 官網版型改動導致 scraper 失效，檢查 `scripts/scrape-plg-schedule.ts`
- 若賽程 UI 需要新增篩選或排序邏輯，優先從 `hooks/schedule/useSchedule.ts` 著手
- README 請持續使用 UTF-8 編碼，避免中文內容再次出現亂碼
