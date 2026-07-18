# StudyAI — AI Study Assistant

A production-ready React Native (Expo) foundation for an AI-powered study companion. Upload documents, chat with AI, generate quizzes and flashcards, and plan study sessions — all from a premium mobile experience.

![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Features (foundation)

- **AI Chat** — conversational study assistant shell
- **Documents** — PDF upload & summary placeholders
- **Quiz & Flashcards** — interactive study UI shells
- **Planner** — study schedule surface
- **Auth architecture** — email, Google, Apple, guest (secure token storage)
- **Design system** — Notion / Linear / Duolingo / ChatGPT-inspired UI kit
- **Dark & light mode** — system-aware theming

> Business logic and AI backends are intentionally stubbed so the app is easy to extend.

---

## Tech stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Framework      | Expo SDK 54, React Native 0.81            |
| Language       | TypeScript                                |
| Routing        | Expo Router (file-based)                  |
| Styling        | NativeWind (Tailwind CSS) + design tokens |
| State          | Zustand                                   |
| Server state   | TanStack Query                            |
| Forms          | React Hook Form + Zod                     |
| HTTP           | Axios (JWT + refresh + retry)             |
| Secure storage | Expo Secure Store                         |
| Cache          | MMKV (optional, memory fallback)          |
| Motion         | Reanimated + Gesture Handler              |
| Quality        | ESLint, Prettier, Husky                   |

---

## Getting started

### Prerequisites

- Node.js **20.19+** (see `.nvmrc`)
- npm 10+
- [Expo Go](https://expo.dev/go) **SDK 54** on your phone

### Install

```bash
git clone https://github.com/<your-username>/ai-study-assistant.git
cd ai-study-assistant
npm install
cp .env.example .env
```

### Run

```bash
npx expo start -c
```

Scan the QR code with Expo Go (SDK 54).

| Platform         | Command           |
| ---------------- | ----------------- |
| iOS simulator    | `npm run ios`     |
| Android emulator | `npm run android` |
| Web              | `npm run web`     |

Use **Sign in** or **Continue as guest** on the login screen to reach the main tabs.

---

## Project structure

```
app/                    # Expo Router screens
  (auth)/               # Login, register, forgot password
  (onboarding)/         # Onboarding carousel
  (tabs)/               # Home, Chat, Documents, Planner, Profile
  upload, summary, …    # Hidden feature screens
components/
  ui/                   # Design system components
  features/             # Domain feature modules (stubs)
theme/                  # Design tokens (colors, type, space, shadows)
store/                  # Zustand stores
services/api/           # Axios client + auth stubs
providers/              # Theme, Query, Toast, Gesture providers
hooks/                  # Shared hooks
config/                 # Env + React Query client
types/                  # Shared TypeScript models
```

---

## Design system

Import reusable UI from `@/components/ui`:

```tsx
import { Button, Card, useToast, GlassCard } from '@/components/ui';
import { useTheme } from '@/providers';
```

**Tokens** live in `theme/` (colors, typography, spacing, radius, shadows, icons, animations).  
**Docs:** [`components/ui/DESIGN_SYSTEM.md`](./components/ui/DESIGN_SYSTEM.md)

**Brand colors**

| Token     | Hex       |
| --------- | --------- |
| Primary   | `#4F46E5` |
| Secondary | `#7C3AED` |
| Accent    | `#06B6D4` |
| Success   | `#22C55E` |
| Warning   | `#F59E0B` |
| Error     | `#EF4444` |

---

## Environment

Copy `.env.example` → `.env`:

```env
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

Never commit `.env` (it is gitignored).

---

## Scripts

```bash
npm start          # Expo dev server
npm run lint       # ESLint
npm run format     # Prettier
npm run typecheck  # TypeScript
```

---

## Navigation map

**Tabs:** Home · AI Chat · Documents · Planner · Profile

**Hidden routes:** Splash · Onboarding · Login · Register · Forgot Password · Upload · Summary · Quiz · Flashcards · Settings · Subscription · Notifications

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

1. Create a feature branch from `main`
2. Keep changes focused (UI, API, or feature)
3. Run `npm run typecheck` and `npm run lint` before opening a PR

---

## License

MIT — see [LICENSE](./LICENSE)
