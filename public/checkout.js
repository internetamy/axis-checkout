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
  if (checkoutLock) return; // stops endless loops

  const target = e.target.closest("a, button");
  if (!target) return;

  const txt = (target.textContent || "").toLowerCase();
  const href = (target.getAttribute("href") || "").toLowerCase();
  const action = (target.getAttribute("data-action") || "").toLowerCase();

  if (
    txt.includes("checkout") ||
    href.includes("checkout") ||
    action.includes("checkout")
  ) {
    e.preventDefault();
    e.stopPropagation();

    checkoutLock = true;  // freeze it so it doesn’t fire again
    console.log("🔥 Checkout intercepted once only");

    startStripeCheckout();
  }
});
