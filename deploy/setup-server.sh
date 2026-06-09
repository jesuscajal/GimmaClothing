#!/usr/bin/env bash
# Configuración inicial del VPS (Ubuntu 22.04 / 24.04).
# Ejecutar como root o con sudo:
#   curl -fsSL ... | bash   — o —
#   sudo bash deploy/setup-server.sh

set -euo pipefail

echo "==> Actualizando sistema..."
apt-get update && apt-get upgrade -y

echo "==> Instalando dependencias base..."
apt-get install -y curl git ufw nginx certbot

echo "==> Instalando Node.js 22 (NodeSource)..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

echo "==> Instalando PM2..."
npm install -g pm2

echo "==> Instalando Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

echo "==> Firewall (UFW)..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> Carpeta para certificados Cloudflare..."
mkdir -p /etc/ssl/cloudflare
chmod 700 /etc/ssl/cloudflare

echo ""
echo "Listo. Siguiente paso:"
echo "  1. Subir certificado de origen Cloudflare a /etc/ssl/cloudflare/"
echo "  2. Clonar el repo en /var/www/gimma-clothing"
echo "  3. Seguir DEPLOY.md"
