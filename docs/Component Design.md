# 元件設計文件

## 目的

本文件說明 Basketball Next Site 的元件設計方式，重點放在：

- 元件如何分層
- 各元件的責任邊界
- 元件與 hooks 的協作方式
- 共用元件與聯盟客製化元件如何拆分
- 動畫元件、賽程元件與頁面組裝元件之間的關係

本文件偏重「UI 結構與互動邊界」，不重複完整的系統層級架構與部署資訊。

## 設計原則

### 1. Composition Root 集中組裝

首頁的狀態整合與元件接線集中在 `HomePageExperience`，避免把資料取得、動畫狀態與跨區塊協調邏輯分散在多個 presentation component 中。

### 2. 共用結構與聯盟客製化分離

賽程 UI 由一個可重用的 `ScheduleSection` 作為基底，再由各聯盟 wrapper 負責 theme、文案、特殊按鈕與展示規則。

### 3. 動畫殼層與內容元件分離

動畫場景、scroll trigger 與 canvas frame 播放由 animation 元件與 hooks 負責，賽程元件只接收必要的 animation state，不直接操作 GSAP。

### 4. 先正規化資料，再進入元件

元件不直接處理上游 API 或 raw JSON 結構，而是依賴正規化後的 `ScheduleGame` 系列型別。

## 元件目錄結構

```text
app/components/
  animation/
    AnimationStage.tsx
    PlgSceneContainer.tsx
    RotatingBasketball.tsx

  experience/
    HomePageExperience.tsx

  metrics/
    VisitorCounter.tsx

  navigation/
    ScrollHeader.tsx

  schedule/
    BclScheduleSection.tsx
    PlgScheduleSection.tsx
    ScheduleSection.tsx
    scheduleTypes.ts
    TpblScheduleSection.tsx
```

### 分類理由

- `experience/`
  放頁面級的組裝元件
- `schedule/`
  放賽程展示元件與賽程 UI 型別
- `animation/`
  放動畫舞台與場景容器
- `navigation/`
  放頁首導覽元件
- `metrics/`
  放訪客數等獨立資訊元件

## 高階元件關係

```text
HomePageExperience
-> ScrollHeader
-> VisitorCounter
-> AnimationStage
-> PlgSceneContainer
   -> PlgScheduleSection
      -> ScheduleSection
-> TpblScheduleSection
   -> ScheduleSection
-> BclScheduleSection
   -> ScheduleSection
```

## Composition Root：HomePageExperience

檔案：

- `app/components/experience/HomePageExperience.tsx`

### 角色

`HomePageExperience` 是首頁的 composition root，負責把：

- animation hooks
- data hooks
- schedule hooks
- presentation components

全部接在一起。

### 主要責任

- 建立動畫與 section 需要的 refs
- 呼叫 `useTodayKey`
- 呼叫 `useLeagueData`
- 呼叫 `useLeagueSchedules`
- 呼叫 `useBasketballAnimation`
- 根據動畫 state 決定整體背景與 overlay
- 將各聯盟的 `schedule` state 分配給對應 section

### 管理的 refs

- `sectionRef`
- `stageRef`
- `contentSectionRef`
- `tpblSectionRef`
- `bclSectionRef`
- `canvasRef`

這些 refs 主要提供給動畫 hooks 與 section anchor 使用。

### 為什麼它是 composition root

因為首頁需要同時協調：

- 三個聯盟的賽程資料
- 共用的 schedule state
- 捲動驅動的動畫狀態
- 背景主題切換
- 各 section 的 ref 與 anchor

若將這些職責分散到各 section，會讓聯盟元件直接依賴動畫與資料組裝邏輯，增加耦合。

## 共用賽程基底：ScheduleSection

檔案：

- `app/components/schedule/ScheduleSection.tsx`

### 角色

`ScheduleSection` 是所有聯盟共用的賽程展示骨架。

它不關心資料來源，也不關心聯盟特有 API 欄位，而是依賴：

- 共用 `schedule` state
- normalized game model
- 外部注入的 theme 與 render callback

### 主要責任

- 顯示標題、描述與賽程數量
- 顯示 `upcoming` / `completed` 切換按鈕
- 顯示月份與球隊篩選
- 渲染目前頁面的賽事卡片
- 顯示分頁控制
- 套用共用卡片版型

### 重要 props

#### 結構相關

- `id`
- `sectionRef`
- `outerClassName`
- `containerClassName`
- `cardClassName`
- `articleClassName`
- `useCard`

#### 文案相關

- `eyebrow`
- `title`
- `description`
- `headerMetaClassName`

#### 狀態與行為相關

- `schedule`
- `theme`
- `getPresentation`
- `renderTopMeta`
- `renderActions`

### 設計重點

`ScheduleSection` 不自己決定：

- 這是 PLG、TPBL 還是 BCL
- live/final/scheduled 要怎麼判斷
- 是否要顯示 replay、recap、live link
- theme 應該是什麼顏色

這些都由 wrapper component 注入。

### 優點

- 讓結構型 UI 高度重用
- 各聯盟 wrapper 只需關注差異點
- schedule 互動行為集中於 `useSchedule`，UI 集中於 `ScheduleSection`

## 聯盟包裝元件

### PlgScheduleSection

檔案：

- `app/components/schedule/PlgScheduleSection.tsx`

#### 角色

PLG 專用 wrapper，負責把 PLG 的樣式與展示規則套進 `ScheduleSection`。

#### 主要責任

- 根據 `isTpblSectionActive` 與 `isBclSectionActive` 選擇 PLG theme
- 決定卡片外觀是否切換到透明深色主題
- 使用 `getPlgGamePresentation`
- 提供 PLG 專用 header meta 與 footer badge

#### 為什麼需要 wrapper

PLG 與其他聯盟雖然共用賽程版型，但在：

- pagination theme
- 卡片樣式
- final badge 呈現

上仍有自己的視覺規則，因此不適合直接使用通用 `ScheduleSection` 而不做包裝。

### TpblScheduleSection

檔案：

- `app/components/schedule/TpblScheduleSection.tsx`

#### 角色

TPBL 專用 wrapper，負責：

- TPBL theme
- TPBL 專屬 action button
- TPBL section 外層樣式

#### 主要責任

- 根據 `isTpblSectionActive` / `isBclSectionActive` 選 theme
- 將 `tpblSectionRef` 綁到 section
- 根據 TPBL 的狀態決定 `live` / `final` / `scheduled`
- 顯示 replay 與 recap action

#### 為什麼它比 PLG 多一點責任

TPBL 不只樣式不同，還多了：

- `replayUrl`
- `recapUrl`
- API 提供的 `status`

因此它需要比 PLG wrapper 更多的 league-specific 呈現邏輯。

### BclScheduleSection

檔案：

- `app/components/schedule/BclScheduleSection.tsx`

#### 角色

BCL 專用 wrapper，除了注入 BCL 視覺與行為，也同時負責 BCL 區塊的外層容器與可視狀態。

#### 主要責任

- 綁定 `bclSectionRef`
- 控制 BCL 區段外層背景 gradient
- 用 `IntersectionObserver` 控制 BCL 區塊的進場顯示
- 根據 `isBclSectionActive` 選 theme
- 顯示 live action

#### 與 TPBL 的一致性

目前 BCL 與 TPBL 一樣，由自己的 section 元件承擔：

- 外層 section ref
- 區塊背景殼
- 內部 schedule UI

這樣 `HomePageExperience` 只負責組裝，而不再額外包一層 BCL wrapper div。

## 動畫元件

### AnimationStage

檔案：

- `app/components/animation/AnimationStage.tsx`

#### 角色

`AnimationStage` 是動畫舞台，負責顯示：

- canvas
- loading state
- 首屏視覺文案
- logo 疊層

#### 主要責任

- 接收 `canvasRef` 讓 `useCanvasFrames` 繪圖
- 接收 `stageRef` 讓 GSAP pin 住動畫舞台
- 依 `isReady` 顯示或隱藏 loading 提示

#### 為什麼它是 presentation component

它不管理 frame preload，也不管理 scroll trigger。  
它只負責呈現 canvas 與首屏內容。

### PlgSceneContainer

檔案：

- `app/components/animation/PlgSceneContainer.tsx`

#### 角色

`PlgSceneContainer` 是 PLG 區塊的 scene-level 容器，而不是單純的 schedule wrapper。

#### 主要責任

- 綁定 `contentSectionRef`
- 作為 PLG 區塊的 scroll anchor
- 根據 `backgroundReveal` 控制背景位移
- 根據 `isTpblSectionActive` 與 `isPastAnimation` 控制背景透明與場景過渡
- 包住 `PlgScheduleSection`

#### 為什麼 PLG 需要 scene container

PLG 區塊除了賽程內容，還承擔：

- reveal 背景推進
- 首屏動畫後的場景過渡
- 與 TPBL 主題切換時的背景透明處理

因此它的外層責任已經超出一般 schedule section，獨立成 scene container 會更清楚。

## 導覽與資訊元件

### ScrollHeader

檔案：

- `app/components/navigation/ScrollHeader.tsx`

#### 角色

固定在頁面頂部的導覽列。

#### 主要責任

- 根據 `isPastAnimation` 切換 header 版型
- 根據 `activeNav` 顯示哪一個聯盟目前為 active
- 提供錨點連結至各 section

#### 依賴

- `isPastAnimation`
- `activeNav`

它不直接關心 schedule 狀態，只關心動畫與導覽狀態。

### VisitorCounter

檔案：

- `app/components/metrics/VisitorCounter.tsx`

#### 角色

顯示訪客數量的小型資訊元件。

#### 主要責任

- 呼叫 visitor API
- 管理本地 cooldown
- 顯示 loading、error 與 count

#### 與主頁的關係

它是附加在首頁上的獨立資訊元件，與 schedule 和 animation 沒有直接耦合。

## 元件與 Hook 協作

### 資料與賽程狀態協作

```text
usePlgGames / useTpblGames / useBclGames
-> useLeagueData
-> useLeagueSchedules
-> useSchedule
-> PlgScheduleSection / TpblScheduleSection / BclScheduleSection
-> ScheduleSection
```

#### 說明

- data hooks 只負責取得與正規化資料
- `useLeagueSchedules` 對每個聯盟建立 schedule state
- wrapper components 接收 `schedule`
- `ScheduleSection` 用同一份 state contract 顯示 UI

### 動畫協作

```text
useBasketballAnimation
-> useCanvasFrames
-> useGsapScrollAnimation
-> HomePageExperience
-> AnimationStage / ScrollHeader / PlgSceneContainer / league sections
```

#### 說明

- `useCanvasFrames` 管理 frame preload 與 `drawFrame`
- `useGsapScrollAnimation` 管理 ScrollTrigger 與動畫 state 變化
- `useBasketballAnimation` 將動畫 hooks 整合成單一對外介面
- `HomePageExperience` 把動畫 state 分配給 UI 元件

## Props 邊界設計

### ScheduleSection 的輸入邊界

`ScheduleSection` 的輸入不是 raw data，而是：

- `ScheduleSectionState<T>`
- `theme`
- `getPresentation`
- 可選的自訂 render callback

這讓它能保持通用，而不綁死聯盟。

### 聯盟 wrapper 的輸入邊界

各聯盟 wrapper 接收：

- 已經建立好的 `schedule`
- 當前需要的 scene/theme 狀態
- 必要的 section ref
- `todayKey`

它們不直接向上游 API 取資料。

### Animation 元件的輸入邊界

動畫 presentation component 接收：

- refs
- 已計算好的 animation state

它們不直接建立 ScrollTrigger，也不直接載入 frame 資源。

## Re-render 邊界

### 哪些元件會跟著動畫狀態 re-render

當以下狀態變動時：

- `isReady`
- `isPastAnimation`
- `backgroundReveal`
- `activeNav`
- `isTpblSectionActive`
- `isBclSectionActive`

`HomePageExperience` 會 re-render，因此其子樹也會重新執行 render。

這包含：

- `ScrollHeader`
- `AnimationStage`
- `PlgSceneContainer`
- 各聯盟 schedule wrapper

### 為什麼目前這樣是可接受的

因為頁面設計要求跨區塊同步主題：

- 進入 TPBL 區塊時，PLG 區塊也要同步切換主題
- 進入 BCL 區塊時，背景與聯盟區塊也要一起調整

因此部分共享 re-render 是合理的。

### 真正需要避免的是什麼

需要避免的是：

- 每次動畫狀態改變都重新 mapping 資料
- 每次動畫狀態改變都讓 schedule data 重新正規化
- 因單純 theme 切換導致重的 schedule 運算反覆重跑

目前這部分已透過 data hooks 與 schedule hooks 的分層設計降低成本。

## 主要設計決策

### 1. `ScheduleSection` 保持通用，聯盟差異交給 wrapper

理由：

- 避免把所有聯盟差異都塞進一個超大型條件式元件
- 讓通用 UI 骨架與聯盟特例分離

### 2. `HomePageExperience` 集中協調動畫、資料與區塊接線

理由：

- 首頁的跨區塊互動很多
- 若拆得太散，會讓 section 元件直接依賴動畫與資料取得細節

### 3. PLG 使用 `PlgSceneContainer`

理由：

- PLG 區塊除了 schedule 內容，還需要處理 reveal 背景與場景過渡
- 這個責任已經超出一般 section wrapper

### 4. BCL 與 TPBL 對齊為「section 自己管理外層殼」

理由：

- 保持 section 元件的責任一致
- `HomePageExperience` 不需要再額外包外層 wrapper div

## 後續擴充建議

若未來要新增新聯盟，建議流程如下：

1. 新增 league-specific data hook
2. 新增 mapper 與必要型別
3. 將資料接入 `useLeagueData`
4. 將 schedule state 接入 `useLeagueSchedules`
5. 新增對應的 wrapper component
6. 若需要特殊場景效果，再決定是否要建立額外 scene container

## Summary

本專案的元件設計核心是：

- 用 `HomePageExperience` 當 composition root
- 用 `ScheduleSection` 當共用賽程骨架
- 用聯盟 wrapper 處理 presentation 差異
- 用 animation 元件與 hooks 管理 scroll-driven 視覺效果

這樣的拆法能在保留多聯盟差異的同時，維持可重用的賽程 UI 結構與較清楚的責任邊界。
