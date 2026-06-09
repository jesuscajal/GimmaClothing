#!/usr/bin/env bash
# Actualizar y reiniciar la app en el VPS.
# Ejecutar desde /var/www/gimma-clothing:
#   bash deploy/deploy-app.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Git pull..."
git pull origin main || git pull origin master || true

echo "==> Corregir finales de línea (CRLF) en scripts..."
sed -i 's/\r$//' deploy/*.sh 2>/dev/null || true

echo "==> Dependencias..."
npm ci

echo "==> Docker (PostgreSQL + Redis)..."
if [ -f deploy/env/docker.env ]; then
  docker compose -f deploy/docker-compose.prod.yml --env-file deploy/env/docker.env up -d
else
  echo "AVISO: Falta deploy/env/docker.env — copiá desde deploy/env/docker.env.example"
fi

echo "==> Build backend..."
npm run build --workspace=@dtc/backend

echo "==> Sync .env al runtime de Medusa..."
if [ -f apps/backend/.env ]; then
  cp apps/backend/.env apps/backend/.medusa/server/.env
fi

echo "==> Build storefront..."
# Durante el build, el backend debe estar accesible en localhost
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

mkdir -p logs

echo "==> Reiniciar PM2..."
pm2 reload deploy/ecosystem.config.cjs --update-env || pm2 start deploy/ecosystem.config.cjs
pm2 save

echo ""
echo "Despliegue completado."
pm2 status
