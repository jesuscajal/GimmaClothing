# Gimma Clothing

Tienda de ropa online con [Medusa](https://medusajs.com) (backend + panel admin) y storefront [Next.js](https://nextjs.org).

## Estructura del proyecto

```
gimma-clothing/
├── apps/
│   ├── backend/      # API Medusa + admin (puerto 9000)
│   └── storefront/   # Tienda Next.js (puerto 8000)
├── docker-compose.yml
└── package.json
```

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| [Node.js](https://nodejs.org/) | 20+ (recomendado 22.13+) |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Para PostgreSQL y Redis |
| npm | 10+ (incluido con Node) |

## 1. Instalar dependencias

Desde la raíz del proyecto:

```powershell
cd c:\CARRERA_LIC\gimmacloting\gimma-clothing
npm install
```

La primera instalación puede tardar varios minutos.

## 2. Base de datos (Docker)

Instala **Docker Desktop** y asegúrate de que esté en ejecución. Luego:

```powershell
npm run docker:up
```

Esto levanta:

- **PostgreSQL** en `localhost:5432` (usuario/contraseña: `postgres` / `postgres`, base: `medusa-store`)
- **Redis** en `localhost:6379`

Las credenciales coinciden con `apps/backend/.env`.

## 3. Migrar y cargar datos de ejemplo

```powershell
npm run db:setup
```

Esto aplica migraciones y ejecuta el script de datos demo (productos, regiones, etc.).

### Crear usuario administrador

```powershell
cd apps\backend
npx medusa user -e admin@gimmaclothing.com -p TuPasswordSeguro123
cd ..\..
```

## 4. Arrancar en desarrollo

**Opción A — Backend y tienda a la vez:**

```powershell
npm run dev
```

**Opción B — Por separado (dos terminales):**

```powershell
npm run backend:dev
```

```powershell
npm run storefront:dev
```

## Demo visual (sin backend)

Pantallas de **Gimma Clothing** con datos de ejemplo:

```powershell
cd apps\storefront
npm run dev
```

Abre **http://localhost:8000/demo** — tienda (cliente) y **http://localhost:8000/demo/admin** — panel admin.

**Flujo diseño vs producción:** ver **[WORKFLOW.md](./WORKFLOW.md)**.

## URLs demo

| Pantalla | URL |
|----------|-----|
| Índice demo | http://localhost:8000/demo |
| Tienda | http://localhost:8000/demo/inicio |
| Panel admin | http://localhost:8000/demo/admin |
| API backend | http://localhost:9000 |
| Tienda (storefront) | http://localhost:8000 |

## Conectar storefront a la base de datos

Tras `npm run db:setup`, el script **sincroniza automáticamente** la publishable key de PostgreSQL hacia `apps/storefront/.env.local` (región `ar`, modo `production`).

Si ya tenés la DB corriendo y solo necesitás actualizar el env:

```powershell
npm run env:sync
```

Variables que quedan en `apps/storefront/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...   # desde la DB
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_DEFAULT_REGION=ar
NEXT_PUBLIC_GIMMA_ROOT=production
```

Reiniciá el storefront después de sincronizar. La tienda real queda en **http://localhost:8000/ar/inicio**; el laboratorio de diseño sigue en **/demo**.

## Comandos útiles

```powershell
# Detener PostgreSQL y Redis
npm run docker:down

# Solo migraciones (sin datos demo)
npm run db:migrate

# Solo datos demo (tras migrar)
npm run backend:seed

# Sincronizar publishable key → storefront/.env.local
npm run env:sync

# Ver logs de Docker
docker compose logs -f
```

## Sin Docker (PostgreSQL local)

1. Instala PostgreSQL 15+ en Windows.  
2. Crea la base `medusa-store`.  
3. Actualiza `DATABASE_URL` en `apps/backend/.env`.  
4. Instala Redis o ajusta la configuración de caché según la [documentación de Medusa](https://docs.medusajs.com).

## Personalizar la marca

- **Productos y pedidos:** panel admin en `/app`  
- **Diseño de la tienda:** `apps/storefront/src`  
- **Lógica de negocio:** `apps/backend/src`

## Documentación

- [Medusa — Instalación](https://docs.medusajs.com/learn/installation)  
- [Medusa — Storefront](https://docs.medusajs.com/learn/storefront-development)  
- [Medusa con Docker](https://docs.medusajs.com/learn/installation/docker)  
- **[Despliegue en VPS + Cloudflare](./DEPLOY.md)** — producción con SSL

## Solución de problemas

**`docker` no se reconoce**  
Instala Docker Desktop y reinicia la terminal.

**Error de conexión a la base de datos**  
Comprueba que los contenedores estén activos: `docker compose ps`

**Node `EBADENGINE`**  
Actualiza Node a 22.13+ o 20.19+: `node --version`

**La tienda no muestra productos**  
Verifica `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` y que el backend esté en http://localhost:9000
