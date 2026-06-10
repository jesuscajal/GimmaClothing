#!/usr/bin/env bash
# Corrige URLs de imágenes que apuntan a localhost tras subirlas en el admin.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/apps/backend/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "No existe $ENV_FILE"
  exit 1
fi

FILE_BASE=$(grep '^MEDUSA_FILE_BACKEND_URL=' "$ENV_FILE" | cut -d= -f2- | tr -d '[:space:]')
FILE_BASE="${FILE_BASE%/}"

if [ -z "$FILE_BASE" ]; then
  echo "Falta MEDUSA_FILE_BACKEND_URL en apps/backend/.env"
  exit 1
fi

echo "==> Actualizar URLs: localhost -> ${FILE_BASE}/"
docker exec -i gimma_postgres_prod psql -U gimma -d medusa-store -v ON_ERROR_STOP=1 <<-EOSQL
UPDATE image
SET url = REPLACE(url, 'http://localhost:9000/static/', '${FILE_BASE}/')
WHERE url LIKE 'http://localhost:9000/static/%';
EOSQL

echo "==> Listo."
