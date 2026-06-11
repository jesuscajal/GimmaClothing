import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  createCartWorkflow,
  addShippingMethodToCartWorkflow,
  createPaymentCollectionForCartWorkflow,
  createPaymentSessionsWorkflow,
  completeCartWorkflow,
} from "@medusajs/medusa/core-flows";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { items } = req.body as {
      items: { variant_id: string; quantity: number }[];
    };

    if (!items || !items.length) {
      return res.status(400).json({ message: "No items provided in the request body" });
    }

    const query = req.scope.resolve("query");

    // 1. Obtener la región correspondiente a Argentina (ar)
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id", "name", "currency_code", "countries.iso_2"],
    });

    const region = regions.find((r: any) =>
      r.countries?.some((c: any) => c.iso_2 === "ar")
    );

    if (!region) {
      return res.status(404).json({ message: "Region for Argentina (ar) not found" });
    }

    // 2. Obtener la opción de envío "Standard Shipping"
    const { data: shippingOptions } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "name", "provider_id"],
    });

    const shippingOption = shippingOptions.find(
      (option: any) =>
        option.provider_id === "manual_manual" &&
        option.name === "Standard Shipping"
    );

    if (!shippingOption) {
      return res.status(404).json({ message: "Shipping option 'Standard Shipping' not found" });
    }

    // 3. Crear el carrito
    const { result: cart } = await createCartWorkflow(req.scope).run({
      input: {
        region_id: region.id,
        currency_code: region.currency_code,
        email: "whatsapp-order@gimmaclothing.com",
        items: items.map(item => ({
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
        shipping_address: {
          first_name: "Cliente",
          last_name: "WhatsApp",
          address_1: "A coordinar por WhatsApp",
          city: "Buenos Aires",
          country_code: "ar",
          phone: "0000000000",
        },
        billing_address: {
          first_name: "Cliente",
          last_name: "WhatsApp",
          address_1: "A coordinar por WhatsApp",
          city: "Buenos Aires",
          country_code: "ar",
          phone: "0000000000",
        }
      }
    });

    // 4. Agregar método de envío estándar al carrito
    await addShippingMethodToCartWorkflow(req.scope).run({
      input: {
        cart_id: cart.id,
        options: [
          {
            id: shippingOption.id,
          }
        ]
      }
    });

    // 5. Crear colección de pago
    const { result: paymentCollection } = await createPaymentCollectionForCartWorkflow(req.scope).run({
      input: {
        cart_id: cart.id,
      }
    });

    // 6. Crear sesión de pago con el proveedor predeterminado (pp_system_default)
    await createPaymentSessionsWorkflow(req.scope).run({
      input: {
        payment_collection_id: paymentCollection.id,
        provider_id: "pp_system_default",
      }
    });

    // 7. Completar carrito
    const { result: completeResult } = await completeCartWorkflow(req.scope).run({
      input: {
        id: cart.id,
      }
    });

    // 8. Consultar los detalles finales de la orden
    const { data: orders } = await query.graph({
      entity: "order",
      fields: ["id", "display_id", "total"],
      filters: {
        id: completeResult.id,
      }
    });

    const order = orders[0];

    return res.status(200).json({
      order: {
        id: order.id,
        display_id: order.display_id,
        total: order.total,
      }
    });

  } catch (error: any) {
    console.error("Error processing WhatsApp order:", error);
    return res.status(500).json({
      message: "An error occurred while registering the WhatsApp order",
      error: error.message,
    });
  }
}
