# Learnixo

**AI Study Assistant** — a production-ready React Native (Expo) mobile app foundation that helps students learn smarter with AI chat, document analysis, quizzes, flashcards, and a study planner.

[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

**Repository:** [github.com/anisurarzu/Learnixo](https://github.com/anisurarzu/Learnixo)

---

## Overview

Learnixo is built as an **enterprise-grade mobile foundation**: clean architecture, a full design system, auth shells, API layer, and premium placeholder screens — ready to connect real AI and backend services.

| Area                           | Status                 |
| ------------------------------ | ---------------------- |
| App scaffold & navigation      | Done                   |
| Design system (light/dark)     | Done                   |
| Auth UI & secure token storage | Done (mock login)      |
| AI / PDF / quiz business logic | Stubbed for next phase |

---

## Features

- **AI Chat** — conversational study assistant UI
- **Documents** — PDF upload & summary screens
- **Quiz & Flashcards** — interactive study surfaces with animations
- **Study Planner** — schedule and task placeholders
- **Authentication** — email, Google, Apple, and guest flows (architecture ready)
- **Design system** — Notion / Linear / Duolingo / ChatGPT-inspired components
- **Theming** — light, dark, and system modes

---

## Tech stack

| Layer          | Technology                                     |
| -------------- | ---------------------------------------------- |
| Framework      | Expo SDK 54 · React Native 0.81                |
| Language       | TypeScript                                     |
| Routing        | Expo Router (file-based)                       |
| Styling        | NativeWind (Tailwind) + design tokens          |
| State          | Zustand                                        |
| Server state   | TanStack Query                                 |
| Forms          | React Hook Form + Zod                          |
| HTTP           | Axios (JWT, refresh, retry)                    |
| Secure storage | Expo Secure Store                              |
| Optional cache | react-native-mmkv (memory fallback in Expo Go) |
| Motion         | Reanimated · Gesture Handler                   |
| Quality        | ESLint · Prettier · Husky                      |

---

## Getting started

### Prerequisites

- Node.js **20.19+** (see `.nvmrc`)
- npm 10+
- [Expo Go](https://expo.dev/go) **SDK 54**

### Install & run

```bash
git clone https://github.com/anisurarzu/Learnixo.git
cd Learnixo
npm install
cp .env.example .env
npx expo start -c
```

Scan the QR code with Expo Go (SDK 54).

| Platform | Command           |
| -------- | ----------------- |
| iOS      | `npm run ios`     |
| Android  | `npm run android` |
| Web      | `npm run web`     |

On the login screen, use **Sign in** or **Continue as guest** to open the main tabs.

---

## Environment

Copy `.env.example` to `.env`:

```env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

Do not commit `.env` — it is gitignored.

---

## Project structure

```text
app/                     # Expo Router screens
  (auth)/                # Login, register, forgot password
  (onboarding)/          # Onboarding flow
  (tabs)/                # Home, Chat, Documents, Planner, Profile
  upload, summary, …     # Feature screens (hidden from tabs)
components/
  ui/                    # Design system
  features/              # Domain modules (stubs)
theme/                   # Colors, typography, spacing, shadows, icons
store/                   # Zustand stores
services/api/            # Axios client + auth API stubs
providers/               # Theme, Query, Toast providers
hooks/ · config/ · types/
```

---

## Design system

```tsx
import { Button, Card, GlassCard, useToast } from '@/components/ui';
import { useTheme } from '@/providers';
```

Full docs: [`components/ui/DESIGN_SYSTEM.md`](./components/ui/DESIGN_SYSTEM.md)

### Brand colors

| Token              | Hex       |
| ------------------ | --------- |
| Primary            | `#4F46E5` |
| Secondary          | `#7C3AED` |
| Accent             | `#06B6D4` |
| Success            | `#22C55E` |
| Warning            | `#F59E0B` |
| Error              | `#EF4444` |
| Background (light) | `#F8FAFC` |
| Background (dark)  | `#09090B` |

---

## Navigation

**Tabs:** Home · AI Chat · Documents · Planner · Profile

**Other screens:** Splash · Onboarding · Login · Register · Forgot Password · Upload · Summary · Quiz · Flashcards · Settings · Subscription · Notifications

---

## Scripts

```bash
npm start           # Expo dev server
npm run lint        # ESLint
npm run format      # Prettier
npm run typecheck   # TypeScript
```

---

## Roadmap

- [ ] Connect real auth (email / Google / Apple)
- [ ] Document upload + PDF analysis API
- [ ] Streaming AI chat
- [ ] Quiz & flashcard generation
- [ ] Study planner sync
- [ ] Subscription / billing

---

## Contributing

1. Fork the repo and create a feature branch from `main`
2. Keep PRs focused (UI, API, or feature)
3. Run `npm run typecheck` and `npm run lint` before opening a PR

---

## License

MIT — see [LICENSE](./LICENSE)

---

<p align="center">
  Built with Expo · TypeScript · NativeWind
</p>
