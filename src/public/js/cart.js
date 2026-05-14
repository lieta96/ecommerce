const cid =
  document.querySelector("[data-cid]")?.dataset.cid ??
  new URLSearchParams(
    document.querySelector(".cart-page__back")?.search ?? location.search,
  ).get("cid");
const clientSocket = io({ auth: { cid } });
function getCartFromPayload(payload) {
  return payload?.cart ?? payload;
}
function createCartItemElement(entry, cid) {
  // Agregamos a la vista del carrito el nuevo producto
  const product = entry.product;
  if (!product || typeof product === "string") return null;
  const pid = String(product._id);
  const li = document.createElement("li");
  li.className = "cart-item";
  li.id = pid;
  const info = document.createElement("div");
  info.className = "cart-item__info";
  const link = document.createElement("a");
  link.href = `/products/${pid}?cid=${cid}`;
  link.className = "cart-item__title";
  link.textContent = product.title;
  const meta = document.createElement("div");
  meta.className = "cart-item__meta";
  const qty = document.createElement("span");
  qty.className = "cart-item__qty";
  qty.textContent = `${entry.quantity} u.`;
  meta.appendChild(qty);
  const unit = document.createElement("span");
  unit.className = "cart-item__unit";
  unit.textContent = `$${product.price} c/u`;
  meta.appendChild(unit);
  info.appendChild(link);
  info.appendChild(meta);
  const form = document.createElement("form");
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "cart-item__remove";
  button.dataset.cid = cid;
  button.dataset.pid = pid;
  button.textContent = "Eliminar";
  form.appendChild(button);
  li.appendChild(info);
  li.appendChild(form);
  return li;
}
function ensureCartList() {
  let list = document.querySelector(".cart-list");
  if (list) return list;
  document.querySelector(".cart-empty")?.remove();
  const card = document.createElement("div");
  card.className = "cart-card";
  const heading = document.createElement("h2");
  heading.className = "cart-card__heading";
  heading.textContent = "Productos";
  list = document.createElement("ul");
  list.className = "cart-list";
  card.appendChild(heading);
  card.appendChild(list);
  const backLink = document.querySelector(".cart-page__back");
  backLink?.parentElement?.insertBefore(card, backLink);
  return list;
}
clientSocket.on("cart-updated", (payload) => {
  const cart = getCartFromPayload(payload);
  const newProductID = payload?.newProductID;
  // Actualizamos la cantidad tota del procuctos
  const cartTotal = document.getElementById("cart-total");
  if (cartTotal && cart?.products) {
    cartTotal.textContent = cart.products.reduce(
      (acc, product) => acc + product.quantity,
      0,
    );
  }
  if (!newProductID || !cart?.products) return;
  const entry = cart.products.find(
    (p) =>  p.product ==newProductID,
  );
  if (!entry) return;
  const cartItem = document.getElementById(newProductID);
  if (cartItem) {
    const qtyEl = cartItem.querySelector(".cart-item__qty");
    if (qtyEl) qtyEl.textContent = `${entry.quantity} u.`;
    return;
  }
  const newItem = createCartItemElement(entry, cart.id);
  if (!newItem) return;
  ensureCartList().appendChild(newItem);
});
const section = document.querySelector(".cart-page");
if (section) {
  section.addEventListener("submit", (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    e.preventDefault();
    const button =
      e.submitter instanceof HTMLButtonElement
        ? e.submitter
        : form.querySelector("button[data-pid]");
    const pid = button.dataset.pid ;
    clientSocket.emit("remove-from-cart", { pid });
  });
}
clientSocket.on("cart-updated-remove-product", ({ pid }) => {
  const cartItem = document.getElementById(pid);
  if (cartItem) cartItem.remove();
});
