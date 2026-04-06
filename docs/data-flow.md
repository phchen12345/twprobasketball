# Data Flow

## Purpose

本文件說明各聯盟資料如何從外部來源進入系統，以及系統如何處理 fallback。

## Overview

整體資料流如下：

1. Data layer 讀取 API 或 JSON
2. Mapper 將外部格式轉為內部型別
3. Logic layer 建立 schedule state
4. Domain layer 判斷 game 狀態與顯示模式
5. UI layer 只做 rendering

## Common Internal Shape

所有聯盟最後都會被整理成 [`scheduleTypes.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/scheduleTypes.ts) 中的型別。

共同欄位：

- `game_id`
- `date`
- `time`
- `venue`
- `matchup`
- `away_team`
- `home_team`
- `away_score?`
- `home_score?`

差異欄位：

- TPBL: `status`, `is_live`, `replay_url`, `recap_url`
- BCL: `live_url`

## PLG Flow

### Source

- [`data/plg_schedule_2025_26.json`](/C:/Users/user/Desktop/React-practive/basketball-next-site/data/plg_schedule_2025_26.json)
- 更新工具：[`scripts/scrape-plg-schedule.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/scripts/scrape-plg-schedule.ts)

### Runtime Flow

```text
plg_schedule_2025_26.json
-> useLeagueData
-> useLeagueSchedules
-> PlgScheduleSection
```

### Rationale

PLG 使用靜態 JSON 的原因是穩定、可控，且適合透過 scraper 定期更新。首頁不必依賴 runtime API 成功。

## TPBL Flow

### Primary Source

- TPBL API
- [`useTpblGames.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useTpblGames.ts)
- [`tpblMapper.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/lib/tpblMapper.ts)

### Fallback Source

- [`data/tpbl_schedule_2025_26_openers.json`](/C:/Users/user/Desktop/React-practive/basketball-next-site/data/tpbl_schedule_2025_26_openers.json)

### Runtime Flow

```text
TPBL API
-> useTpblGames
-> mapTpblApiGame
-> useLeagueData
-> useLeagueSchedules
-> TpblScheduleSection
```

fallback:

```text
tpbl_schedule_2025_26_openers.json
-> mapFallbackTpblGame
-> useTpblGames fallback state
```

### Fallback Strategy

TPBL API 失敗時：

- 保留 fallback games
- 不讓首頁整段失敗
- 仍讓使用者看到可用賽程

### Rationale

TPBL 是動態來源，應優先使用 API；但首頁可用性比即時性更重要，所以必須有 fallback。

## BCL Flow

### Source

- [`data/bcl_schedule_2026.json`](/C:/Users/user/Desktop/React-practive/basketball-next-site/data/bcl_schedule_2026.json)
- [`bclMapper.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/lib/bclMapper.ts)

### Runtime Flow

```text
bcl_schedule_2026.json
-> useBclGames
-> mapBclRawGame
-> useLeagueData
-> useLeagueSchedules
-> BclScheduleSection
```

### Rationale

BCL 目前用本地 JSON 是因為資料量小、穩定性要求高，而且隊名與 logo 需要本地控制。

## Shared Schedule Processing

[`useLeagueSchedules.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useLeagueSchedules.ts) 會對三個聯盟統一呼叫 [`useSchedule.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useSchedule.ts)。

`useSchedule` 的責任：

- completed / upcoming 分組
- 月份過濾
- 隊伍過濾
- 分頁

設計原因：

這是一個跨聯盟共通能力，應集中管理，避免三個 section 各自重複實作。

## API Route Position

[`app/api/tpbl/games/route.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/api/tpbl/games/route.ts) 是外部 API 的整合點。

其價值在於未來可以集中處理：

- cache policy
- source switching
- error handling
- proxy 行為

## Risks

- 外部 API schema 變動可能導致 mapper 失效
- 靜態 JSON 若未更新會過期
- league data shape 若再分化，現有共用 schedule 邊界可能要再調整
