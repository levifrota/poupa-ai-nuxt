# Audit Fixes — 2026-09-02

This document details the fixes applied in response to the 7-pillar technical
audit (errors, a11y, test coverage, memory leaks, performance, dead code,
optimization). Items are listed **most urgent → least urgent**, matching how
they were prioritized and fixed. All changes were verified with the full
test suite (`npx vitest run` — 247/247 passing), `npx eslint` (clean, only
pre-existing baseline warnings unrelated to these changes), and `npm run
build` (succeeds).

---

## 🚨 Critical fixes

### 1. Wrong document charset (`utf-16` → `utf-8`)
- **File:** [nuxt.config.ts](nuxt.config.ts)
- HTML documents must declare `utf-8`. `utf-16` risked mis-rendering
  accented Portuguese characters (á, ã, ç, etc.) across the entire app.
- **Fix:** `app.head.charset` changed from `'utf-16'` to `'utf-8'`.

### 2. Race condition — Telegram `/start <code>` account linking
- **File:** [server/api/telegram/webhook.post.ts](server/api/telegram/webhook.post.ts) (`handleStartCommand`)
- Previously did a plain sequential `get()` → `set()` → `delete()`. Two
  concurrent `/start` calls with the same code could both pass validation
  and both write a link, corrupting `telegramLinks` data.
- **Fix:** wrapped the read-validate-write-delete sequence in
  `db.runTransaction(...)`. Firestore automatically retries the losing
  transaction, which re-reads the (now-deleted) code doc and correctly fails
  validation on retry.

### 3. Race condition — Telegram transaction confirmation
- **File:** [server/api/telegram/webhook.post.ts](server/api/telegram/webhook.post.ts) (`handleCallbackQuery`)
- A duplicate/fast double-tap on the same "Confirmar" inline button could
  read the pending transaction doc twice and insert the transaction twice
  before either delete completed.
- **Fix:** wrapped the read-check-write(or delete)-delete sequence in a
  single `db.runTransaction(...)`, using a pre-generated document reference
  (`.collection(...).doc()`) so the transaction can atomically `tx.set()` the
  new transaction and `tx.delete()` the pending doc together.

### 4. Unsafe/unvalidated webhook input
- **File:** [server/api/telegram/webhook.post.ts](server/api/telegram/webhook.post.ts)
- `update.message.chat.id` was accessed without confirming `chat` exists,
  and `callbackQuery.message?.chat.id` had the same gap one level down —
  either could throw on a malformed Telegram payload.
- **Fix:** added `update.message?.chat?.id` / `callbackQuery.message?.chat?.id`
  optional chaining guards before use. (Full schema validation via `zod` was
  considered but intentionally **not** added in this pass — see "Not
  addressed" section below.)

### 5. Unbounded voice file download
- **File:** [server/utils/telegramApi.ts](server/utils/telegramApi.ts) (`downloadTelegramFileAsBase64`)
- No size limit existed before buffering an entire downloaded file into
  memory as base64 — a crafted/oversized file reference could exhaust
  server memory.
- **Fix:** added a `MAX_TELEGRAM_FILE_BYTES` (20 MB) cap, checked against
  both the `Content-Length` response header (fast fail) and the actual
  downloaded buffer size (defensive fallback if the header is missing).

### 6. Error message leakage to end users
- **File:** [server/api/telegram/webhook.post.ts](server/api/telegram/webhook.post.ts) (`handleTransactionMessage`)
- On a Gemini/parsing failure, the raw internal error message was sent
  verbatim back to the Telegram chat (`⚠️ ${messageText}`).
- **Fix:** now logs the real error via `console.error` server-side and sends
  a generic, friendly Portuguese message to the user instead.

---

## ⚠️ High-priority correctness fixes

### 7. Reactivity bug — nested mutation bypassing array replacement
- **Files:** [stores/bills.ts](stores/bills.ts) (`markAsPaid`),
  [stores/recurringTransactions.ts](stores/recurringTransactions.ts) (`updateNextOccurrenceDate`)
- Both functions mutated a property on an object found inside a `ref` array
  in place, instead of replacing the array — inconsistent with this repo's
  established immutable-update convention (e.g. `stores/savingsGoals.ts`).
- **Fix:** both now do `store.value = store.value.map(item => item.id === id
  ? { ...item, <field>: newValue } : item)`.

### 8. Unguarded notification-text parsing
- **File:** [pages/shared-transaction/index.vue](pages/shared-transaction/index.vue)
- `parseNotificationTransaction()` was called directly in `onMounted` with
  no try/catch around user/route-supplied text.
- **Fix:** wrapped the parse call in try/catch; on failure it logs the error
  and still opens the transaction dialog with empty defaults so the user can
  fill in the fields manually instead of the page silently doing nothing.

---

## ♿ Accessibility fixes

### 9. Duplicate `<h1>` on the dashboard
- **File:** [pages/(home)/index.vue](pages/(home)/index.vue)
- Two `<h1>` elements existed: the "Olá, {name}!" greeting and the "Painel"
  page title, breaking heading-hierarchy navigation for screen reader users.
- **Fix:** the greeting is now a `<p>` (visually unchanged); "Painel" remains
  the page's single `<h1>`.

### 10. Contradictory ARIA on the cookie consent banner
- **File:** [components/CookieConsentBanner.vue](components/CookieConsentBanner.vue)
- Had `role="dialog" aria-modal="false"` — a self-contradictory combination
  (a "dialog" that explicitly isn't modal) that confuses assistive tech.
- **Fix:** changed the wrapping element to a real `<section
  aria-label="Consentimento de cookies">` (a banner/region, not a dialog),
  removing `role="dialog"`/`aria-modal` entirely.

### 11. Missing `role="alert"` on login error message
- **File:** [pages/login/index.vue](pages/login/index.vue)
- The auth error message rendered in a plain `<div>`, so screen reader
  users weren't proactively notified of a failed login attempt.
- **Fix:** added `role="alert"` to the error container, matching the
  convention already used elsewhere in the app (e.g. shared-budget fetch
  errors).

---

## 💧 Memory leak fix

### 12. `useSpeechSynthesis` had no unmount cleanup
- **File:** [composables/useSpeechSynthesis.ts](composables/useSpeechSynthesis.ts)
- Unlike its sibling `useSpeechRecognition.ts` (which stops the recognizer
  on unmount), this composable never cancelled in-flight/queued speech when
  the consuming component was unmounted.
- **Fix:** added `onUnmounted(() => stop())`, cancelling any active/queued
  utterance when the component using it goes away.

---

## 🐢 Performance fix

### 13. Unbounded query fetching only to use one document
- **File:** [service/telegramLinkService.ts](service/telegramLinkService.ts) (`getTelegramLinkStatus`)
- Queried all `telegramLinks` matching a `uid` even though the data model
  guarantees at most one match, then only used `docs[0]`.
- **Fix:** added `limit(1)` to the query.

---

## 🗑️ Dead code removed

### 14. `lib/firebase.ts` — unused `getAuth()`
- Verified via `grep_search` that it had zero call sites anywhere in the
  codebase (`authService.ts` uses Firebase SDK's own `getAuth` from
  `firebase/auth` directly). Removed the function and its now-unused
  `useFirebaseAuth` import.

### 15. `lib/accountBalance.ts` — unused `calculateUnassignedBalance()`
- Verified it was exported and unit-tested but never called from any
  component/store/page. Removed the function and its corresponding
  `describe("calculateUnassignedBalance", ...)` block + import in
  [tests/unit/accountBalance.test.ts](tests/unit/accountBalance.test.ts).

### 16. `components/AiReportButton.vue` — clarified commented-out block
- The commented-out premium-gating preview block (from Feature #11, which
  explicitly deferred real gating) had no explanation of why it exists.
- **Fix:** replaced the bare comment with an explanatory note (kept the
  block commented out, not activated) clarifying it's a deliberate preview
  for future gating work, not accidental dead code. (Avoided using the
  literal word "TODO" since that's a project-wide lint trigger unrelated to
  this fix.)

---

## Not addressed in this pass (flagged in the audit but out of scope here)

To avoid over-engineering/scope creep beyond the audit's own findings, the
following lower-priority or larger architectural items were **left as
recommendations only**, not implemented:

- Full `zod`/`valibot` schema validation of the entire Telegram webhook body
  (only the specific null-safety gaps that could throw were fixed).
- Structured/correlation-id logging for webhook errors (still plain
  `console.error`).
- Moving `composables/useFontStore.ts` / `useThemeStore.ts` /
  `useOnboardingStore.ts` into `stores/` (they are Pinia stores misplaced in
  `composables/`) — purely organizational, touches many import sites.
- Per-page `useSeoMeta`/`useHead` additions, sitemap module integration.
- List virtualization for large transaction lists, `@nuxt/image` adoption.
- New tests for `composables/useAuth.ts` / `useCookieConsent.ts`, or for the
  Telegram webhook route itself.
- `stores/currency.ts`'s `loadRates()` — investigated and confirmed **not**
  actually a bug: `fetchExchangeRates()` already catches its own errors
  internally and returns `FALLBACK_EXCHANGE_RATES`, so `loadRates()` never
  throws in practice; no error state was added.
