import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
  updateProductVariantsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

/**
 * Configura región Argentina (ARS) en una tienda Medusa existente.
 * Idempotente: se puede ejecutar varias veces sin duplicar datos.
 *
 * Uso: npx medusa exec ./src/migration-scripts/setup-argentina-region.ts
 */
export default async function setupArgentinaRegion({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  });

  const argentinaRegion = regions.find((region) =>
    region.countries?.some(
      (country: { iso_2?: string }) => country.iso_2 === "ar"
    )
  );

  if (argentinaRegion) {
    logger.info(
      `Región Argentina ya existe (${argentinaRegion.id}). Omitiendo creación.`
    );
  } else {
    logger.info("Creando región Argentina (ARS)...");
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Argentina",
            currency_code: "ars",
            countries: ["ar"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });

    logger.info(`Región creada: ${result[0].id}`);

    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "ar", provider_id: "tp_system" }],
    });
    logger.info("Región impositiva AR configurada.");
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "supported_currencies.currency_code", "supported_currencies.is_default"],
  });

  const store = stores[0];
  if (!store) {
    throw new Error("No se encontró ninguna tienda (store).");
  }

  const currencies = store.supported_currencies ?? [];
  const hasArs = currencies.some(
    (c: { currency_code?: string }) => c.currency_code === "ars"
  );

  const supported_currencies = hasArs
    ? currencies.map((c: { currency_code?: string }) => ({
        currency_code: c.currency_code!,
        is_default: c.currency_code === "ars",
      }))
    : [
        ...currencies.map((c: { currency_code?: string }) => ({
          currency_code: c.currency_code!,
          is_default: false,
        })),
        { currency_code: "ars", is_default: true },
      ];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Gimma Clothing",
        supported_currencies,
      },
    },
  });
  logger.info("Tienda actualizada: Gimma Clothing, moneda por defecto ARS.");

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: [
      "id",
      "product_id",
      "prices.amount",
      "prices.currency_code",
    ],
  });

  const variantPrices = variants
    .filter(
      (variant) =>
        !variant.prices?.some(
          (price: { currency_code?: string }) => price.currency_code === "ars"
        )
    )
    .map((variant) => ({
      variant_id: variant.id,
      product_id: variant.product_id,
      prices: [{ amount: 25000, currency_code: "ars" }],
    }));

  if (variantPrices.length) {
    await updateProductVariantsWorkflow(container).run({
      input: {
        product_variants: variantPrices.map((entry) => ({
          id: entry.variant_id,
          prices: entry.prices,
        })),
      },
    });
    logger.info(
      `Precios ARS placeholder ($25.000) agregados a ${variantPrices.length} variantes.`
    );
  } else {
    logger.info("Todas las variantes ya tienen precio ARS.");
  }

  logger.info("Argentina configurada. Storefront: /ar/ — Admin: Settings → Regions.");
}
