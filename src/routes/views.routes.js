import { Router, urlencoded } from "express";
import ProductManager from "../dao/ProductManager.js";
const router = Router();
router.get("/", (req, res) => {
  res.render("index", { title: "Inicio · Ecommerce" });
});
router.get("/products", async (req, res) => {
  const products = await ProductManager.getProducts();
  res.render("products.handlebars", { products: products });
});
router.use(urlencoded({ extended: true }));
router.get("/add-product", async (req, res) => {
  res.render("product-form.handlebars");
});
export default router;
