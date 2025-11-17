const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Product Catalog with Variants
const CATALOG = {
  "R3 - 10": {
    code: "AXQRN",
    variants: {
      "single": 11000,
      "3-pack": 14200,
      "5-pack": 23000
    }
  },
  "BPC-157 10mg": {
    code: "AXQRC",
    variants: {
      "single": 15000,
      "3-pack": 39500,
      "5-pack": 62000
    }
  }
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { items } = req.body;
    let total = 0;
    let metadataItems = [];

    // Build product total + metadata
    for (const it of items) {
      const product = CATALOG[it.name];
      if (!product) continue;

      const variant = it.variant || "single";
      const price = product.variants[variant];

      total += price * (it.qty || 1);

      metadataItems.push(
        `${product.code} x${it.qty || 1} (${variant})`
      );
    }

    // SELECT SHIPPING RATE
    let shippingRate = "";
    if (total < 20000) {
      // Under $200 → Standard $15 shipping
      shippingRate = "shr_1SUZseCNw9KMO1UhE1H0WTY3";
      metadataItems.push("Shipping: $15");
    } else {
      // $200+ → FREE shipping
      shippingRate = "shr_1SUZt6CNw9KMO1UhPR8DfJTT";
      metadataItems.push("Free Shipping");
    }

    // CREATE STRIPE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      // collect full shipping address
      shipping_address_collection: {
        allowed_countries: ["US"]
      },

      // auto-selected shipping rate (no customer choice)
      shipping_options: [
        { shipping_rate: shippingRate }
      ],

      // Order Total (products only — shipping is handled by Stripe)
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Total",
              description: "Thank you for your order!"
            },
            unit_amount: total,
          },
          quantity: 1
        }
      ],

      // metadata (for your eyes only)
      metadata: {
        items: metadataItems.join(", "),
        product_total: total
      },

      payment_intent_data: {
        metadata: {
          items: metadataItems.join(", "),
          product_total: total
        }
      },

      success_url: "https://axisbioscience.com/success",
      cancel_url: "https://axisbioscience.com/cancel"
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
