import CartManager from "../dao/CartManager.js";

export function attachManagerToRequest(req, res, next) {
  req.cartManager = CartManager;
  next();
}
