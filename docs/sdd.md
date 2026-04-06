# Software Design Document

## Overview

本專案是一個台灣職籃賽程整合網站，將 `PLG`、`TPBL` 與 `BCL Asia-East` 三個聯盟的賽程資料集中呈現在首頁，並結合滾動式動畫體驗。

本文件是總覽文件，負責：

- 定義系統目的與範圍
- 說明核心架構原則
- 補充完整 Data Model
- 提供其他設計文件索引

相關文件：

- [`docs/architecture.md`](/C:/Users/user/Desktop/React-practive/basketball-next-site/docs/architecture.md)
- [`docs/data-flow.md`](/C:/Users/user/Desktop/React-practive/basketball-next-site/docs/data-flow.md)
- [`docs/decisions.md`](/C:/Users/user/Desktop/React-practive/basketball-next-site/docs/decisions.md)

## Scope

本文件涵蓋：

- 系統目標
- 分層原則
- 型別模型
- 主要錯誤處理與效能原則
- 專案結構總覽

本文件不涵蓋：

- 視覺設計稿
- CI/CD 與部署細節
- scraper 內部實作細節

## Core Principles

### Layering

系統採四層分離：

- UI / Presentation
- Logic
- Data
- Domain

原因：

- 降低耦合
- 提高可維護性
- 避免 business logic 滲入 component

### Pure Component Rule

component 的原則是：

- 不做 fetch
- 不做 mapping
- 不做 business rule 判斷
- 只接收資料並 render

原因：

UI 最常變更。讓 UI 保持純粹，可以把設計調整與資料規則變更分開。

### Config-Driven Differences

不同聯盟的差異透過下列方式處理：

- domain config
- wrapper component
- theme injection

原因：

共用 UI 骨架可以最大化重用；而 league-specific 差異則應透過注入而不是在共用元件內寫大量分支。

## Main Runtime Entry

首頁入口：

- [`app/page.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/page.tsx)

首頁組裝元件：

- [`app/components/HomePageExperience.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/HomePageExperience.tsx)

`HomePageExperience` 是系統的 composition root，負責：

- 建立 section refs
- 組合 data hooks
- 組合 schedule hooks
- 組合 animation hooks
- 將結果傳給各 presentation component

## Data Model

核心型別定義於：

- [`app/components/scheduleTypes.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/scheduleTypes.ts)

### 1. Navigation and View Types

#### `ActiveNav`

```ts
type ActiveNav = "plg" | "tpbl" | "bcl" | null;
```

用途：

- 表示目前 scroll 狀態下活躍的聯盟區塊
- 給 `ScrollHeader` 高亮導覽使用
- 給首頁背景切換使用

設計原因：

這是 UI 與動畫之間的共享狀態，應使用明確 union type，而不是任意字串。

#### `ScheduleView`

```ts
type ScheduleView = "completed" | "upcoming";
```

用途：

- 控制 section 顯示的是即將開賽還是已完成比賽

設計原因：

這是 schedule UI 的核心切換狀態，使用 union type 可以避免非法值。

### 2. Core Entity Types

#### `TeamWithLogo`

```ts
type TeamWithLogo = {
  name: string;
  logo: string;
};
```

用途：

- 封裝球隊名稱與 logo 路徑
- 作為所有聯盟共用的 team representation

設計原因：

team 在 UI 層通常總是以「名稱 + logo」一起出現，把它抽成獨立型別可減少重複。

#### `BaseScheduleGame`

```ts
type BaseScheduleGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  away_team: TeamWithLogo;
  home_team: TeamWithLogo;
  away_score?: number;
  home_score?: number;
};
```

用途：

- 定義所有聯盟共用的 game 基底 shape
- 給 `ScheduleSection` 與 `useSchedule` 作為泛型邊界

欄位說明：

- `game_id`: 比賽唯一識別碼
- `date`: 比賽日期，格式為 `YYYY-MM-DD`
- `time`: 比賽時間
- `venue`: 場館或城市場館資訊
- `matchup`: 原始對戰字串
- `away_team`, `home_team`: 客主隊資訊
- `away_score?`, `home_score?`: 比分，未開打時可能不存在

設計原因：

三個聯盟的資料雖然來源不同，但渲染賽事卡片所需的核心欄位一致，因此需要一個穩定共享的型別基底。

### 3. League-Specific Game Types

#### `ScheduleGame`

```ts
type ScheduleGame = BaseScheduleGame;
```

用途：

- 表示 PLG 賽程資料

設計原因：

PLG 目前不需要額外欄位，所以直接使用共用基底即可。

#### `TpblGame`

```ts
type TpblGame = BaseScheduleGame & {
  status: string;
  is_live?: boolean;
  replay_url?: string;
  recap_url?: string;
};
```

用途：

- 表示 TPBL 正規化後的 game model

欄位補充：

- `status`: API 狀態，例如 `COMPLETED`、`ACTIVE`、`IN_PROGRESS`
- `is_live?`: 額外直播旗標
- `replay_url?`: 重播連結
- `recap_url?`: 回顧連結

設計原因：

TPBL 需要描述比賽狀態與額外媒體連結，因此不能只用 `BaseScheduleGame`。

#### `BclGame`

```ts
type BclGame = BaseScheduleGame & {
  live_url?: string;
};
```

用途：

- 表示 BCL 正規化後的 game model

設計原因：

BCL 除了共用欄位外，主要多一個直播連結，因此只補這個差異欄位即可。

### 4. Raw Source Types

#### `BclRawGame`

```ts
type BclRawGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  live_url?: string;
  away_score?: number;
  home_score?: number;
  away_team: string;
  home_team: string;
};
```

用途：

- 表示 BCL 原始 JSON 中尚未完成 team/logo 正規化的資料

設計原因：

raw type 與 normalized type 分開，可以清楚表達 mapping 邊界，避免 component 不小心依賴尚未整理好的資料。

#### `TpblFallbackGame`

```ts
type TpblFallbackGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  away_team: string;
  home_team: string;
};
```

用途：

- 表示 TPBL fallback JSON 的原始資料格式

設計原因：

fallback 檔案不一定和正式 API shape 一樣，因此需要單獨型別描述來源格式。

#### `TpblApiGame`

```ts
type TpblApiGame = {
  code: string;
  venue: string;
  status: string;
  is_live?: boolean;
  game_date: string;
  game_time: string;
  meta?: {
    recap?: string;
    live_stream_url?: string;
  } | null;
  home_team: {
    name: string;
    won_score?: number;
    lost_score?: number;
    meta?: {
      logo?: string;
    } | null;
  };
  away_team: {
    name: string;
    won_score?: number;
    lost_score?: number;
    meta?: {
      logo?: string;
    } | null;
  };
};
```

用途：

- 表示 TPBL 官方 API 原始 response shape

設計原因：

保留原始 API 型別可以讓 mapper 清楚處理「外部結構 -> 內部結構」的轉換，避免直接在 UI 層讀 API 欄位。

### 5. UI State Types

#### `ScheduleSectionState<T>`

```ts
type ScheduleSectionState<T> = {
  scheduleView: ScheduleView;
  setScheduleView: (value: ScheduleView) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  activeGames: T[];
  pagedGames: T[];
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  monthOptions: string[];
  teamOptions: string[];
};
```

用途：

- 定義 section UI 可依賴的完整 state contract
- 作為 `useSchedule` 的輸出型別
- 提供 `ScheduleSection` 與 league wrapper 共用

欄位說明：

- `scheduleView`: 目前 tab 狀態
- `currentPage`: 當前分頁
- `totalPages`: 總頁數
- `activeGames`: 經過 view/filter 後的全部比賽
- `pagedGames`: 當前頁實際顯示的比賽
- `selectedMonth`: 月份篩選值
- `selectedTeam`: 隊伍篩選值
- `monthOptions`: 可用月份選項
- `teamOptions`: 可用隊伍選項

設計原因：

UI 不應知道 schedule state 如何被計算；它只需要依賴一個穩定輸出契約。

### 6. Component Prop Types

#### `TpblSectionProps`

用途：

- 定義 TPBL wrapper component 所需 props

包含：

- `isThirdSectionActive`
- `isBclSectionActive`
- `thirdSectionRef`
- `schedule`
- `todayKey`

設計原因：

TPBL section 除了 schedule state 外，還受首頁背景狀態與動畫狀態影響，因此需要額外 props。

#### `BclSectionProps`

用途：

- 定義 BCL wrapper component 所需 props

包含：

- `isBclSectionActive`
- `schedule`
- `todayKey`

設計原因：

BCL section 需要根據 active 狀態切換 theme 與 CTA 樣式。

### 7. Type Relationship Summary

型別關係如下：

```text
TeamWithLogo
   └─ BaseScheduleGame
      ├─ ScheduleGame
      ├─ TpblGame
      └─ BclGame

TpblApiGame ----> tpblMapper ----> TpblGame
TpblFallbackGame -> tpblMapper ----> TpblGame
BclRawGame ------> bclMapper -----> BclGame

useSchedule<T> -------------------> ScheduleSectionState<T>
```

這個結構的意義是：

- 外部資料型別與內部資料型別分離
- 共享 UI 型別與 league-specific 型別並存
- hook 輸出 state 契約穩定

## Error Handling

目前錯誤處理的核心原則：

- TPBL API 失敗時使用 fallback JSON
- optional field 以型別明確表示
- 透過 mapper 與 build-time typing 儘早暴露資料問題

## Performance

目前效能策略：

- `useMemo` 用於 schedule 衍生資料計算
- 分頁限制單次渲染量
- GSAP 與 canvas 動畫隔離在 hooks
- PLG/BCL 使用靜態資料降低 runtime 依賴

## Folder Structure

```text
docs/
├─ sdd.md
├─ architecture.md
├─ data-flow.md
└─ decisions.md
```

應用程式主要結構：

```text
app/
├─ api/
├─ components/
├─ domain/
├─ hooks/
└─ lib/

data/
└─ *.json
```
