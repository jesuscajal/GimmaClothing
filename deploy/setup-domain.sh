#!/usr/bin/env bash
# Configurar dominio en el VPS (nginx + env + SSL + rebuild).
# Uso: bash deploy/setup-domain.sh gimmaclothing.com [email@dominio.com]
#
# Antes de ejecutar, en Cloudflare DNS:
#   A    @     → IP del VPS (Proxied)
#   CNAME www  → gimmaclothing.com (Proxied)
#   A    api   → IP del VPS (Proxied)

set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-admin@${DOMAIN}}"

if [ -z "$DOMAIN" ]; then
  echo "Uso: bash deploy/setup-domain.sh TU_DOMINIO.com [email]"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VPS_IP="$(curl -4 -s ifconfig.me || curl -4 -s icanhazip.com || true)"
echo "==> Dominio: $DOMAIN"
echo "==> IP VPS:  ${VPS_IP:-desconocida}"

echo "==> Nginx (HTTP inicial)..."
sed "s/TU_DOMINIO.com/${DOMAIN}/g" deploy/nginx/gimma-domain.conf > /etc/nginx/sites-available/gimma
ln -sf /etc/nginx/sites-available/gimma /etc/nginx/sites-enabled/gimma
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Certificado SSL (Let's Encrypt)..."
if certbot --nginx \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "api.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "$EMAIL" \
  --redirect; then
  echo "SSL OK"
  USE_HTTPS=true
else
  echo "AVISO: certbot falló. Revisá que el DNS apunte a este VPS y volvé a ejecutar:"
  echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN -d api.$DOMAIN"
  USE_HTTPS=false
fi

if [ "$USE_HTTPS" = true ]; then
  BASE_URL="https://${DOMAIN}"
  API_URL="https://api.${DOMAIN}"
  COOKIE_SECURE=true
else
  BASE_URL="http://${DOMAIN}"
  API_URL="http://api.${DOMAIN}"
  COOKIE_SECURE=false
fi

echo "==> Actualizar backend .env..."
BACKEND_ENV=apps/backend/.env
if [ -f "$BACKEND_ENV" ]; then
  sed -i "s|^STORE_CORS=.*|STORE_CORS=${BASE_URL},https://www.${DOMAIN}|" "$BACKEND_ENV"
  sed -i "s|^ADMIN_CORS=.*|ADMIN_CORS=${API_URL}|" "$BACKEND_ENV"
  sed -i "s|^AUTH_CORS=.*|AUTH_CORS=${API_URL},${BASE_URL},https://www.${DOMAIN}|" "$BACKEND_ENV"
  sed -i "s|^MEDUSA_COOKIE_SECURE=.*|MEDUSA_COOKIE_SECURE=${COOKIE_SECURE}|" "$BACKEND_ENV"
  cp "$BACKEND_ENV" apps/backend/.medusa/server/.env 2>/dev/null || true
fi

echo "==> Actualizar storefront .env.local..."
STOREFRONT_ENV=apps/storefront/.env.local
if [ -f "$STOREFRONT_ENV" ]; then
  sed -i "s|^NEXT_PUBLIC_BASE_URL=.*|NEXT_PUBLIC_BASE_URL=${BASE_URL}|" "$STOREFRONT_ENV"
  sed -i "s|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=${API_URL}|" "$STOREFRONT_ENV"
fi

if [ "$USE_HTTPS" = true ]; then
  echo "==> Rebuild storefront (URLs HTTPS)..."
  BACKEND_URL_BACKUP="$API_URL"
  sed -i 's|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000|' "$STOREFRONT_ENV"
  npm run build --workspace=@dtc/storefront
  sed -i "s|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=${BACKEND_URL_BACKUP}|" "$STOREFRONT_ENV"
fi

echo "==> Reiniciar PM2..."
pm2 reload deploy/ecosystem.config.cjs --update-env || pm2 start deploy/ecosystem.config.cjs
pm2 save

echo ""
echo "=== Dominio configurado ==="
echo "  Tienda:  ${BASE_URL}/ar/inicio"
echo "  Admin:   ${API_URL}/app"
echo "  Demo:    ${BASE_URL}/demo"
if [ "$USE_HTTPS" = false ]; then
  echo ""
  echo "Pendiente: corregir DNS en Cloudflare y ejecutar certbot de nuevo."
fi
