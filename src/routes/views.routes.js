import { Router, urlencoded } from "express";
import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";
const router = Router();
router.get("/", (req, res) => {
  res.render("index", { title: "Inicio · Ecommerce" });
});
router.get("/products", async (req, res) => {
  // const products = await ProductManager.getProducts();
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const filter = category ? { category: category } : {};
  if (available) filter.stock = { $gt: 0 };
  const products = await productModel.paginate(filter, {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    lean: true
  });
  const { totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = products;
  res.render("products.handlebars", { products: products.docs, pagination: { totalPages, prevPage, nextPage, page: page, hasPrevPage, hasNextPage, limit: limit, category: category, available: available, sort: sort } });
});

router.get("/products/:id", async (req, res) => {
  const product = await productModel.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });
  const pageTitle = `${product.title} · Ecommerce`;
  res.render("product-detail.handlebars", {
    ...product,
    title: pageTitle,
    productTitle: product.title,
    _id: String(product._id),
  });
});
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartModel.findById(req.params.cid).populate({
    path: "products.product",
    select: "title price",
  }).lean();
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });


  res.render("cart.handlebars", {
    ...cart,
    title: "Carrito · Ecommerce",
    _id: String(cart._id),
  });
});
router.use(urlencoded({ extended: true }));
router.get("/add-product", async (req, res) => {
  res.render("product-form.handlebars");
});
export default router;
