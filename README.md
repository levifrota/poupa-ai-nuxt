<p align="center">
  <img src="public/logo.svg" alt="Poupa.ai" width="200" />
</p>

<h1 align="center">Poupa.ai</h1>

<p align="center">
  A personal finance app that helps you track spending, budgets and savings goals —
  built with accessibility and AI at its core.
</p>

## About

Poupa.ai ("save money" in Portuguese) is a full-stack personal finance manager built
with Nuxt 3 and Firebase. Beyond the usual income/expense tracking, it focuses on two
differentials: **AI-assisted insights** (via Google Gemini) and **accessibility for
visually impaired users**, including voice input, text-to-speech, and screen-reader
friendly currency announcements.

## ✨ Features

### Core finance management
- **Transactions** — create, edit, and categorize income/expenses, with free-form tags
  for custom grouping (e.g. `trip-2026`, `reimbursable`)
- **Multi-account / wallet support** — split transactions across checking, credit card,
  and cash accounts, with per-account and global balances
- **Budgets per category** — set a monthly limit per category, with visual/textual
  alerts when spending nears (80%) or exceeds the limit
- **Savings goals** — set a target amount and deadline, and track progress with a
  progress bar; get warned as the deadline approaches
- **Recurring transactions** — mark transactions as weekly/monthly/yearly recurring,
  with auto-generated future occurrences and confirmation reminders
- **Bill reminders** — in-app and browser notifications for upcoming due dates
- **CSV export** — export filtered transactions for spreadsheets or accountants
- **Multi-currency display** — view your (BRL-stored) data converted to USD, EUR, GBP,
  and more, using live exchange rates with a static fallback
- **Family / shared budgets** — invite other users to a shared budget with
  owner-managed members, per-category limits, and email-based invites

### 🤖 AI-powered
- **AI financial reports** — generated insights over your transaction history using
  Google Gemini
- **AI chat** — ask questions about your own finances in natural language
- **Voice transaction entry** — say "gastei 50 reais em mercado" to log a transaction
  via the Web Speech API
- **Text-to-speech reports** — have your AI financial report read aloud

### ♿ Accessibility-first
- Semantic, `pt-BR`-tagged markup with a skip-to-main-content link
- Full currency values announced to screen readers (e.g. "1.234 reais e 56 centavos")
  instead of raw symbols
- Respects `prefers-reduced-motion` for charts and theme transitions
- Adjustable global font size

### 📱 Beyond the browser
- **Installable PWA** with offline-friendly assets
- **Web Share Target** — share a bank/card notification from your phone directly to
  Poupa.ai to pre-fill a new transaction for review (nothing is ever auto-saved)
- **Telegram bot integration** — link your account and log transactions straight from
  Telegram

## 🧭 Differentials

- **Privacy-conscious parsing** — notification/voice-based transaction entry always
  requires user confirmation before saving; no automatic writes from untrusted input
- **Data stays in BRL** — currency conversion is display-only, keeping the underlying
  ledger consistent regardless of the user's preferred display currency
- **Accessibility as a first-class feature**, not an afterthought — driven by a
  dedicated [ROADMAP.md](ROADMAP.md) with real, shipped items
- **AI grounded in the user's own data** — reports and chat answers are generated from
  the user's actual transaction history, not generic advice

## 🛠️ Tech Stack

**Framework & UI**
- [Nuxt 3](https://nuxt.com/) (Vue 3, Vite, file-based routing)
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn-vue](https://www.shadcn-vue.com/) / [reka-ui](https://reka-ui.com/) components
- [Pinia](https://pinia.vuejs.org/) for state management
- [@nuxt/icon](https://nuxt.com/modules/icon), [@nuxt/fonts](https://nuxt.com/modules/fonts), [@nuxt/image](https://nuxt.com/modules/image)
- [@unovis](https://unovis.dev/) for charts (expenses per category, pie charts)
- [@tanstack/vue-table](https://tanstack.com/table) for the transactions data table
- [vee-validate](https://vee-validate.logaretm.com/) + [zod](https://zod.dev/) for form validation

**Backend & Data**
- [Firebase](https://firebase.google.com/) (Auth, Firestore) via [VueFire](https://vuefire.vuejs.org/) / `nuxt-vuefire`
- [firebase-admin](https://firebase.google.com/docs/admin/setup) for server-side (Telegram webhook) operations
- Nuxt server API routes (`server/api`) for the Telegram bot webhook

**AI & Integrations**
- [Google Gemini](https://ai.google.dev/) for AI reports and chat
- Web Speech API for voice input and text-to-speech
- Telegram Bot API for chat-based transaction logging
- Public exchange-rate API for multi-currency conversion

**PWA & Tooling**
- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt.html) for installability and the Web Share Target
- [Vitest](https://vitest.dev/) + [@vue/test-utils](https://test-utils.vuejs.org/) for unit testing
- [ESLint](https://eslint.vuejs.org/) + [Prettier](https://prettier.io/) (with `prettier-plugin-tailwindcss`)
- TypeScript throughout (services, stores, composables, server routes)

## 🚀 Getting Started

### Prerequisites
- Node.js and a package manager (npm, pnpm, yarn, or bun)
- A [Firebase](https://firebase.google.com/) project (Auth + Firestore enabled)
- A [Google Gemini API key](https://ai.google.dev/) for AI features
- (Optional) A [Telegram bot token](https://core.telegram.org/bots#how-do-i-create-a-bot) for the Telegram integration

### Install dependencies

```bash
npm install
```

### Environment variables

Copy [.env.example](.env.example) to `.env` and fill in your Firebase, Gemini, and
(optionally) Telegram credentials — see `runtimeConfig` in [nuxt.config.ts](nuxt.config.ts)
for how each variable is consumed.

```bash
cp .env.example .env
```

### Development server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Locally preview the production build:

```bash
npm run preview
```

### Testing

```bash
npm run test        # watch mode
npm run test:run    # single run
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment)
for more information on deploying to production.

## 📌 Roadmap

Full feature history and implementation details (with file references) live in
[ROADMAP.md](ROADMAP.md).
