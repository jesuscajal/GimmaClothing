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

echo "==> build backend"
npm run build --workspace=@dtc/backend

echo "==> build storefront"
npm run build --workspace=@dtc/storefront

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
