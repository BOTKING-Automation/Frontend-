# KingBot Frontend

Next.js 14 (App Router) + Tailwind. Every page calls the real backend API — no mock data.

## Setup

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

Open http://localhost:3000

## Pages included

- `/` — landing page
- `/signup`, `/verify`, `/login` — real signup with email + phone verification codes
- `/dashboard` — wallet balances (demo + live), open trades, P&L, trade history
- `/broker` — connect MT4/MT5 accounts (own login/password/server per user)
- `/strategies` — browse templates, configure per-user strategy (demo or live + broker)
- `/markets` — real TradingView advanced chart widget, symbol switcher
- `/analytics` — win rate, equity curve, P&L by symbol, demo vs live toggle
- `/journal` — trading journal tied to trades
- `/profile` — account status, M-Pesa payment submission + history
- `/education` — real article content pulled from the backend
- `/legal/terms`, `/legal/risk-disclosure`, `/legal/privacy` — full legal pages
- `/admin` — overview stats, payment approval queue, user management, image/media library

A floating AI support widget (bottom-right) is on every page and talks to the real
`/api/support` endpoint backed by Claude.

## Still to build (flagging honestly, not glossing over it)

- Admin role assignment: currently no UI to promote a user to `admin` — do it directly
  in the database for now: `UPDATE users SET role='admin' WHERE email='you@example.com';`
- Password reset flow (forgot password) isn't built yet — only change-password while
  logged in exists.
- The strategy engine (backend `src/services/strategyEngine.js`) needs to be run as a
  separate process (`npm run engine` in the backend) — it's not triggered by the API server.
