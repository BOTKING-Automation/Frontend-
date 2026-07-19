# Pushing to GitHub

```bash
cd kingbot-frontend
git init
git add .
git commit -m "Initial commit - KingBot frontend"
git branch -M main
git remote add origin https://github.com/<your-username>/kingbot-frontend.git
git push -u origin main
```

`.env.local` is gitignored — only `.env.local.example` should be committed.

## Hosting
**Vercel** is the natural fit for a Next.js app and this repo includes
`vercel.json` so it's a zero-config import:

1. Push this repo to GitHub (steps above).
2. In Vercel: **Add New > Project**, import the repo — it auto-detects Next.js.
3. Under **Environment Variables**, add `NEXT_PUBLIC_API_URL` set to your
   deployed backend's URL (e.g. `https://kingbot-api.onrender.com`).
4. Deploy. Every push to `main` redeploys automatically from then on.
