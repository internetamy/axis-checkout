async function startStripeCheckout() {
  try {
    console.log("Starting Stripe Checkout…");

    const items = [];

    document.querySelectorAll(".cart-item-border-bottom").forEach(row => {
      const name = row.querySelector(".hl-cart-product-name")?.innerText.trim();
      const variant = row.querySelector(".hl-cart-item-variant")?.innerText.trim();
      const qty = parseInt(row.querySelector(".hl-cart-qty-input")?.value || "1");

      if (name && qty > 0) {
        items.push({
          name,
          variant: variant || "Single",
          qty
        });
      }
    });

    console.log("ITEMS SENDING →", items);

    if (!items.length) {
      alert("Your cart is empty.");
      return;
    }

    const res = await fetch("https://axis-checkout.vercel.app/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    });

    const data = await res.json();

    if (!data.url) {
      console.error("Stripe error:", data);
      alert("Checkout error.");
      return;
    }

    window.location.href = data.url;

  } catch (err) {
    console.error("Checkout Error:", err);
    alert("Something went wrong.");
  }
}


// === Intercept Checkout Button ===
document.addEventListener("click", function (e) {
  const t = e.target.closest("a, button");
  if (!t) return;

  const txt = (t.textContent || "").toLowerCase();
  const href = (t.getAttribute("href") || "").toLowerCase();

  if (txt.includes("checkout") || href.includes("checkout")) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔥 Stripe Intercept Active");
    startStripeCheckout();
  }
});
