// const cartID = crypto.randomUUID();

const clientSocket = io();

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

    const pid = button?.dataset.pid ?? form.dataset.pid;
    const cid = button?.dataset.cid ?? form.dataset.cid;
    clientSocket.emit("add-to-cart", { cid, pid });
  });
}
clientSocket.on("cart-updated", (cart) => {
  const cartTotal = document.getElementById("cart-total");
  if(cartTotal)   cartTotal.textContent = cart.products.reduce((acc, product) => acc + product.quantity, 0);
 
});