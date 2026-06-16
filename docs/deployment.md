# Deployment

The template keeps a production and development deployment path.

## Docker Server

The server runs behind an nginx proxy from `server/docker-compose.server-multi.yml`.

```bash
npm run docker:redeploy
npm run docker:redeploy:dev
```

Defaults:

- Production compose project: `app-template-server`
- Development compose project: `app-template-server-dev`
- Production public port: `8888`
- Development public port: `8889`

Override project names with:

- `DOCKER_PROJECT_PROD`
- `DOCKER_PROJECT_DEV`

## GitHub Actions

Release workflows build Android, optionally upload APKs to OSS, update server env version fields, and redeploy server/web/admin on a remote host.

Required deployment secrets:

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_PORT`

Required APK upload secrets when upload is enabled:

- `RELEASE_OSS_ACCESS_KEY_ID`
- `RELEASE_OSS_ACCESS_KEY_SECRET`
- `RELEASE_OSS_PUBLIC_BASE_URL`
- `RELEASE_OSS_PUBLIC_BASE_URL_DEV`

Repository variables:

- `REMOTE_APP_DIR`: production checkout path, defaults to `/opt/app-template`.
- `REMOTE_APP_DIR_DEV`: development checkout path, defaults to `/opt/app-template-dev`.

## Android Package

Before publishing a real app, change `com.example.apptemplate` in:

- `app/app.json`
- `app/android/app/build.gradle`
- `app/android/app/src/main/java/com/example/apptemplate/`
