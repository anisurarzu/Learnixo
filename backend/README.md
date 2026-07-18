# Learnixo API

Production backend for the Learnixo AI Study Assistant.

## Stack

Node.js · TypeScript · Express · PostgreSQL · Prisma · JWT · Zod · Redis (optional) · Docker

## Quick start

```bash
cd backend
cp .env.example .env

# Start Postgres (+ Redis) via Docker
docker compose up -d postgres redis

# Postgres is mapped to host port **5434** (avoids conflicts with local Postgres on 5432)

npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

- API: `http://localhost:4000/api/v1`
- Swagger: `http://localhost:4000/api/docs`
- Demo user: `demo@learnixo.app` / `Demo@1234`

## Architecture

```
src/
  config/         env, cors, rate-limit, swagger
  controllers/    HTTP adapters
  services/       business logic (auth, email, AI stub, storage)
  repositories/   Prisma data access
  middlewares/    auth, validate, errors, upload, rate limit
  routes/         /api/v1/*
  validators/     Zod schemas
  utils/          response, tokens, pagination, logger
  database/       Prisma client
  models/         Prisma type re-exports
```

## Auth endpoints

| Method | Path                        | Description          |
| ------ | --------------------------- | -------------------- |
| POST   | `/auth/register`            | Email registration   |
| POST   | `/auth/login`               | Email login          |
| POST   | `/auth/logout`              | Revoke refresh token |
| POST   | `/auth/refresh`             | Rotate tokens        |
| GET    | `/auth/me`                  | Current user         |
| POST   | `/auth/forgot-password`     | Send reset OTP       |
| POST   | `/auth/reset-password`      | Reset with OTP       |
| POST   | `/auth/verify-email`        | Verify email OTP     |
| POST   | `/auth/resend-verification` | Resend OTP           |
| POST   | `/auth/guest`               | Guest session        |
| POST   | `/auth/google`              | Google (stub)        |
| POST   | `/auth/apple`               | Apple (stub)         |

## Response format

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {},
  "errors": null
}
```

## Security

Helmet · CORS · rate limiting · bcrypt · JWT access/refresh rotation · Zod validation · httpOnly refresh cookies

## Prepared (not implemented)

- OpenAI / Gemini (`src/services/ai`)
- Cloudinary (`src/services/storage/cloudinary.service.ts`)
- PDF processing pipeline
- Redis cache (`REDIS_ENABLED=true`)

## Docker (full stack)

```bash
cp .env.example .env
docker compose up --build
```
