# CLAUDE.md

This file gives future coding agents the minimum context needed to work in this template.

## Project Shape

- `app/`: Expo + React Native + TypeScript mobile app.
- `server/`: Node/Express API with Docker deployment.
- `admin/`: Vue/Vite admin console.
- `web/`: Vue/Vite public web site.
- `scripts/`: version and Docker helpers.
- `skills/`: reusable agent workflows and architecture notes.

## Template Boundaries

This repository intentionally contains no product-specific business modules. Add business features behind clear routes, screens, services, and tests instead of expanding placeholder files indefinitely.

## App

- Navigation is defined in `app/src/types/navigation.ts`.
- Starter screens live in `app/src/screens/`.
- API helper lives in `app/src/services/api/client.ts`.
- Environment values live in `app/src/config/env.ts`.
- Android package is `com.example.apptemplate`; change it before publishing a real app.

## Server

- App factory: `server/src/app.js`.
- Environment parsing: `server/src/config/env.js`.
- Public routes: `GET /health`, `GET /public/config`.
- Demo auth routes: `POST /auth/login`, `GET /me`.
- Admin route: `GET /admin/health`.
- SQL seed: `server/sql/init_schema.sql`.

## Deployment

- Production Docker: `npm run docker:redeploy`.
- Dev Docker: `npm run docker:redeploy:dev`.
- SSH database tunnel: `npm run server:channel`, configured with `CHANNEL_*` environment variables.
- Production workflow: `.github/workflows/android-release.yml`.
- Dev workflow: `.github/workflows/android-release-dev.yml`.
- Remote paths are configured with repository variables `REMOTE_APP_DIR` and `REMOTE_APP_DIR_DEV`.

## Validation Baseline

Run the relevant checks before handing off changes:

```bash
npm run test:server
npm run test:app
npm run test:app:typecheck
npm run test:admin
npm run test:scripts
npm --prefix admin run build
npm --prefix web run build
```

## Working Rules

- Keep edits focused on the package or feature being changed.
- Prefer small files with clear responsibilities.
- Avoid committing generated build output.
- Update `skills/current-architecture.md` when the template structure changes.
