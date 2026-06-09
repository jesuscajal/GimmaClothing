#!/usr/bin/env bash
set -euo pipefail
ROOT="/var/www/gimma-clothing"
GIMMA="apps/storefront/src/app/[countryCode]/(gimma)"
CHK="apps/storefront/src/app/[countryCode]/(checkout)"

cp /tmp/gimma-types.ts "$ROOT/apps/storefront/src/lib/gimma/types.ts"
cp /tmp/gimma-variants.ts "$ROOT/apps/storefront/src/lib/gimma/variants.ts"
cp /tmp/gimma-checkout.ts "$ROOT/apps/storefront/src/lib/gimma/checkout.ts"
cp /tmp/map-product.ts "$ROOT/apps/storefront/src/lib/gimma/map-product.ts"
cp /tmp/whatsapp.ts "$ROOT/apps/storefront/src/lib/demo/whatsapp.ts"
cp /tmp/product-by-handle.ts "$ROOT/apps/storefront/src/lib/data/product-by-handle.ts"
cp /tmp/cart-view.tsx "$ROOT/apps/storefront/src/modules/demo/components/cart-view.tsx"
cp /tmp/gimma-product-actions.tsx "$ROOT/apps/storefront/src/modules/gimma/components/gimma-product-actions.tsx"
cp /tmp/gimma-checkout-button.tsx "$ROOT/apps/storefront/src/modules/gimma/components/gimma-checkout-button.tsx"
cp /tmp/carrito-page.tsx "$ROOT/$GIMMA/carrito/page.tsx"
cp /tmp/producto-page.tsx "$ROOT/$GIMMA/producto/[handle]/page.tsx"
cp /tmp/inicio-page.tsx "$ROOT/$GIMMA/inicio/page.tsx"
cp /tmp/checkout-layout.tsx "$ROOT/$CHK/layout.tsx"

cd "$ROOT"
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
pm2 reload gimma-storefront --update-env
echo "Checkout + WhatsApp desplegado."
