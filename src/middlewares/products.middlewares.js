import ProductManager from "../dao/ProductManager.js";

export async function attachManagerToRequest(req, res, next) {
  req.productManager = ProductManager;
  next();
}
