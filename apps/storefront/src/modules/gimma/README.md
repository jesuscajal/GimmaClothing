# Componentes compartidos Gimma

Mover acá los componentes **estables** desde `modules/demo/components/` cuando estén listos para producción.

Regla: un componente en esta carpeta **no importa** `@lib/demo/data` — recibe props (`GimmaProduct`, etc.).

## Migración sugerida (orden)

1. `gimma-logo.tsx`
2. `product-card.tsx`
3. `demo-nav.tsx` → `gimma-nav.tsx`
4. `demo-footer.tsx` → `gimma-footer.tsx`
5. `cart-view.tsx` (con adapter de carrito demo vs Medusa)

Ver **WORKFLOW.md** en la raíz del repo.
