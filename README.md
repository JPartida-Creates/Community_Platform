# Program Platform Starter

Reusable cohort-learning platform starter.

## What ships

- **Frontend:** React 19 + Vite + Tailwind CSS v4 + React Router v7
- **Backend:** NestJS + Express with session auth
- **Data:** Local JSON persistence (`server/data/store.json`), auto-created on first boot
- **Features:** Curriculum topics with content (text, video, quiz, link), reflections, quizzes with scoring, community discussion with likes/votes, deliverables with submissions, feedback tracking, notifications, profile management, and admin dashboard

## Seeded demo accounts

All share the password `Starter123!`:

| Role | Email | Name |
|------|-------|------|
| Admin | `admin@example.com` | Alex Rivera |
| Faculty | `faculty@example.com` | Jordan Kim |
| Learner | `learner@example.com` | Taylor Brooks |

## Quickstart

```bash
# 1. Install dependencies (both workspaces)
cd server && npm ci --ignore-scripts && cd ..
cd client && npm ci --ignore-scripts && cd ..

# 2. Configure environment
cp server/.env.example server/.env

# 3. Run backend (port 3000)
cd server && npm run start:dev

# 4. Run frontend (port 5173) — in a separate terminal
cd client && npm run dev
```

Open `http://localhost:5173` and sign in with `learner@example.com` / `Starter123!`.

## Resetting the data store

Delete `server/data/store.json` and restart the server. It regenerates clean seed data automatically:

```bash
rm server/data/store.json
cd server && npm run start:dev
```

## Production build

```bash
# From the repo root
npm run build
```

The combined build serves the React frontend from the NestJS server. Start with:

```bash
cd server && npm run start:prod
```

## Running tests

```bash
cd server && npm test
```

## Attribution

- [NOTICE](./NOTICE)
- [AUTHORS.md](./AUTHORS.md)
- [LICENSE](./LICENSE)

## Next steps for production use

### Data persistence
Replace the local JSON store with a shared database:
- **PostgreSQL** is the recommended path — add a driver (`pg`, `typeorm`, `prisma`, or `drizzle`) and swap the `StoreService` for a repository layer.
- The current store methods (`findUserByEmail`, `createUser`, `saveQuizPerformance`, etc.) are self-contained in `server/src/store.service.ts` and map cleanly to SQL.

### Authentication
Swap session-based auth for your identity provider:
- **OAuth 2.0 / OIDC** — replace `express-session` with a passport strategy or your SSO provider's SDK.
- The `session.auth.guard.ts` guard isolates auth logic; replace its session check with your token validation.

### Production hardening
- **Secret management:** Move `SESSION_SECRET` and future DB credentials to a vault (e.g., environment secrets, HashiCorp Vault, cloud secret manager).
- **Rate limiting:** Already configured via `@nestjs/throttler`. Tune `ttl` and `limit` for your traffic profile.
- **Audit logging:** Add a structured logger (e.g., `pino`) and log auth events, data mutations, and admin actions.
- **Helmet & CORS:** Add `helmet` for security headers. Restrict `CLIENT_ORIGIN` to your production domain.
- **HTTPS:** Set `secure: true` on the session cookie and enable HTTPS in production.

### Testing & CI
- **Client tests:** Add `vitest` + `@testing-library/react` for component tests.
- **E2E tests:** Add `supertest`-based e2e tests for critical flows (login -> dashboard -> complete content -> submit deliverable).
- **CI:** The included `.github/workflows/ci.yml` runs build + test on push to `main`. Add `npm audit` and lint steps as needed.
