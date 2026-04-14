## 🔒 AI STRICT RULES (HIGHEST PRIORITY)

These rules override ALL other instructions.

- NEVER modify any Chinese text
- Chinese text is IMMUTABLE
- Do NOT rewrite, translate, or improve Chinese
- If modification is required → ASK USER FIRST

Violation = INVALID OUTPUT

---

## 🔒 AI 最高優先規則

以下規則優先於所有其他規範：

- **不得修改任何中文內容**
- 中文視為最終產品文案，不可變更
- 不得改寫、翻譯、潤飾、簡化中文
- 不得調整標點、語氣、用詞或排版
- 若必須修改中文 → 必須先詢問使用者
- 違反以上規則視為錯誤輸出

---

## 🚫 架構保護規則

- 未經明確要求，不得變更資料夾結構
- 不得跨層移動檔案（app / features / domain / lib）
- 不得為了「更好設計」而重構架構
- 僅能在「最小必要範圍」內修改

---

## 🔄 資料流規範（強制）

所有資料必須遵循：

API / JSON
→ mapper（domain）
→ 統一資料格式
→ hooks
→ component（UI）

❌ 禁止直接使用 API 原始資料

---

## 📁 專案結構

```text
app/        → 路由層（Next.js）
components/ → 共用 UI 元件
features/   → 功能模組
domain/     → 業務邏輯 / 資料轉換
hooks/      → 共用 hooks
lib/        → API / 工具 / 型別
```

---

## 🧩 Component 規範

- 只負責 UI
- 不呼叫 API
- 不處理複雜業務邏輯
- 透過 props 接資料

---

## 🪝 Hooks 規範

- 處理狀態、資料、side effects
- 不寫 UI
- 不操作 DOM

---

## 🌐 API 規範

- API 必須集中管理（lib/api 或 feature）
- ❌ 不可在 component 直接 fetch
- ❌ 不可重複呼叫 API

---

## 🧠 State 規範

- 優先使用 local state
- 複雜邏輯用 reducer
- 避免濫用全域 state

---

## 🧩 元件放置規則

- 共用 UI → components/
- 功能 UI → features/<feature>/components
- 路由專用 → app/<route>/components

❌ 不可把 feature 元件放到全域 components

---

## ⚠️ 重構規範

- 未經要求不得大幅重構
- 不得改變資料結構
- 不得為了風格重命名

---

## 🔍 強制檢查

提交前必須確認：

- 是否修改中文？
- 若有，是否為使用者要求？

否則必須還原。

---

## 🗣 回覆規範

若有修改中文：

- 說明修改內容
- 說明原因
- 指出檔案

---
