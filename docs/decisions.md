# Design Decisions

## 1. Why Use `HomePageExperience` as Composition Root

決策：

- 將首頁 refs、動畫 hooks、資料 hooks、schedule hooks 集中在 [`HomePageExperience.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/HomePageExperience.tsx)

原因：

- 首頁需要同時協調 scroll animation、背景切換、三個聯盟 section
- 若分散在各 section，會造成 ref 與動畫耦合失控

取捨：

- composition root 會比一般 component 大
- 但換來更清楚的系統組裝邊界

## 2. Why Keep `useLeagueData` and `useLeagueSchedules` Separate

決策：

- `useLeagueData` 只處理資料取得
- `useLeagueSchedules` 只處理 schedule state 建立

原因：

- 資料來源與 state 建立是不同變化點
- 這樣可以避免單一 hook 職責過重

取捨：

- hook 數量增加
- 但責任更清楚，後續擴充更容易

## 3. Why `useSchedule` Is Shared Across Leagues

決策：

- 所有聯盟共用 [`useSchedule.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/hooks/useSchedule.ts)

原因：

- completed / upcoming
- 月份篩選
- 隊伍篩選
- 分頁

這些都是跨聯盟共通能力，不應重複實作。

取捨：

- 共用 hook 需要較穩定的泛型資料契約
- 但能大幅降低 duplication

## 4. Why Business Rules Are in Domain

決策：

- `isCompletedGame`
- `getTpblGamePresentation`
- `getBclGamePresentation`
- `getScheduledFooterLabel`

以上規則都集中在 [`app/domain/schedule.ts`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/domain/schedule.ts)

原因：

- UI 不應直接判斷 `status`
- hooks 不應同時承擔規則定義與 state orchestration
- 規則應可重用與可測試

取捨：

- 初期看起來檔案數變多
- 但長期能避免規則散落

## 5. Why `ScheduleSection` Is Reusable but League Wrappers Remain

決策：

- 共用 UI 骨架在 [`ScheduleSection.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/ScheduleSection.tsx)
- 各聯盟仍保留 wrapper

原因：

- TPBL 有直播、重播、回顧
- BCL 有直播與進場動畫
- PLG 有自己的 scene container

這些差異不只是文案不同，而是 presentation policy 不同。

取捨：

- wrapper 還是存在少量 league-specific code
- 但比把所有分支塞進單一共用元件更可讀

## 6. Why `PlgSceneContainer` Exists Outside `PlgScheduleSection`

決策：

- 將 PLG 背景 reveal 與 scroll scene 邏輯放在 [`PlgSceneContainer.tsx`](/C:/Users/user/Desktop/React-practive/basketball-next-site/app/components/PlgSceneContainer.tsx)

原因：

- 那是首頁場景容器，不是賽程內容本身
- 可以讓 `PlgScheduleSection` 保持 pure UI

取捨：

- 多一層 container
- 但動畫責任與內容責任分離

## 7. Why TPBL Uses Runtime Fallback

決策：

- TPBL API 失敗時 fallback 到本地 JSON

原因：

- 首頁不能因外部 API 問題而整段失效
- 舊資料通常比空畫面更可接受

取捨：

- fallback 資料可能不是最新
- 但使用者體驗更穩定

## 8. Why PLG and BCL Still Use Static JSON

決策：

- PLG 與 BCL 以本地 JSON 作為主要資料來源

原因：

- 提高穩定性
- 降低 runtime 對外部來源的依賴
- 容易控制欄位與 logo mapping

取捨：

- 即時性較低
- 需要資料更新流程

## 9. Risks and Future Trade-offs

### Theme Config Risk

目前 theme 仍是 class string config。

風險：

- config 變長後可讀性下降

### Static Data Drift Risk

PLG/BCL 若未更新，資料會過期。

### Naming Risk

目前 mapper 仍在 `app/lib`，語意上其實更接近 data layer，未來可考慮移到 `app/data`。
