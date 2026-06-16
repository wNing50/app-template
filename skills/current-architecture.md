# Current Architecture

## Purpose

This repository is a reusable full-stack app template. It keeps deployable structure and removes product-specific business modules.

## Packages

- `app/`: Expo React Native mobile client.
- `server/`: Express API and Docker deployment unit.
- `admin/`: Vue/Vite admin console.
- `web/`: Vue/Vite public site.
- `scripts/`: version and Docker helpers.
- `.github/`: test and release workflows.

## Mobile App

Starter routes:

- `Auth`
- `Home`
- `Profile`
- `Settings`

Key files:

- `app/App.tsx`
- `app/src/types/navigation.ts`
- `app/src/config/env.ts`
- `app/src/services/api/client.ts`
- `app/scripts/build-android.js`

## Server

Starter routes:

- `GET /health`
- `GET /public/config`
- `POST /auth/login`
- `GET /me`
- `GET /admin/health`

Key files:

- `server/src/app.js`
- `server/src/config/env.js`
- `server/src/middleware/requireToken.js`
- `server/src/middleware/requireAdminToken.js`
- `server/sql/init_schema.sql`

## Admin

Starter pages:

- Dashboard
- Settings
- Login

Key files:

- `admin/src/App.vue`
- `admin/src/router/index.js`
- `admin/src/api/client.js`

## Public Web

Starter page:

- Home page with legal links and public config check.

Key files:

- `web/src/App.vue`
- `web/src/views/HomeView.vue`
- `web/src/api.js`

## Deployment

- Docker compose: `server/docker-compose.server-multi.yml`.
- Production workflow: `.github/workflows/android-release.yml`.
- Development workflow: `.github/workflows/android-release-dev.yml`.
- APK output: `app/outputs/AppTemplate.apk`.

## Validation

Baseline checks:

```bash
npm run test:server
npm run test:app
npm run test:app:typecheck
npm --prefix admin run build
npm --prefix web run build
```
