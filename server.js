const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const NAME_TO_PRICEID = {
  "GLOW": "price_1SRi7pCCtqrHNyYdzb3qqUwn”,
  "R3 - 10”: "price_1SRi8ZCCtqrHNyYdwVlsoqqP”,
  "BPC-157 10mg": "price_1SRi91CCtqrHNyYddNJ02PDc”,
};

app.post("/create-checkout", async (req, res) => {
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
      line_items,
      success_url: "https://axisbioscience.com/thank-you",
      cancel_url: "https://axisbioscience.com/cart",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      payment_intent_data: { statement_descriptor: "AXISBIOSCI ORDER" },
    });

    return res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "checkout_create_failed" });
  }
});

app.listen(3000, () => console.log("Ready on 3000"));
