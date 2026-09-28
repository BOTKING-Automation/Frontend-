# GitHub Pages

The frontend deploys to [https://botking-automation.github.io/Frontend-/](https://botking-automation.github.io/Frontend-/) using the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`.

Every push to `main` builds a static Next.js export and publishes it to GitHub Pages. The app is served below `/Frontend-`, so the Pages base path is configured in `next.config.js` for the workflow build.

## Backend connection

GitHub Pages hosts static files only; it cannot run the Next.js API rewrite or the trading backend. To enable login, broker connections, strategies, and account data on the hosted app, add a repository Actions variable named `NEXT_PUBLIC_API_URL` containing the backend origin, for example `https://kingbot-api.onrender.com` (without a trailing `/api`). The backend must allow browser requests from `https://botking-automation.github.io` through CORS.

Without that variable, the published prototype loads, but API-backed actions report that the trading service has not been connected.
