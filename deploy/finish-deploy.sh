#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
LOG="$ROOT/logs/deploy.log"
mkdir -p "$ROOT/logs"

exec > >(tee -a "$LOG") 2>&1

echo "=== finish-deploy $(date -Iseconds) ==="

echo "==> npm ci"
npm ci

echo "==> db setup"
npm run db:setup

echo "==> medusa admin user (skip if exists)"
cd apps/backend
npx medusa user -e admin@gimmaclothing.com -p GimmaAdmin2026! 2>/dev/null || true
cd "$ROOT"

echo "==> Corregir finales de línea (CRLF) en scripts..."
sed -i 's/\r$//' deploy/*.sh 2>/dev/null || true

echo "==> build backend"
npm run build --workspace=@dtc/backend

echo "==> Sync .env al runtime de Medusa..."
if [ -f apps/backend/.env ]; then
  cp apps/backend/.env apps/backend/.medusa/server/.env
fi

echo "==> build storefront"
STOREFRONT_ENV=apps/storefront/.env.local
BACKEND_URL_BACKUP=""
if [ -f "$STOREFRONT_ENV" ]; then
  BACKEND_URL_BACKUP=$(grep '^NEXT_PUBLIC_MEDUSA_BACKEND_URL=' "$STOREFRONT_ENV" | cut -d= -f2- || true)
  sed -i 's|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000|' "$STOREFRONT_ENV"
fi
npm run build --workspace=@dtc/storefront
if [ -n "$BACKEND_URL_BACKUP" ] && [ -f "$STOREFRONT_ENV" ]; then
  sed -i "s|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=$BACKEND_URL_BACKUP|" "$STOREFRONT_ENV"
fi

echo "==> pm2"
pm2 delete all 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save

echo "==> nginx"
cp deploy/nginx/gimma-ip.conf /etc/nginx/sites-available/gimma
ln -sf /etc/nginx/sites-available/gimma /etc/nginx/sites-enabled/gimma
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

pm2 status
echo "=== DEPLOY OK $(date -Iseconds) ==="
