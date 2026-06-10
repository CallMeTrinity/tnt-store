# TNT Store

Personal Android app store — a Vue 3 SPA/PWA that lists your own apps and serves their APKs straight from **GitHub Releases**. New releases on GitHub show up automatically; no redeploy of the store needed.

## How it works

- `src/apps.json` is the catalog: a list of public GitHub repos.
- For each repo, the app calls the public GitHub Releases API in the browser and shows the latest version, release notes, version history, and every `.apk` asset with size/downloads, plus a QR code so you can scan a download link from your phone.
- Release data is cached in `localStorage` (stale-while-revalidate, 10 min TTL) and by the service worker, so the store loads instantly and works offline with last-known data. APK files themselves are never cached.
- Unauthenticated GitHub API limit is 60 requests/hour/IP (1 request per repo per refresh) — plenty for personal use.

## Add an app

Append an entry to `src/apps.json` and redeploy:

```json
{
  "owner": "your-github-username",
  "repo": "your-app-repo",
  "name": "Display Name",
  "description": "Optional short description.",
  "icon": "/app-icons/your-app.png"
}
```

Only `owner` and `repo` are required. The repo must be **public** and its releases must contain `.apk` assets. `icon` is optional (a path under `public/` or any URL); without it a letter tile is shown.

> The two entries shipped in `apps.json` (NewPipe, Termux) are examples — replace them with your repos.

## Development

```sh
npm install
npm run dev       # dev server
npm run build     # production build to dist/
npm run preview   # serve the build (service worker active — test PWA install here)
npm run icons     # regenerate the PWA PNG icons in public/icons/
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: build, then rsync `dist/` to the Infomaniak server over SSH (host `https://store.antoninpamart.fr`).

Configured in the GitHub repo settings (already set via `gh`):

| Type     | Name              | Value                                          |
| -------- | ----------------- | ---------------------------------------------- |
| Secret   | `SSH_HOST`        | Infomaniak SSH host                            |
| Secret   | `SSH_USER`        | Infomaniak SSH user                            |
| Secret   | `SSH_PRIVATE_KEY` | private key (its public half in the server's `authorized_keys`) |
| Variable | `DEPLOY_PATH`     | site root under `/home/clients/…/sites/store.antoninpamart.fr` |

Server config: `public/.htaccess` is shipped with every build — it provides the SPA fallback for deep links, immutable caching for hashed assets, and `no-cache` for `sw.js`/`manifest.webmanifest`/`index.html`. **HTTPS is required** for the PWA to be installable (handled by Infomaniak).

## Stack

Vue 3 · Vite · vue-router · Tailwind CSS v4 · vite-plugin-pwa (Workbox) · marked · qrcode
