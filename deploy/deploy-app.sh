#!/usr/bin/env bash
# Actualizar y reiniciar la app en el VPS.
# Ejecutar desde /var/www/gimma-clothing:
#   bash deploy/deploy-app.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Git pull..."
git pull origin main || git pull origin master || true

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

echo "==> Build storefront..."
npm run build --workspace=@dtc/storefront

mkdir -p logs

echo "==> Reiniciar PM2..."
pm2 reload deploy/ecosystem.config.cjs --update-env || pm2 start deploy/ecosystem.config.cjs
pm2 save

echo ""
echo "Despliegue completado."
pm2 status
