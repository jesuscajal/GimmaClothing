#!/usr/bin/env bash
# Deploy RÁPIDO — solo tienda (cambios de diseño / UI).
# ~1–2 minutos. No reinstala dependencias ni recompila el backend.
#
# Uso en el VPS:
#   cd /var/www/gimma-clothing && bash deploy/deploy-storefront.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LOCK_MARKER="$ROOT/.deploy-package-lock.sha256"

hash_lock() {
  sha256sum package-lock.json 2>/dev/null | awk '{print $1}'
}

install_deps_if_needed() {
  if [ "${SKIP_DEPS:-}" = "1" ]; then
    echo "==> Dependencias: omitidas (SKIP_DEPS=1)"
    return 0
  fi

  local current previous
  current="$(hash_lock)"
  previous=""
  [ -f "$LOCK_MARKER" ] && previous="$(tr -d '[:space:]' < "$LOCK_MARKER")"

  if [ "$current" = "$previous" ] && [ -d node_modules ]; then
    echo "==> Dependencias: sin cambios (omitido)"
    return 0
  fi

  echo "==> Dependencias: package-lock cambió, instalando..."
  if ! npm ci 2>/dev/null; then
    echo "    npm ci falló, usando npm install..."
    npm install
  fi
  printf '%s\n' "$current" > "$LOCK_MARKER"
}

echo "==> Git pull..."
git fetch origin main
git reset --hard origin/main

echo "==> Corregir CRLF en scripts..."
sed -i 's/\r$//' deploy/*.sh 2>/dev/null || true

install_deps_if_needed

echo "==> Build storefront..."
STOREFRONT_ENV=apps/storefront/.env.local
BACKUP=""
if [ -f "$STOREFRONT_ENV" ]; then
  BACKUP=$(grep '^NEXT_PUBLIC_MEDUSA_BACKEND_URL=' "$STOREFRONT_ENV" | cut -d= -f2- || true)
  sed -i 's|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000|' "$STOREFRONT_ENV"
fi

npm run build --workspace=@dtc/storefront

if [ -n "$BACKUP" ] && [ -f "$STOREFRONT_ENV" ]; then
  sed -i "s|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=$BACKUP|" "$STOREFRONT_ENV"
fi

echo "==> Reiniciar solo storefront (PM2)..."
pm2 reload gimma-storefront --update-env

echo ""
echo "Storefront actualizado (~1–2 min). Backend sin tocar."
pm2 status
