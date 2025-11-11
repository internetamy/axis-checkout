const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const NAME_TO_PRICEID = {
  "GLOW": "price_1SrjPqCtq6MyYdzb3guUnv",
  "R3 - 10": "price_1SrjR8Ctq6MyYdzbqWlsogqP",
  "BPC-157 10mg": "price_1Srj91Ctq6MyYdzbU92PDc"
};

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { items } = req.body;
    const line_items = [];

    for (const it of items) {
      const priceId = NAME_TO_PRICEID[it.name];
      if (!priceId) continue;
      line_items.push({ price: priceId, quantity: it.qty || 1 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: "https://axisbioscience.com/success",
      cancel_url: "https://axisbioscience.com/cancel"
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
