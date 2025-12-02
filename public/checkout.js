// === Stripe Checkout Trigger ===
async function startStripeCheckout() {
  try {
    console.log("Starting Stripe Checkout...");

    const items = [];

    document.querySelectorAll(".hl-cart-item-border-bottom").forEach(row => {
      const nameEl = row.querySelector(".hl-cart-product-name");
      const variantEl = row.querySelector(".hl-cart-item-variant");
      const qtyEl = row.querySelector("input");

      if (!nameEl || !qtyEl) return;

      const name = nameEl.innerText.trim();
      const qty = parseInt(qtyEl.value || "1");
      const variantText = (variantEl?.innerText || "").toLowerCase();

      let variant = "single";
      if (variantText.includes("3")) variant = "3-pack";
      if (variantText.includes("5")) variant = "5-pack";

      items.push({ name, qty, variant });
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
  const target = e.target.closest("a, button");
  if (!target) return;

  const txt = (target.textContent || "").toLowerCase();
  const href = (target.getAttribute("href") || "").toLowerCase();
  const action = (target.getAttribute("data-action") || "").toLowerCase();

  if (txt.includes("checkout") || href.includes("checkout") || action.includes("checkout")) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔥 Stripe Intercept Triggered");
    startStripeCheckout();
  }
});
