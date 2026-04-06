# Architecture

## Purpose

本文件說明此專案的系統分層、主要模組責任，以及它們如何協作。

## System Layers

### UI / Presentation Layer

主要檔案：

- [`app/components/HomePageExperience.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/HomePageExperience.tsx)
- [`app/components/PlgSceneContainer.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/PlgSceneContainer.tsx)
- [`app/components/ScheduleSection.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/ScheduleSection.tsx)
- [`app/components/PlgScheduleSection.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/PlgScheduleSection.tsx)
- [`app/components/TpblScheduleSection.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/TpblScheduleSection.tsx)
- [`app/components/BclScheduleSection.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/BclScheduleSection.tsx)
- [`app/components/ScrollHeader.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/ScrollHeader.tsx)
- [`app/components/AnimationStage.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/AnimationStage.tsx)

責任：

- 純 rendering
- 接收已整理完成的 props 與 state
- 不負責 API 呼叫
- 不負責 business rule
- 不負責資料 mapping

設計原因：

UI 是變動最頻繁的一層。把它壓回 pure component，可以避免樣式調整影響資料邏輯，也能讓重構更安全。

### Logic Layer

主要檔案：

- [`app/hooks/useLeagueData.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useLeagueData.ts)
- [`app/hooks/useLeagueSchedules.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useLeagueSchedules.ts)
- [`app/hooks/useSchedule.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useSchedule.ts)
- [`app/hooks/useTpblGames.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useTpblGames.ts)
- [`app/hooks/useBclGames.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useBclGames.ts)
- [`app/hooks/useBasketballAnimation.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useBasketballAnimation.ts)
- [`app/hooks/useGsapScrollAnimation.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useGsapScrollAnimation.ts)
- [`app/hooks/useCanvasFrames.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useCanvasFrames.ts)
- [`app/hooks/useTodayKey.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useTodayKey.ts)

責任：

- 載入並組合資料
- 建立 schedule state
- 處理篩選、排序、分頁
- 協調動畫狀態

設計原因：

hooks 是 orchestration 層。它應該組合資料與規則，但不產生 JSX，這樣可以保持重用性與可測試性。

### Data Layer

主要檔案：

- [`app/lib/tpblMapper.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/lib/tpblMapper.ts)
- [`app/lib/bclMapper.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/lib/bclMapper.ts)
- [`app/api/tpbl/games/route.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/api/tpbl/games/route.ts)
- [`data/plg_schedule_2025_26.json`](/C:/Users/user/Desktop/React-practive/basketball-next-site/data/plg_schedule_2025_26.json)
- [`data/tpbl_schedule_2025_26_openers.json`](/C:/Users/user/Desktop/React-practive/basketball-next-site/data/tpbl_schedule_2025_26_openers.json)
- [`data/bcl_schedule_2026.json`](/C:/Users/user/Desktop/React-practive/basketball-next-site/data/bcl_schedule_2026.json)

責任：

- 存取外部資料來源
- 讀取本地 JSON
- 將外部欄位 mapping 成內部型別

設計原因：

資料來源不穩定且格式不同，必須集中管理。這樣未來替換 API、修欄位、補 logo mapping 時不會波及 UI。

### Domain Layer

主要檔案：

- [`app/domain/schedule.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/domain/schedule.ts)
- [`app/domain/leagueScheduleThemes.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/domain/leagueScheduleThemes.ts)

責任：

- game 狀態判斷
- presentation mode 判斷
- footer label 規則
- league-specific theme config

設計原因：

像「是否已完賽」、「是否直播中」、「應顯示什麼 badge」這類判斷不是 UI 細節，而是領域規則，應集中在 domain。

## Top-Level Composition

```text
app/page.tsx
└─ HomePageExperience
   ├─ ScrollHeader
   ├─ VisitorCounter
   ├─ AnimationStage
   ├─ PlgSceneContainer
   │  └─ PlgScheduleSection
   ├─ TpblScheduleSection
   └─ BclScheduleSection
```

## Composition Root

[`HomePageExperience.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/HomePageExperience.tsx) 是系統的 composition root。

責任：

- 建立 section refs
- 組合資料 hooks
- 組合 schedule hooks
- 組合 animation hooks
- 將結果傳給 presentation components

設計原因：

組裝邏輯需要集中。如果每個 section 自己抓資料、自己建 state、自己綁動畫，系統會快速變得不可維護。

## Shared UI Strategy

[`ScheduleSection.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/ScheduleSection.tsx) 是可重用的 section 骨架。

差異透過以下方式注入：

- `theme`
- `renderTopMeta`
- `renderActions`
- `getPresentation`

設計原因：

三個聯盟的版面高度相似，應共用 UI；但 TPBL、BCL 又各自有特殊 CTA 與狀態，因此使用 wrapper + config 比硬做單一巨型元件更合理。
