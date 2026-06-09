# Flujo de trabajo — Demo (diseño) vs Producción (datos reales)

Este documento describe **cómo trabajar en Gimma Clothing**: diseñar en `/demo`, operar con datos reales en Medusa, y pasar diseños a producción.

---

## Dos mundos, un solo proyecto

```
┌─────────────────────────────────────────────────────────────────┐
│  LABORATORIO DE DISEÑO (/demo)                                  │
│  • Datos mock en src/lib/demo/data.ts                           │
│  • Carrito en localStorage                                      │
│  • Admin demo simulado (/demo/admin)                            │
│  • No requiere backend para iterar UI                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  Cuando el diseño está listo:
                              │  mover componentes → modules/gimma/
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PRODUCCIÓN (/ar/... + Medusa)                                  │
│  • Productos, stock, pedidos → PostgreSQL (Medusa)              │
│  • Admin real → https://api.tudominio.com/app                   │
│  • Storefront lee API Medusa (@lib/data/*)                      │
└─────────────────────────────────────────────────────────────────┘
```

| Qué | Demo (`/demo`) | Producción |
|-----|----------------|------------|
| **Para qué** | Probar diseños, flujos, textos | Clientes reales + Gimee operando |
| **Datos** | `data.ts`, `admin-data.ts` | Medusa API + PostgreSQL |
| **Carrito** | localStorage | Medusa cart (futuro) o WhatsApp |
| **Admin** | `/demo/admin` (simulado) | `:8080/app` (Medusa) |
| **Backend local** | Opcional | Obligatorio |

---

## Dónde está cada cosa en el código

| Carpeta | Rol |
|---------|-----|
| `src/app/demo/` | Rutas del laboratorio de diseño |
| `src/modules/demo/` | Componentes y admin demo (mock) |
| `src/lib/demo/` | Datos falsos, WhatsApp demo, tema |
| `src/lib/gimma/` | **Tipos y config compartidos** (demo + prod) |
| `src/modules/gimma/` | **Componentes compartidos** (migrar acá desde demo) |
| `src/app/[countryCode]/` | Tienda Medusa real (producción) |
| `src/lib/data/` | Fetch a API Medusa (productos, regiones, carrito) |
| `apps/backend/` | Medusa, migraciones, seed, lógica de negocio |

---

## Tu flujo diario (recomendado)

### 1. Diseñar en demo (tu PC, sin Docker)

```powershell
cd apps\storefront
npm run dev
```

- Abrí **http://localhost:8000/demo**
- Modificá componentes en `modules/demo/components/`
- Colores/tema: `src/lib/demo/theme.ts` y `src/lib/gimma/config.ts`
- Admin demo: `modules/demo/admin/` (solo UX, no persiste en DB)

**Ventaja:** cambios instantáneos, sin tocar la base de datos.

### 2. Datos reales en el VPS (Gimee / operación)

| Tarea | Dónde |
|-------|-------|
| Alta de productos, fotos, precios | http://2.25.173.32:8080/app |
| Stock e inventario | Medusa admin → Inventory |
| Pedidos reales | Medusa admin → Orders |
| Usuarios admin | Medusa admin → Settings |

Credenciales VPS: ver `DEPLOY.md` o el chat de despliegue.

### 3. Pasar diseño demo → producción

Cuando una pantalla del demo te gusta:

1. **Extraer** componentes visuales a `modules/gimma/components/`  
   (ej. `ProductCard`, `DemoNav` → `GimmaNav`, `GimmaLogo`)
2. **Crear página producción** en `app/[countryCode]/(main)/` que use esos componentes
3. **Conectar datos** con funciones de `@lib/data/products`, `@lib/data/regions`, etc.
4. **Mapear** respuesta Medusa → tipo `GimmaProduct` (`lib/gimma/types.ts`)

Ejemplo mental:

```tsx
// Demo (mock)
const products = DEMO_PRODUCTS

// Producción (real)
const { products } = await listProducts({ regionId })
const gimmaProducts = products.map(mapMedusaToGimma)
```

5. **Probar en VPS** con `NEXT_PUBLIC_GIMMA_ROOT=production` (cuando `/ar` tenga diseño Gimma)

### 4. Subir cambios al VPS

```bash
# En tu PC: empaquetar y subir (o git pull en el servidor)
bash deploy/deploy-app.sh   # en el VPS
```

---

## Variables de entorno

| Variable | Local (diseño) | VPS producción |
|----------|----------------|----------------|
| `NEXT_PUBLIC_GIMMA_ROOT` | `demo` | `demo` mientras diseñás; `production` cuando `/ar` use diseño Gimma |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `http://localhost:9000` | `http://IP:8080` o `https://api.dominio.com` |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | clave del admin | clave del admin VPS |
| `NEXT_PUBLIC_DEFAULT_REGION` | `ar` | `ar` |
| `NEXT_PUBLIC_DEMO_WHATSAPP` | número prueba | WhatsApp real de Gimma |

El **demo sigue accesible en `/demo`** aunque `GIMMA_ROOT=production` — es tu taller de diseño en el mismo servidor.

---

## Backend y tablas: cuándo tocar qué

| Necesidad | Solución |
|-----------|----------|
| Productos, precios, stock | **Medusa admin** (no SQL a mano) |
| Región Argentina, ARS | Admin → Regions / Store settings |
| Datos iniciales repetibles | `apps/backend/src/migration-scripts/initial-data-seed.ts` |
| Campo nuevo en producto | Módulo Medusa o metadata en admin |
| Cambio de esquema DB | Migraciones Medusa (`npm run db:migrate`) |

Evitá editar PostgreSQL directo salvo backups o emergencias.

---

## WhatsApp + pedidos reales

Hoy:

- **Demo:** carrito → mensaje WhatsApp (localStorage)
- **Medusa:** checkout estándar o pedidos creados en admin

Roadmap natural:

1. Producción con diseño Gimma + catálogo Medusa real
2. Carrito producción → mismo botón WhatsApp (sin pasar por pago online)
3. Gimee confirma en **Medusa admin** (no en demo admin)
4. Opcional: webhook o formulario que cree `Order` en Medusa al recibir WhatsApp

---

## Estado actual (marzo 2026)

| Listo | Pendiente |
|-------|-----------|
| Demo tienda + admin simulado | Diseño Gimma en rutas `/ar/...` |
| Backend Medusa en VPS | Migrar componentes demo → `modules/gimma/` |
| Admin Medusa real (`:8080/app`) | Dominio + Cloudflare SSL |
| Build + PM2 + nginx en VPS | |
| **Región Argentina (ARS) en Medusa** | Envíos AR en admin (opcional) |

---

## Resumen en una frase

**Diseñás en `/demo` con datos falsos; Gimee opera con datos reales en Medusa admin; cuando el diseño cierra, reutilizás los mismos componentes en `/ar` leyendo la API.**

¿Próximo paso concreto? Decinos si querés que armemos la **región Argentina en el backend** o la **primera pantalla de producción** (home Gimma con productos reales de Medusa).
