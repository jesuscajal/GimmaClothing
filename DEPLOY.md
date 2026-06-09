# Despliegue en VPS + Cloudflare (Gimma Clothing)

Guía para publicar la tienda en tu VPS con **SSL vía Cloudflare** (modo **Full strict**).

## Arquitectura

```
Visitante
   ↓
Cloudflare (SSL + CDN + protección)
   ↓
VPS (nginx :443)
   ├── TU_DOMINIO.com      → Next.js storefront (:8000)
   └── api.TU_DOMINIO.com  → Medusa backend + admin /app (:9000)

Docker (solo localhost):
   PostgreSQL :5432
   Redis      :6379
```

| URL | Qué es |
|-----|--------|
| `https://TU_DOMINIO.com` | Tienda (demo en `/demo` hasta conectar Medusa real) |
| `https://TU_DOMINIO.com/demo/admin` | Panel admin demo |
| `https://api.TU_DOMINIO.com/app` | Panel admin Medusa (producción) |

---

## Qué necesito de vos antes de desplegar

Enviame estos datos (por chat o anotate al configurar):

| Dato | Ejemplo |
|------|---------|
| **Dominio** | `gimmaclothing.com` |
| **IP del VPS** | `203.0.113.50` |
| **SO del VPS** | Ubuntu 22.04 / 24.04 |
| **WhatsApp real** | `54911XXXXXXXX` (sin + ni espacios) |
| **Acceso SSH** | usuario + IP (vos ejecutás los comandos, o me das acceso si preferís) |
| **Repositorio** | GitHub/GitLab URL (para clonar en el servidor) |

---

## Parte 1 — Cloudflare (DNS + SSL)

### 1.1 Agregar el dominio

1. Entrá a [Cloudflare](https://dash.cloudflare.com) → **Add a site**
2. Elegí plan **Free**
3. Cloudflare te da **2 nameservers** → cambiálos en tu registrador del dominio
4. Esperá propagación (minutos a 24 h)

### 1.2 Registros DNS

En **DNS → Records**, creá (nube **naranja / Proxied** activada):

| Tipo | Nombre | Contenido | Proxy |
|------|--------|-----------|-------|
| A | `@` | IP del VPS | Proxied |
| A | `www` | IP del VPS | Proxied |
| A | `api` | IP del VPS | Proxied |

### 1.3 Certificado de origen (para nginx)

1. **SSL/TLS → Origin Server → Create Certificate**
2. Hostnames: `TU_DOMINIO.com`, `*.TU_DOMINIO.com`
3. Validez: 15 years
4. Copiá **Origin Certificate** y **Private Key**
5. En el VPS:

```bash
sudo mkdir -p /etc/ssl/cloudflare
sudo nano /etc/ssl/cloudflare/TU_DOMINIO.com.pem    # pegar certificado
sudo nano /etc/ssl/cloudflare/TU_DOMINIO.com.key    # pegar clave privada
sudo chmod 600 /etc/ssl/cloudflare/*
```

### 1.4 Ajustes SSL en Cloudflare

En **SSL/TLS → Overview**:

- Modo: **Full (strict)**

En **SSL/TLS → Edge Certificates**:

- **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: ON

---

## Parte 2 — Preparar el VPS

Conectate por SSH:

```bash
ssh root@TU_IP_VPS
```

### 2.1 Script de instalación base

```bash
git clone https://github.com/TU_USUARIO/gimma-clothing.git /var/www/gimma-clothing
cd /var/www/gimma-clothing
sudo bash deploy/setup-server.sh
```

Instala: Node 22, PM2, Docker, nginx, UFW.

### 2.2 Variables de entorno

```bash
cd /var/www/gimma-clothing

# Docker (PostgreSQL)
cp deploy/env/docker.env.example deploy/env/docker.env
nano deploy/env/docker.env          # password fuerte para POSTGRES_PASSWORD

# Backend Medusa
cp deploy/env/backend.env.example apps/backend/.env
nano apps/backend/.env              # dominio, CORS, JWT_SECRET, COOKIE_SECRET, DATABASE_URL

# Storefront Next.js
cp deploy/env/storefront.env.example apps/storefront/.env.local
nano apps/storefront/.env.local     # dominio, api, WhatsApp, publishable key
```

Generar secretos:

```bash
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 32   # COOKIE_SECRET
```

**Importante:** `DATABASE_URL` debe usar la misma contraseña que `POSTGRES_PASSWORD` en `docker.env`.

### 2.3 Levantar base de datos

```bash
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/env/docker.env up -d
docker compose -f deploy/docker-compose.prod.yml ps
```

### 2.4 Migrar Medusa y crear admin

```bash
cd /var/www/gimma-clothing
npm ci
npm run db:setup

cd apps/backend
npx medusa user -e admin@gimmaclothing.com -p TU_PASSWORD_ADMIN
cd ../..
```

### 2.5 Publishable API Key

1. Abrí `https://api.TU_DOMINIO.com/app` (después de nginx + PM2)
2. **Settings → Publishable API Keys** → copiá la clave
3. Pegala en `apps/storefront/.env.local` → `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

---

## Parte 3 — Nginx

```bash
cd /var/www/gimma-clothing

# Reemplazar TU_DOMINIO.com en el archivo
sed -i 's/TU_DOMINIO.com/tudominio.com/g' deploy/nginx/gimma.conf

sudo cp deploy/nginx/gimma.conf /etc/nginx/sites-available/gimma
sudo ln -sf /etc/nginx/sites-available/gimma /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Parte 4 — Build y arrancar apps

```bash
cd /var/www/gimma-clothing
bash deploy/deploy-app.sh
```

O manualmente:

```bash
npm ci
npm run build --workspace=@dtc/backend
npm run build --workspace=@dtc/storefront
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup    # seguir instrucciones para auto-inicio al reiniciar VPS
```

---

## Parte 5 — Verificación

| Check | URL |
|-------|-----|
| Tienda demo | `https://TU_DOMINIO.com/demo` |
| Admin demo | `https://TU_DOMINIO.com/demo/admin` |
| API Medusa | `https://api.TU_DOMINIO.com/health` |
| Admin Medusa | `https://api.TU_DOMINIO.com/app` |

Logs:

```bash
pm2 logs
pm2 status
docker compose -f deploy/docker-compose.prod.yml logs -f
```

---

## Actualizar después de cambios en el código

```bash
cd /var/www/gimma-clothing
bash deploy/deploy-app.sh
```

---

## Fase demo vs producción completa

**Ahora (rápido):** La tienda en `/demo` funciona sin depender del backend Medusa. El middleware redirige `/` → `/demo`.

**Cuando quieras la tienda real Medusa:**

1. Configurá regiones/país **Argentina (`ar`)** en el admin Medusa
2. Cambiá el middleware para que `/` vaya a la tienda real (no `/demo`)
3. Verificá `NEXT_PUBLIC_DEFAULT_REGION=ar` en el storefront

---

## Solución de problemas

**502 Bad Gateway**  
→ `pm2 status` — backend/storefront deben estar `online`. Revisá `pm2 logs`.

**Error CORS en la tienda**  
→ `STORE_CORS` y `AUTH_CORS` en `apps/backend/.env` deben incluir `https://TU_DOMINIO.com`.

**Admin Medusa no carga**  
→ `ADMIN_CORS` debe ser `https://api.TU_DOMINIO.com`.

**SSL handshake error**  
→ Cloudflare en **Full (strict)** + certificado de origen instalado en `/etc/ssl/cloudflare/`.

**Base de datos no conecta**  
→ `docker compose ... ps` — postgres debe estar `healthy`. Revisá `DATABASE_URL`.

**Cloudflare 521 (web server down)**  
→ nginx corriendo: `sudo systemctl status nginx`. Puertos 80/443 abiertos en UFW.

---

## Comandos útiles

```bash
# Reiniciar todo
pm2 restart all

# Solo backend
pm2 restart gimma-backend

# Backup PostgreSQL
docker exec gimma_postgres_prod pg_dump -U gimma medusa-store > backup.sql

# Detener DB
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/env/docker.env down
```

---

## Alternativa: Cloudflare Tunnel (sin abrir puertos)

Si preferís no exponer 80/443 directamente, se puede usar **cloudflared** en el VPS. Avisame y armamos esa variante.
