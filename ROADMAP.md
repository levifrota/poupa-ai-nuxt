# Poupa.ai — Feature Roadmap

List of features to implement to help users control their personal finances,
including accessibility support for visually impaired users.

Ordered from **easiest** to **most complex** to implement. Each feature is
implemented and committed individually on the `feat/adding-new-features` branch.

## Status legend
- ⬜ Not started
- 🟨 In progress
- ✅ Done

---

## 1. Quick wins / Accessibility polish
- ✅ `lang="pt-BR"` on `<html>` (was `pt-br`, W3C recommends region in uppercase) — [nuxt.config.ts](nuxt.config.ts)
- ✅ Skip-to-main-content link for keyboard/screen-reader users — [layouts/default.vue](layouts/default.vue)
- ✅ `aria-label` with full currency description on money values (e.g. `useMoney` composable) so screen readers announce "1.234 reais e 56 centavos" instead of raw symbols — [composables/useMoney.ts](composables/useMoney.ts), [components/SummaryCard.vue](components/SummaryCard.vue), [components/SummaryCards.vue](components/SummaryCards.vue)
- ✅ Respect `prefers-reduced-motion` for chart/theme animations — [app/assets/css/fonts.css](app/assets/css/fonts.css)
- ✅ Consistent font-size application app-wide (audited `useFontStore`/`fonts.css`, already applied globally via `documentElement` classes)

## 2. Transaction Tags
- ✅ Free-form tags on transactions (beyond fixed categories) for custom grouping (e.g. "trip-2026", "reimbursable") — [constants/transactions.ts](constants/transactions.ts), [service/transactionService.ts](service/transactionService.ts), [components/UpsertTransactionDialog.vue](components/UpsertTransactionDialog.vue), [components/transactions/columns.ts](components/transactions/columns.ts)

## 3. CSV Export
- ✅ Export filtered transactions (current date range) to CSV for spreadsheets/accountants — [lib/exportTransactions.ts](lib/exportTransactions.ts), [pages/transactions/index.vue](pages/transactions/index.vue)

## 4. Budgets per Category
- ✅ Monthly limit per `TransactionCategory` — [service/budgetService.ts](service/budgetService.ts), [stores/budgets.ts](stores/budgets.ts), [components/BudgetSettings.vue](components/BudgetSettings.vue)
- ✅ Visual/textual alert when a category nears or exceeds its budget — [components/ExpensesPerCategory.vue](components/ExpensesPerCategory.vue)

## 5. Savings Goals
- ✅ Create goals with target amount + deadline — [service/savingsGoalService.ts](service/savingsGoalService.ts), [stores/savingsGoals.ts](stores/savingsGoals.ts), [components/UpsertSavingsGoalDialog.vue](components/UpsertSavingsGoalDialog.vue)
- ✅ Track progress with a progress bar (reusing pattern from `ExpensesPerCategory.vue`) — [components/SavingsGoals.vue](components/SavingsGoals.vue), [pages/(home)/index.vue](pages/(home)/index.vue)

## 6. Recurring Transactions
- ✅ Mark a transaction as recurring (weekly/monthly/yearly) — [constants/transactions.ts](constants/transactions.ts), [service/transactionService.ts](service/transactionService.ts), [components/UpsertTransactionDialog.vue](components/UpsertTransactionDialog.vue)
- ✅ Auto-generate future occurrences / remind user to confirm them — [lib/recurrence.ts](lib/recurrence.ts), [stores/recurringTransactions.ts](stores/recurringTransactions.ts), [components/RecurringTransactionReminders.vue](components/RecurringTransactionReminders.vue), [pages/(home)/index.vue](pages/(home)/index.vue)

## 7. Bill Reminders / Notifications
- ⬜ Upcoming bill due-date reminders (in-app + optional browser notification)

## 8. Multi-account / Wallet Support
- ⬜ Split transactions across accounts (checking, credit card, cash)
- ⬜ Per-account balances in addition to the global balance

## 9. AI Chat ("ask your finances")
- ⬜ Conversational Q&A over the user's transaction history, extending the existing Groq-based AI report feature

## 10. Voice Input & Text-to-Speech (Accessibility)
- ⬜ Voice-based transaction entry ("gastei 50 reais em mercado")
- ⬜ Read the AI financial report aloud (Web Speech API)

## 11. Subscription / Paywall
- ⬜ Implement plan tiers and gate premium features (AI report, multi-account, etc.)

## 12. Family/Shared Budgets
- ⬜ Invite other users to a shared budget with permissions

## 13. Read transactions notifications on smartphone mode
- ⬜ Track transactions by reading notifications and adding them automatically to the app (e.g. bank notifications, credit card notifications, etc.)

## 14. Notify users when they are about to exceed their budget or savings goal
- ⬜ Notify users when they are about to exceed their budget or savings goal (e.g. via push notifications, email, or in-app alerts)

## 15. Implement subscription page for premium features
- ⬜ Implement subscription page for premium features (e.g. AI report, multi-account, etc.) with pricing and payment options. NOTE: do not implement the actual payment processing, just the UI and flow for subscribing. This feature will be available only in the future. For now, all features will be free to use. Hide the page for now.