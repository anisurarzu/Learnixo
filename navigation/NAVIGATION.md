# Navigation Architecture

Learnixo uses **Expo Router** with a scalable group-based structure.

## Flow

```
Splash → Onboarding (3 steps) → Auth → Main App (Drawer + Tabs + Stack)
```

## Route groups

| Group                   | Purpose                     | Guard                              |
| ----------------------- | --------------------------- | ---------------------------------- |
| `(onboarding)`          | First-run experience        | Public                             |
| `(auth)`                | Login / register / password | Guest-only (`AuthGuard guestOnly`) |
| `(app)`                 | Protected app shell         | Auth required                      |
| `(app)/(drawer)/(tabs)` | Bottom tabs                 | Auth required                      |
| `(modals)`              | Modal presentations         | Auth (via stack)                   |

## Deep links

Schemes: `studyai://` · `aistudyassistant://`

| Alias                 | Destination      |
| --------------------- | ---------------- |
| `studyai://chat`      | AI Chat tab      |
| `studyai://documents` | Documents tab    |
| `studyai://profile`   | Profile tab      |
| `studyai://quiz`      | Quiz screen      |
| `studyai://summary`   | Document summary |

Resolved in `app/+native-intent.tsx` via `navigation/linking.ts`.

## Helpers

```ts
import { navigate, push, replace, goBack, reset, openModal } from '@/navigation';
import { ROUTES } from '@/constants/routes';

push(ROUTES.app.quiz, { quizId: '1' });
openModal(ROUTES.modals.upload);
```

## Types

See `types/navigation.ts` for param maps and `AppRoute` union.
