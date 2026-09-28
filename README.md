# KingBot Frontend

Next.js 14 (App Router) + Tailwind. Every page calls the real backend API — no mock data.

## Setup

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

Open http://localhost:3000

## Frontend

The prototype runs as a single-page trading platform from `/`. Its in-app navigation includes authentication, dashboard, markets, strategies, broker connection, analytics, journal, education, profile, admin, and legal views. The application UI and API integrations are consolidated in `app/page.js`.

For the GitHub Pages deployment and backend configuration, see [GITHUB_SETUP.md](GITHUB_SETUP.md).

## Still to build (flagging honestly, not glossing over it)

- Admin role assignment: currently no UI to promote a user to `admin` — do it directly
  in the database for now: `UPDATE users SET role='admin' WHERE email='you@example.com';`
- Password reset flow (forgot password) isn't built yet — only change-password while
  logged in exists.
- The strategy engine (backend `src/services/strategyEngine.js`) needs to be run as a
  separate process (`npm run engine` in the backend) — it's not triggered by the API server.
