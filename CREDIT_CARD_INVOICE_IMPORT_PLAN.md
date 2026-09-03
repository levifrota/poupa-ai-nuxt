# Plan: Import Credit Card Invoice

Implementation plan for the credit card invoice upload feature, with
automatic extraction of expenses (date, description, amount, and suggested
category), as validated in previous analysis sessions.

## Context and decisions already made

- **Use of AI (Gemini):** viable and worth it. Since the invoice is used
  only once a month per card, and Gemini tokenizes PDFs at ~258
  tokens/page, the estimated cost is a fraction of a cent per invoice (see
  "Estimated cost" section). Reuses the same infrastructure already used by
  the Telegram bot (`lib/gemini.ts`,
  `server/api/telegram/webhook.post.ts`).
- **Privacy (LGPD/GDPR-style compliance):** invoices contain sensitive data
  (full name, national ID/CPF, address, partially masked card number). The
  strategy is to **minimize what is sent to Gemini**: extract text locally
  in the browser, filter only the transaction lines before sending to the
  server, and never persist the invoice content.
- **File disposal:** the original PDF/image only exists in memory in the
  browser (never uploaded to Storage/Firestore) and is discarded as soon as
  the text is extracted and the transaction list is reviewed/confirmed.
- **Password-protected invoices:** handled with a dedicated modal, using
  `pdfjs-dist`'s native support for `PasswordException`.
- **Mandatory review:** the AI may occasionally get amounts/dates wrong;
  the user always reviews/edits the list before confirming the import — no
  transaction is saved automatically without confirmation.

## Estimated cost (Gemini `gemini-2.5-flash-lite`)

| Item | Estimate |
|---|---|
| Input (invoice pages, filtered text + prompt) | ~1,000–1,500 tokens |
| Output (JSON with the transactions) | ~800–1,200 tokens |
| Cost per invoice | ≈ US$ 0.0005 (less than half a cent) |
| Monthly cost (1 invoice) | ≈ US$ 0.01 or less |

## New dependencies

- `pdfjs-dist` — PDF text extraction in the browser (client-side, no API
  cost). Run `runtime-tools-gh-advisory-database`/vulnerability check
  before installing.
- (Optional, future phase) `tesseract.js` — local OCR for scanned/photo
  invoices with no selectable text. Not part of the MVP.

## Implementation steps

### 1. Constants and types
- [ ] Use `TransactionPaymentMethod.CREDIT_CARD` as the fixed default value
  for transactions imported from an invoice (already exists in the enum in
  `constants/transactions.ts`, no change needed here — just enforce its
  use).
- [ ] Define a `ParsedInvoiceTransaction` type (name, amount, date,
  suggested category, `selected`/`confirmed` field for the review screen)
  in a new file `lib/parseInvoiceTransaction.ts` (or similar).

### 2. PDF text extraction (client-side)
- [ ] Install `pdfjs-dist`.
- [ ] Create `composables/usePdfTextExtractor.ts` (or
  `lib/pdfInvoice.ts`) that takes a `File`/`ArrayBuffer` and returns the
  text of each page.
- [ ] Handle password-protected PDFs:
  - Catch `PasswordException` (`code: NEED_PASSWORD` /
    `INCORRECT_PASSWORD`).
  - Expose reactive state (`needsPassword`, `passwordError`) for the UI to
    trigger the password modal.
  - Reopen the document with `getDocument({ data, password })` once the
    password is provided by the modal; allow retries on incorrect
    password.

### 3. Sensitive data filtering (client-side, before sending to the server)
- [ ] Create a `filterInvoiceLines(rawText: string): string` function in
  `lib/parseInvoiceTransaction.ts` that:
  - Removes/ignores lines matching CPF patterns
    (`\d{3}\.\d{3}\.\d{3}-\d{2}`), keywords ("CPF", "Endereço",
    "Titular"), and masked card numbers.
  - Keeps only lines matching the transaction-line pattern
    (`DD/MM  DESCRIPTION  AMOUNT`).
- [ ] Cover this function with unit tests (`tests/unit/`), including cases
  with CPF/address in the invoice to ensure they are stripped out.

### 4. Server endpoint (proxy to Gemini)
- [ ] Create `server/api/invoices/parse.post.ts`, similar to
  `server/api/telegram/webhook.post.ts`:
  - Receives **only the already-filtered text** (not the original file).
  - Validates a maximum length for the received text (equivalent to
    `MAX_MESSAGE_TEXT_LENGTH` in the Telegram webhook).
  - Builds the prompt via a new `buildInvoiceTransactionsPrompt(text)` in
    `lib/telegramTransaction.ts` (reusing the existing module) or a new
    `lib/invoiceTransaction.ts`, asking Gemini for an **array** of
    transactions (name, amount, date, category), unlike the current flow
    which extracts only a single transaction.
  - Calls `callGemini`/`extractGeminiText` (already available in
    `lib/gemini.ts`).
  - Parses and validates the returned JSON (numeric amount, valid date,
    category within the `TransactionCategory` enum), discarding/reporting
    as an error any malformed item.
  - Never logs or persists the invoice text at any point.
  - Requires user authentication (check the existing auth pattern used in
    other routes/services, e.g. Firebase Auth) before accepting the call.

### 5. UI component
- [ ] Create `components/ImportInvoiceDialog.vue`, following the visual
  pattern of the existing `Upsert*Dialog.vue` components:
  - File input (accept only `.pdf` in the MVP).
  - Loading state during extraction/parsing.
  - Password modal (`PasswordException`) when applicable.
  - Review table of the extracted transactions (name, amount, date,
    category — all editable), reusing patterns from
    `components/transactions/columns.ts` where possible.
  - "Confirm import" action: for each selected row, call `addTransaction`
    (`service/transactionService.ts`) with
    `paymentMethod: CREDIT_CARD`.
  - "Cancel" action: discards the state (file, extracted text, list)
    without saving anything.
- [ ] Add the entry point button for this dialog in
  `pages/transactions/index.vue` (or wherever other creation/import
  actions already live, e.g. CSV export).

### 6. Security and privacy — final checklist
- [ ] Confirm the original file (`File`/`ArrayBuffer`) only exists in
  memory in the component and is discarded (`= null`) after text
  extraction, never sent to Storage/Firestore.
- [ ] Confirm the invoice password only exists in a temporary reactive
  variable, never persisted or logged.
- [ ] Confirm the server endpoint does not log the invoice text (even on
  error/exception).
- [ ] Confirm the filtered text sent to Gemini contains no CPF, address, or
  full name (manual validation with sample invoices from different banks).
- [ ] Run `codeql_checker` and `runtime-tools-secret_scanning` on the
  new/changed files before finalizing.

### 7. Tests
- [ ] `tests/unit/parseInvoiceTransaction.test.ts` — line
  parsing/filtering, sensitive data removal, validation of the JSON
  returned by the AI (using mocked Gemini responses, following the pattern
  of `gemini.test.ts` / `telegramTransaction.test.ts`).
- [ ] Component tests for `ImportInvoiceDialog.vue` covering the
  incorrect/correct password flow and editing/removing rows before
  confirming.

### 8. Documentation
- [ ] Update `ROADMAP.md` with the new feature entry, following the
  pattern of the other entries (✅/🟨/⬜ status and list of files
  involved).
- [ ] Update `.env.example` if any new environment variable is needed
  (should not be the case — reuses the existing `VITE_GEMINI_API_KEY`).

## Out of scope (MVP)

- OCR for scanned/photo invoices with no selectable text (`tesseract.js`)
  — treat as phase 2, if there is real demand.
- Support for multiple bank formats with dedicated parsers — the MVP
  relies on Gemini to handle format variation.
- Automatic detection of installment purchases (e.g. "Compra 3/12") as a
  recurring transaction — can be added later, reusing the existing
  `RecurrenceFrequency` in `constants/transactions.ts`.
