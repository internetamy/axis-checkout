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

    for (const it of items) {
      const product = CATALOG[it.name];
      if (!product) continue;

      let price = product.variants[it.variant] || product.variants["single"];
      total += price * (it.qty || 1);

      metadataItems.push(
        `${product.code} x${it.qty || 1} (${it.variant || "single"})`
      );
    }

    // Shipping rule
    if (total < 20000) {
      total += 1500;
      metadataItems.push("Shipping: $15");
    } else {
      metadataItems.push("Free Shipping");
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

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

      // metadata must be strings
      metadata: {
        items: metadataItems.join(", ")
      },

      payment_intent_data: {
        metadata: {
          items: metadataItems.join(", ")
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
