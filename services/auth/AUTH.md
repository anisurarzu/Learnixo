# Authentication

Production-ready auth layer with a **mock backend**. Swap `services/auth/mock-auth.service.ts` for real HTTP calls inside `services/auth/index.ts` with minimal changes.

## Features

- Email login / register
- Google & Apple (mocked; ready for SDK wiring)
- Guest mode (ephemeral session)
- Forgot / reset password (OTP)
- Email verification + resend countdown
- Remember me + Secure Store persistence
- Session restore + refresh token
- Roles: `guest` · `student` · `premium_student` · `admin`

## Demo account

```
email:    demo@learnixo.app
password: Demo@1234
```

OTP codes for verify/reset are printed in the Metro console in `__DEV__`.

## Key files

| Path                        | Role                                |
| --------------------------- | ----------------------------------- |
| `services/auth/`            | Public API + mock backend + session |
| `store/auth.store.ts`       | Zustand auth state                  |
| `schemas/auth.schemas.ts`   | Zod validation + password strength  |
| `hooks/auth/`               | Reusable auth hooks                 |
| `components/features/auth/` | Auth UI building blocks             |
| `app/(auth)/`               | Screens                             |

## Usage

```ts
import { useAuthStore } from '@/store';
import { useAccessControl } from '@/hooks/auth';

const login = useAuthStore((s) => s.login);
const { isPremium } = useAccessControl();
```
