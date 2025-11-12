const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// 🧾 Product Catalog with Variants
const CATALOG = {
  "R3 - 10": {
    code: "AXQRN", // Stealth code for your internal use
    variants: {
      "single": 11000, // $110.00
      "3-pack": 14200, // $142.00
      "5-pack": 23000  // $230.00
    }
  },
  "BPC-157 10mg": {
    code: "AXQRC",
    variants: {
      "single": 15000, // $150.00
      "3-pack": 39500, // $395.00
      "5-pack": 62000  // $620.00
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

    // Loop through cart items
    for (const it of items) {
      const product = CATALOG[it.name];
      if (!product) continue;

      // Pick correct variant price
      let price = 0;
      if (it.variant && product.variants[it.variant]) {
        price = product.variants[it.variant];
      } else {
        price = product.variants["single"]; // Default
      }

      // Add to total (multiply by qty)
      total += price * (it.qty || 1);

      // Save stealth codes to metadata
      metadataItems.push(
        `${product.code} x${it.qty || 1} (${it.variant || "single"})`
      );
    }

    // Add $15 shipping if under $200
    if (total < 20000) {
      total += 1500;
      metadataItems.push("Shipping: $15");
    } else {
      metadataItems.push("Free Shipping");
    }

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Order Total",
              description: "Thank you for your order!",
            },
            unit_amount: total,
          },
          quantity: 1,
        },
      ],
      metadata: {
        items: metadataItems.join(", "),
      },
      success_url: "https://axisbioscience.com/success",
      cancel_url: "https://axisbioscience.com/cancel",
    });

    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};
