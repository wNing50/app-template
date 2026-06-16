#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-}"
ACTION="${2:-}"
if [ "$MODE" != "dev" ] && [ "$MODE" != "prod" ]; then
  echo "usage: $0 <dev|prod>"
  exit 1
fi
if [ -n "$ACTION" ] && [ "$ACTION" != "--resolve-only" ]; then
  echo "usage: $0 <dev|prod> [--resolve-only]"
  exit 1
fi

write_output() {
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    printf '%s=%s\n' "$1" "$2" >> "$GITHUB_OUTPUT"
  fi
}

resolve_version() {
  if [ "$MODE" = "dev" ]; then
    APP_BASE_VERSION="$(node -p "require('./app/package.json').version" | tr -d '[:space:]')"
    CURRENT_DEV_VERSION="$(awk -F= '/^APP_ANDROID_LATEST_VERSION=/{print $2}' server/.env.dev | tr -d '[:space:]')"
    CURRENT_BASE="$(printf '%s' "$CURRENT_DEV_VERSION" | sed -E 's/^([0-9]+\.[0-9]+\.[0-9]+)(-dev[0-9]+)?$/\1/')"
    CURRENT_DEV_NUMBER="$(printf '%s' "$CURRENT_DEV_VERSION" | sed -nE 's/^([0-9]+\.[0-9]+\.[0-9]+)-dev([0-9]+)$/\2/p')"
    if [ "$APP_BASE_VERSION" = "$CURRENT_BASE" ] && [ -n "$CURRENT_DEV_NUMBER" ]; then
      RAW_VERSION="${APP_BASE_VERSION}-dev$((CURRENT_DEV_NUMBER + 1))"
    else
      RAW_VERSION="${APP_BASE_VERSION}-dev1"
    fi
  else
    RAW_VERSION="$(node -p "require('./app/package.json').version" | tr -d '[:space:]')"
  fi

  VERSION="$(printf '%s' "$RAW_VERSION" | tr -d '[:space:]' | sed 's/[^0-9A-Za-z._-]//g')"
  if [ -z "$VERSION" ]; then
    echo "invalid release version"
    exit 1
  fi

  if [ "$MODE" = "dev" ] && ! printf '%s' "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+-dev[0-9]+$'; then
    echo "dev release version must match x.x.x-devN, got: $VERSION"
    exit 1
  fi

  write_output version "$VERSION"
  echo "resolved ${MODE} version: $VERSION"
}

prepare_apk() {
  SOURCE_APK="app/outputs/AppTemplate.apk"
  test -f "$SOURCE_APK"
}

parse_public_oss_url() {
  local public_url="$1"
  local url_no_scheme host object_key

  url_no_scheme="${public_url#https://}"
  url_no_scheme="${url_no_scheme#http://}"
  host="${url_no_scheme%%/*}"
  object_key="${url_no_scheme#*/}"
  if [ "$host" = "$url_no_scheme" ] || [ -z "$object_key" ]; then
    return 1
  fi

  if [[ "$host" =~ ^(.+)\.(oss-[^.]+\.aliyuncs\.com)$ ]]; then
    OSS_BUCKET="${BASH_REMATCH[1]}"
    OSS_ENDPOINT="${BASH_REMATCH[2]}"
  else
    return 1
  fi

  PUBLIC_OBJECT_KEY="${object_key}"
}

upload_dev() {
  PUBLIC_URL="${RELEASE_OSS_PUBLIC_BASE_URL_DEV:-}"
  if [ -z "$PUBLIC_URL" ]; then
    echo "missing RELEASE_OSS_PUBLIC_BASE_URL_DEV"
    exit 1
  fi

  if ! parse_public_oss_url "$PUBLIC_URL"; then
    echo "RELEASE_OSS_PUBLIC_BASE_URL_DEV must include host and object path"
    exit 1
  fi

  ossutil config -e "${OSS_ENDPOINT}" -i "${OSS_ACCESS_KEY_ID}" -k "${OSS_ACCESS_KEY_SECRET}" -L CH
  ossutil cp "app/outputs/AppTemplate.apk" "oss://${OSS_BUCKET}/${PUBLIC_OBJECT_KEY}" -f

  LATEST_URL="${PUBLIC_URL%/}"
  write_output latest_url "$LATEST_URL"
  echo "Dev Latest APK URL: ${LATEST_URL}"
}

upload_prod() {
  PUBLIC_URL="${RELEASE_OSS_PUBLIC_BASE_URL:-}"
  if [ -z "$PUBLIC_URL" ]; then
    echo "missing RELEASE_OSS_PUBLIC_BASE_URL"
    exit 1
  fi

  if ! parse_public_oss_url "$PUBLIC_URL"; then
    echo "RELEASE_OSS_PUBLIC_BASE_URL must include host and object path"
    exit 1
  fi

  ossutil config -e "${OSS_ENDPOINT}" -i "${OSS_ACCESS_KEY_ID}" -k "${OSS_ACCESS_KEY_SECRET}" -L CH
  ossutil cp "app/outputs/AppTemplate.apk" "oss://${OSS_BUCKET}/${PUBLIC_OBJECT_KEY}" -f

  LATEST_URL="${PUBLIC_URL%/}"
  write_output latest_url "$LATEST_URL"
  echo "Latest APK URL: ${LATEST_URL}"
}

resolve_version
if [ "$ACTION" = "--resolve-only" ]; then
  exit 0
fi
prepare_apk

if [ "$MODE" = "dev" ]; then
  upload_dev
else
  upload_prod
fi
