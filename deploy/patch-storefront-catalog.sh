#!/usr/bin/env bash
set -euo pipefail
ROOT="/var/www/gimma-clothing"
GIMMA="apps/storefront/src/app/[countryCode]/(gimma)"

cp /tmp/map-category.ts "$ROOT/apps/storefront/src/lib/gimma/"
cp /tmp/products.ts "$ROOT/apps/storefront/src/lib/data/"
cp /tmp/categories.ts "$ROOT/apps/storefront/src/lib/data/"
cp /tmp/demo-footer.tsx "$ROOT/apps/storefront/src/modules/demo/components/"
cp /tmp/layout.tsx "$ROOT/$GIMMA/"
cp /tmp/tienda-page.tsx "$ROOT/$GIMMA/tienda/page.tsx"
cp /tmp/inicio-page.tsx "$ROOT/$GIMMA/inicio/page.tsx"

cd "$ROOT"
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

pm2 reload deploy/ecosystem.config.cjs --update-env
echo "Storefront actualizado."
