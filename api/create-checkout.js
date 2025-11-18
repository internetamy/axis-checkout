const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Product Catalog
const CATALOG = {
  "R3 - 10": {
    code: "AXQRN",
    variants: {
      single: 11000,
      "3-pack": 14200,
      "5-pack": 23000
    }
  },
  "BPC-157 10mg": {
    code: "AXQRC",
    variants: {
      single: 15000,
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
    const { items, notes } = req.body;
    let total = 0;
    let metadataLines = [];

    // Build totals + metadata
    for (const it of items) {
      const product = CATALOG[it.name];
      if (!product) continue;

      const variant = it.variant || "single";
      const price = product.variants[variant];

      total += price * (it.qty || 1);

      metadataLines.push(`${product.code} x${it.qty || 1} (${variant})`);
    }

    // SHIPPING LOGIC
    let shippingRate = "";
    if (total < 20000) {
      shippingRate = "shr_1SUZseCNw9KMO1UhE1H0WTY3"; // $15 shipping
      metadataLines.push("Shipping: $15");
    } else {
      shippingRate = "shr_1SUZt6CNw9KMO1UhPR8DfJTT"; // free shipping
      metadataLines.push("Free Shipping");
    }

    // If customer added order notes
    if (notes && notes.trim() !== "") {
      metadataLines.push(`Notes: ${notes.trim()}`);
    }

    // CREATE STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["US"]
      },

      phone_number_collection: {
        enabled: true
      },

      shipping_options: [
        { shipping_rate: shippingRate }
      ],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Total",
              description: "Thank you for your order!"
            },
            unit_amount: total
          },
          quantity: 1
        }
      ],

      metadata: {
        order_details: metadataLines.join(" | ")
      },

      payment_intent_data: {
        metadata: {
          order_details: metadataLines.join(" | ")
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
