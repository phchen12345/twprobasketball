# 軟體設計文件

## Overview

Basketball Next Site 是一個使用 Next.js 建置的籃球賽程整合網站，整合了三個聯盟的賽程資料：

- PLG
- TPBL
- BCL Asia-East

系統提供統一的賽程瀏覽體驗，即使三個聯盟的資料來源策略不同：

- PLG 使用由 scraper 產生並隨專案打包的 JSON
- TPBL 使用執行期 API，並搭配內建 fallback JSON
- BCL 使用隨專案打包的 JSON

前端以 Next.js App Router 與 React 為核心，將捲動驅動的動畫首頁與可重用的賽程區塊結合，並共用篩選、分頁、已完成與即將開賽等互動邏輯。

## System Goals

- 提供單一頁面整合多個籃球聯盟的賽程資訊
- 將不一致的上游資料來源正規化為可供 UI 共用的資料模型
- 在不同聯盟之間重用同一套賽程互動邏輯
- 保留各聯盟的品牌視覺與呈現差異，同時避免重複撰寫賽程邏輯
- 當即時 API 無法使用時，仍能維持基本可用性
- 支援可部署的正式環境網站，並具備自動更新 PLG 賽程的流程

## Functional Requirements

### 使用者需求

- 使用者可以在同一頁查看 PLG、TPBL 與 BCL 的賽程區塊
- 使用者可以切換 `upcoming` 與 `completed` 賽程
- 使用者可以依月份篩選賽事
- 使用者可以依球隊篩選賽事
- 使用者可以對賽程結果進行分頁
- 使用者可以透過捲動與頁首導覽在聯盟區塊間切換
- 當聯盟資料提供對應連結時，使用者可以查看直播、重播或 recap

### 資料需求

- PLG 賽程資料必須由本地 JSON 載入
- TPBL 賽程資料必須透過 server-side API route 取得
- 當 TPBL 即時 API 無法使用時，系統必須回退到內建 JSON
- BCL 賽程資料必須由本地 JSON 載入
- 所有聯盟資料都必須在進入 UI 前先正規化成共用資料模型

### 維運需求

- PLG 賽程 JSON 必須能透過自動化 scraper 更新
- 系統必須可作為 Next.js 網站部署到 Vercel
- Repository 必須支援以 GitHub Actions 執行排程更新

## System Architecture

### 架構風格

本系統採用分層式前端架構，執行於 Next.js App Router 應用中，主要分為：

- Presentation Layer
- Schedule Interaction Layer
- Data Acquisition Layer
- Mapping 與 Domain Logic Layer

### 執行時技術堆疊

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- GSAP

### 高階結構

```text
app/page.tsx
-> HomePageExperience
   -> animation components
   -> navigation components
   -> schedule section components

hooks/data
-> 各聯盟資料取得
-> 聯盟資料聚合

hooks/schedule
-> 共用賽程 state 與衍生資料

lib
-> 各資料來源 mapper

domain
-> business rule 與 theme policy

api/tpbl/games
-> TPBL server-side proxy
```

### Next.js 職責

- `app/page.tsx` 作為頁面入口
- `app/api/tpbl/games/route.ts` 代理 TPBL 上游 API
- App Router 提供路由結構與 server/client 邊界
- 靜態資產與打包 JSON 由前端直接存取

### React 職責

- `HomePageExperience` 作為首頁 composition root
- hooks 封裝賽程狀態與動畫協調邏輯
- 可重用的 schedule components 負責顯示正規化後的資料
- league wrapper components 負責聯盟特有的樣式與行為

## Data Flow

### 整體資料流

```text
Source
-> API response 或 local JSON
-> mapper
-> normalized schedule game array
-> useLeagueData
-> useLeagueSchedules
-> useSchedule
-> schedule section UI
```

### 各聯盟資料流

#### PLG

```text
plg_schedule_2025_26.json
-> mapPlgRawGame
-> usePlgGames
-> useLeagueData
-> useLeagueSchedules
-> useSchedule
-> PlgScheduleSection
```

#### TPBL

```text
TPBL upstream API
-> /api/tpbl/games
-> mapTpblApiGame
-> useTpblGames
-> useLeagueData
-> useLeagueSchedules
-> useSchedule
-> TpblScheduleSection
```

Fallback 路徑：

```text
tpbl_schedule_2025_26_openers.json
-> mapFallbackTpblGame
-> useTpblGames fallback state
```

#### BCL

```text
bcl_schedule_2026.json
-> mapBclRawGame
-> useBclGames
-> useLeagueData
-> useLeagueSchedules
-> useSchedule
-> BclScheduleSection
```

## Component Design

### Composition Root

`HomePageExperience` 是首頁的 composition root。

主要職責：

- 建立動畫與 section 所需 refs
- 透過 data hooks 取得正規化後的聯盟資料
- 透過 schedule hooks 建立各聯盟賽程狀態
- 將動畫 state 與 presentation component 串接
- 將 league-specific props 傳入各 schedule section

### Schedule Component 設計

賽程 UI 主要拆成：

- `ScheduleSection`
- `PlgScheduleSection`
- `TpblScheduleSection`
- `BclScheduleSection`

`ScheduleSection` 是可重用的基底元件，負責：

- `upcoming` / `completed` tab 切換
- 月份與球隊篩選 UI
- 分頁 UI
- 單場賽事卡片版型

各聯盟 wrapper 則負責：

- theme 選擇
- league-specific 呈現規則
- league-specific actions，例如 replay、recap、live link

### useSchedule Hook 設計

`useSchedule` 是共用的賽程互動 hook。

職責如下：

- 將賽事切分為 `completed` 與 `upcoming`
- 依日期排序賽事
- 產生月份篩選選項
- 產生球隊篩選選項
- 套用月份與球隊篩選
- 對篩選結果進行分頁
- 在 view 或 filter 變動時重設頁碼

主要 state：

- `scheduleView`
- `currentPage`
- `selectedMonth`
- `selectedTeam`

主要衍生資料：

- `completedGames`
- `upcomingGames`
- `activeGames`
- `pagedGames`
- `monthOptions`
- `teamOptions`

### Data Hook 設計

#### usePlgGames

- 載入 PLG 本地 JSON
- 透過 `mapPlgRawGame` 將原始資料正規化

#### useTpblGames

- 先以 fallback JSON 初始化
- 透過 `/api/tpbl/games` 取得即時 TPBL 資料
- 成功時以 API 資料覆蓋 fallback

#### useBclGames

- 載入 BCL 本地 JSON
- 透過 `mapBclRawGame` 將原始資料正規化

#### useLeagueData

- 聚合 `plgGames`、`tpblGames`、`bclGames`
- 對頁面提供單一資料入口

#### useLeagueSchedules

- 對各聯盟分別套用 `useSchedule`
- 回傳每個聯盟對應的 schedule state

## Data Model

### Core Model: ScheduleGame

共用的正規化資料模型為 `ScheduleGame`：

```ts
type ScheduleGame = {
  gameId: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  awayTeam: {
    name: string;
    logo: string;
  };
  homeTeam: {
    name: string;
    logo: string;
  };
  awayScore?: number;
  homeScore?: number;
};
```

此模型作為可重用賽程 UI 的共用契約。

### 擴充模型

#### TpblGame

額外欄位：

- `status`
- `isLive`
- `replayUrl`
- `recapUrl`

#### BclGame

額外欄位：

- `liveUrl`

### 設計理由

正規化資料模型讓 UI 與 schedule hooks 能依賴穩定的一致 shape，同時保留各聯盟特有的欄位在擴充型別中。

## API Interface

### 內部 API Route

路徑：

```text
GET /api/tpbl/games
```

用途：

- 代理 TPBL 上游 API
- 避免 client 直接依賴上游服務
- 集中處理 TPBL request 的錯誤邏輯

實作位置：

- `app/api/tpbl/games/route.ts`

方法：

- `GET`

回傳格式：

- JSON

### 成功回應

- HTTP `200`
- body 為 TPBL 上游回傳的賽事 JSON

### 錯誤回應

- 若上游回傳非 200，回傳 JSON error 並沿用對應 status
- 若 fetch 發生例外，回傳 HTTP `500` 與 `{ "error": "Failed to fetch TPBL games" }`

### 前端使用方式

前端不直接使用原始 API response 進行 rendering，而是先透過 `mapTpblApiGame` 將資料正規化後，再進入共用 schedule 邏輯。

## Design Decisions

### 1. 使用共用的 useSchedule Hook

決策：

- 使用單一 generic hook 統一處理 completed/upcoming、篩選與分頁

理由：

- 即使各聯盟資料來源不同，賽程互動模式仍高度一致

效益：

- 避免重複撰寫 schedule state 邏輯
- 保持各聯盟互動行為一致

### 2. 先做資料 mapping 再進入 UI

決策：

- 所有資料在進入 schedule components 前先完成正規化

理由：

- 上游 JSON 與 API payload schema 不一致

效益：

- 可重用元件只需依賴穩定的資料 shape
- source-specific parsing 被限制在 mapper 檔案中

### 3. 在適合的地方使用 useMemo

決策：

- 僅在能保護昂貴計算或穩定 reference 的地方使用 `useMemo`

範例：

- 將靜態 JSON 轉成 normalized games
- 建立 completed / upcoming 等衍生賽程資料
- 建立 canvas frame source list

理由：

- 降低父層 re-render 時的不必要重算
- 在來源資料未變時穩定下游 dependency

### 4. TPBL 採用 fallback JSON

決策：

- 先用 fallback JSON 初始化 TPBL，再在執行期用 live API hydrate

理由：

- TPBL API 可能失效或暫時不可用

效益：

- 即使上游失敗，頁面仍可顯示基本賽程內容
- 提升整體可用性與韌性

### 5. 使用 league wrapper，而不是單一超大型 config

決策：

- 保留共用的 `ScheduleSection`，再搭配各聯盟 wrapper component

理由：

- 各聯盟在 actions、theme 與 presentation rule 上仍有明顯差異

效益：

- 共用 rendering 邏輯維持可重用
- 聯盟客製化邏輯保持清楚、可讀

## Deployment

### Vercel

前端適合部署在 Vercel，作為標準 Next.js 應用。

建議的 Vercel 流程：

- 將 GitHub repository 連接到 Vercel
- 為 pull request 建立 preview deployment
- 由主分支觸發 production deployment
- 在 Vercel 專案設定中配置 visitor API 等環境變數

### GitHub Actions

目前 repository 已包含 GitHub Actions workflow：

- `.github/workflows/plg-scraper.yml`

目前責任：

- 每小時排程執行一次
- 執行 PLG scraper
- 若資料有更新，將新的 JSON commit 並 push 回 repository

建議的部署關係：

```text
GitHub Actions
-> 更新 PLG JSON
-> push 回 repository
-> GitHub main branch 更新
-> Vercel 自動部署最新版本
```

### 維運說明

- Vercel 負責網站 build 與 hosting
- GitHub Actions 負責 PLG 自動化資料更新
- TPBL 即時資料透過 API proxy route 在執行期取得

## Summary

本系統透過可重用的 schedule interaction model 與 league-specific data pipeline，建立一個能整合多聯盟賽程的前端網站。Next.js 提供 routing 與 API proxy，React 管理賽程與動畫狀態，mapper 負責正規化不一致的上游資料，`useSchedule` 則集中處理共用互動邏輯。部署上以 Vercel 作為網站承載平台，並以 GitHub Actions 支援 PLG 資料的自動更新。
