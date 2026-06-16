# App Template

Full-stack starter extracted from a production app and stripped of product-specific business logic.

## What Is Included

- `app/`: Expo + React Native + TypeScript mobile app with Android build scripts.
- `server/`: Express API with health checks, token middleware, Docker deployment, and SQL seed schema.
- `admin/`: Vue + Vite admin shell.
- `web/`: Vue + Vite public web shell with legal pages.
- `.github/workflows/`: test and Android release workflows for prod/dev deployments.
- `skills/`: reusable agent guidance and project architecture notes.

## Local Setup

Install dependencies per package:

```bash
npm i --prefix app
npm i --prefix server
npm i --prefix admin
npm i --prefix web
```

Run services:

```bash
npm run server
npm run admin
npm run web
npm run android
```

Open an optional SSH database tunnel:

```bash
set CHANNEL_SSH_TARGET=user@example.com
npm run server:channel
```

## Verification

```bash
npm run test:server
npm run test:app
npm run test:app:typecheck
npm run test:admin
npm run test:scripts
npm --prefix admin run build
npm --prefix web run build
```

## Deployment

Server deployment uses Docker Compose:

```bash
npm run docker:redeploy
npm run docker:redeploy:dev
```

GitHub Actions expects these secrets for remote deployment:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT`
- `RELEASE_OSS_ACCESS_KEY_ID`
- `RELEASE_OSS_ACCESS_KEY_SECRET`
- `RELEASE_OSS_PUBLIC_BASE_URL`
- `RELEASE_OSS_PUBLIC_BASE_URL_DEV`

Optional repository variables:

- `REMOTE_APP_DIR`, default `/opt/app-template`
- `REMOTE_APP_DIR_DEV`, default `/opt/app-template-dev`

See [Deployment](docs/deployment.md) for details.
