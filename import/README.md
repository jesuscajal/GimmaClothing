# Importar catálogo (Excel + fotos WhatsApp)

Uní el Excel de precios con las fotos del grupo y cargá todo de una vez en Medusa.

## 1. Preparar el Excel

Guardá tu archivo como **`import/precios.xlsx`** o exportalo a **`import/precios.csv`**.

Columnas soportadas:

| Columna | Obligatorio | Ejemplo |
|---------|-------------|---------|
| `nombre` | Sí | Remera Oversize Negra |
| `precio` | Sí | 45000 o $45.000 |
| `categoria` | No | Remeras |
| `descripcion` | No | Algodón 240g |
| `foto` | No | remera-negra.jpg |
| `talles` | No | S,M,L,XL (si no hay, usa "Único") |
| `colores` | No | Negro,Blanco |

Ver plantilla: `precios.ejemplo.csv`

## 2. Preparar las fotos de WhatsApp

1. Descargá las fotos del grupo de WhatsApp al celular/PC.
2. **Renombrá cada foto** con el mismo nombre del producto en el Excel (o usá la columna `foto`).
3. Copiá todas a **`import/fotos/`**

Ejemplo:

```
import/fotos/
  remera-oversize-negra.jpg
  buzo-hoodie-gris.jpg
  pantalon-cargo.jpg
```

> Tip: si la foto se llama igual que el `nombre` del Excel (sin importar mayúsculas/acentos), el script la encuentra solo.

## 3. Vista previa (sin cargar nada)

```bash
cd gimma-clothing
IMPORT_DRY_RUN=true npm run import:catalog
```

Muestra qué filas del Excel matchean con qué fotos y cuáles faltan.

## 4. Importar al backend local

Con Docker + backend corriendo:

```bash
npm run import:catalog
```

## 5. Importar en el VPS (producción)

```bash
# Subir archivos al servidor (desde tu PC)
scp -i ~/.ssh/id_ed25519_landingqr import/precios.xlsx root@2.25.173.32:/var/www/gimma-clothing/import/
scp -i ~/.ssh/id_ed25519_landingqr import/fotos/* root@2.25.173.32:/var/www/gimma-clothing/import/fotos/

# En el VPS
cd /var/www/gimma-clothing
IMPORT_DRY_RUN=true npm run import:catalog -w @dtc/backend   # revisar
npm run import:catalog -w @dtc/backend                        # cargar
bash deploy/deploy-app.sh                                       # rebuild tienda
```

## Qué hace el script

1. Lee Excel/CSV de precios
2. Busca la foto por nombre (columna `foto` o nombre del producto)
3. Copia imágenes a `apps/storefront/public/catalog/`
4. Crea productos en Medusa con precio ARS
5. Asigna stock inicial (50 unidades por variante)

## Solución de problemas

**"SIN FOTO"** → Renombrá la imagen o agregá columna `foto` con el nombre exacto del archivo.

**Producto ya existe** → Se omite (mismo handle). Cambiá el nombre o borrá el producto viejo en el admin.

**Precio raro** → Usá números sin símbolos: `45000` en vez de `$45.000`.
