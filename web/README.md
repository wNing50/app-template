# App Template Web

## Run

```bash
npm --prefix web install
npm run web
npm run web:dev
npm run web:cloud
```

Vite listens on `0.0.0.0:5173`.

## Build

```bash
npm --prefix web run build
npm --prefix web run build:dev
npm --prefix web run build:cloud
```

## Environment

Set `VITE_API_BASE_URL` in files under `web/env/` when the public web shell should call the API.
