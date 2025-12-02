const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// ===== Product Catalog =====
const CATALOG = {
  "AOD-9604 5mg": {
    code: "AXQRV",
    variants: {
      single: 4900,
      "3-pack": 14100,
      "5-pack": 23500,
    },
  },
  "ARA-290 16mg": {
    code: "AXQSB",
    variants: {
      single: 7500,
      "3-pack": 21000,
      "5-pack": 32500,
    },
  },
  "BPC-157 10mg": {
    code: "AXQRA",
    variants: {
      single: 5200,
      "3-pack": 15000,
      "5-pack": 24000,
    },
  },
  "Cagri 10mg": {
    code: "AXQRR",
    variants: {
      single: 9300,
      "3-pack": 26500,
      "5-pack": 43100,
    },
  },
  "CJC No DAC / Ipamorelin Duo Blend": {
    code: "AXCJI",
    variants: {
      single: 4500,
      "3-pack": 12300,
      "5-pack": 20000,
    },
  },
  "DSIP 5mg": {
    code: "AXQRT",
    variants: {
      single: 2900,
      "3-pack": 8400,
      "5-pack": 13500,
    },
  },
  "GHK-Cu 100mg": {
    code: "AXQSE",
    variants: {
      single: 5500,
      "3-pack": 15900,
      "5-pack": 26500,
    },
  },
  "GHK-Cu 50mg": {
    code: "AXQSF",
    variants: {
      single: 3900,
      "3-pack": 11100,
      "5-pack": 18500,
    },
  },
  GLOW: {
    code: "AXQRE",
    variants: {
      single: 8900,
      "3-pack": 25500,
      "5-pack": 40000,
    },
  },
  "HGH 10iu": {
    code: "AXQRU",
    variants: {
      single: 2900,
      "3-pack": 8400,
      "5-pack": 13500,
    },
  },
  "IGF-1 LR3": {
    code: "AXQRY",
    variants: {
      single: 5500,
      "3-pack": 15900,
      "5-pack": 26500,
    },
  },
  "Ipamorelin 10mg": {
    code: "AXQSD",
    variants: {
      single: 4500,
      "3-pack": 12900,
      "5-pack": 21500,
    },
  },
  KLOW80: {
    code: "AXQRZ",
    variants: {
      single: 8900,
      "3-pack": 25500,
      "5-pack": 42500,
    },
  },
  "KPV 10mg": {
    code: "AXQRD",
    variants: {
      single: 3600,
      "3-pack": 9900,
      "5-pack": 15500,
    },
  },
  "MOTS-c": {
    code: "AXQRF",
    variants: {
      single: 3800,
      "3-pack": 10800,
      "5-pack": 17500,
    },
  },
  "MOTS-C 20mg": {
    code: "AXM20",
    variants: {
      single: 8500,
      "3-pack": 24000,
      "5-pack": 39500,
    },
  },
  "NAD+ 500mg": {
    code: "AXQRC",
    variants: {
      single: 5200,
      "3-pack": 14400,
      "5-pack": 22500,
    },
  },
  "PT-141 10mg": {
    code: "AXQSJ",
    variants: {
      single: 4500,
      "3-pack": 13200,
      "5-pack": 21000,
    },
  },
  "R3 - 10": {
    code: "AXQRN",
    variants: {
      single: 11000,
      "3-pack": 30000,
      "5-pack": 47500,
    },
  },
  "R3 - 30": {
    code: "AXQRP",
    variants: {
      single: 17000,
      "3-pack": 49200,
      "5-pack": 77500,
    },
  },
  Selank: {
    code: "AXQRW",
    variants: {
      single: 3900,
      "3-pack": 11300,
      "5-pack": 18500,
    },
  },
  "S1 - 20": {
    code: "AXQRI",
    variants: {
      single: 11500,
      "3-pack": 33000,
      "5-pack": 52500,
    },
  },
  Semax: {
    code: "AXQSC",
    variants: {
      single: 2900,
      "3-pack": 8400,
      "5-pack": 14000,
    },
  },
  SNAP8: {
    code: "AXQRG",
    variants: {
      single: 2400,
      "3-pack": 6900,
      "5-pack": 11000,
    },
  },
  "SS-31": {
    code: "AXQSH",
    variants: {
      single: 7500,
      "3-pack": 21900,
      "5-pack": 36500,
    },
  },
  "Survo 10mg": {
    code: "AXQRS",
    variants: {
      single: 13800,
      "3-pack": 39000,
      "5-pack": 62500,
    },
  },
  "TB-500 (Thymosin Beta-4 Fragment)": {
    code: "AXQSG",
    variants: {
      single: 6000,
      "3-pack": 17400,
      "5-pack": 28000,
    },
  },
  Tesamorelin: {
    code: "AXTQA",
    variants: {
      single: 6500,
      "3-pack": 18600,
      "5-pack": 30500,
    },
  },
  "Thymosin Alpha-1": {
    code: "AXQSI",
    variants: {
      single: 4500,
      "3-pack": 12900,
      "5-pack": 21500,
    },
  },
  Thymulin: {
    code: "AXQSA",
    variants: {
      single: 3900,
      "3-pack": 11100,
      "5-pack": 18500,
    },
  },
  "T2 - 30": {
    code: "AXQRK",
    variants: {
      single: 14500,
      "3-pack": 42000,
      "5-pack": 67500,
    },
  },
  "T2 - 40": {
    code: "AXQRL",
    variants: {
      single: 6400,
      "3-pack": 18200,
      "5-pack": 29500,
    },
  },
  "T2 - 60": {
    code: "AXQRM",
    variants: {
      single: 9300,
      "3-pack": 26600,
      "5-pack": 43400,
    },
  },
};

// ===== Main handler =====
module.exports = async (req, res) => {
  // CORS – only allow your domains
  const allowedOrigins = [
    "https://axisbioscience.com",
    "https://www.axisbioscience.com",
  ];
  const origin = req.headers.origin || "";

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only POST is allowed
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { items } = req.body || {};
    let total = 0;
    const metadataItems = [];

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: "No items sent" });
    }

    // Build total from catalog
    for (const it of items) {
      const product = CATALOG[it.name];
      if (!product) continue;

      const variant = it.variant || "single";
      const price = product.variants[variant];
      if (!price) continue;

      const qty = it.qty || 1;
      total += price * qty;
      metadataItems.push(`${product.code} x${qty} (${variant})`);
    }

    if (total <= 0) {
      return res.status(400).json({ error: "Total is zero" });
    }

    // Shipping rate based on total (using your IDs)
    let shippingRate;
    if (total < 20000) {
      shippingRate = "shr_1SUZseCNw9KMO1UhE1H0WTY3"; // $15
      metadataItems.push("Shipping: $15");
    } else {
      shippingRate = "shr_1SUZt6CNw9KMO1UhPR8DfJTT"; // Free
      metadataItems.push("Free Shipping");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      shipping_options: [{ shipping_rate: shippingRate }],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Axis BioScience Order",
              description: "Thank you for your order!",
            },
            unit_amount: total,
          },
          quantity: 1,
        },
      ],

      metadata: {
        items: metadataItems.join(", "),
        product_total: total,
      },

      payment_intent_data: {
        metadata: {
          items: metadataItems.join(", "),
          product_total: total,
        },
      },

      success_url: "https://axisbioscience.com/success",
      cancel_url: "https://axisbioscience.com/cancel",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: err.message });
  }
};