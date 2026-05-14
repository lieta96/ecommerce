const cid =
  document.querySelector("[data-cid]")?.dataset.cid ??
  new URLSearchParams(location.search).get("cid");
const clientSocket = io({ auth: { cid } });

const productsGrid = document.querySelector(".products-grid");
const productDetail = document.querySelector(".product-detail__actions");
const section= productsGrid || productDetail
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
    clientSocket.emit("add-to-cart", { pid });
  });
}
clientSocket.on("cart-updated", (payload) => {
  const cart = payload?.cart ?? payload;
  const cartTotal = document.getElementById("cart-total");
  if (cartTotal) {
    cartTotal.textContent =
      cart?.products?.reduce((acc, product) => acc + product.quantity, 0) ?? 0;
  }
});