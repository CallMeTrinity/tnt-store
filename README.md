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

Pushing to `main` triggers `.github/workflows/deploy.yml`: build, then rsync `dist/` to your server over SSH.

Configure in the GitHub repo settings:

| Type     | Name              | Value                                          |
| -------- | ----------------- | ---------------------------------------------- |
| Secret   | `SSH_HOST`        | server hostname/IP                             |
| Secret   | `SSH_USER`        | SSH user                                       |
| Secret   | `SSH_PRIVATE_KEY` | private key (its public half in the server's `authorized_keys`) |
| Variable | `DEPLOY_PATH`     | web root, e.g. `/var/www/tnt-store`            |

Server config: see `docs/nginx.conf.example` — the SPA fallback (`try_files … /index.html`) is required for deep links, and `sw.js`/`manifest.webmanifest` must be served with `no-cache`. **HTTPS is required** for the PWA to be installable.

## Stack

Vue 3 · Vite · vue-router · Tailwind CSS v4 · vite-plugin-pwa (Workbox) · marked · qrcode
