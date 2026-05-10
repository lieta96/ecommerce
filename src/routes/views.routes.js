import { Router, urlencoded } from "express";
import ProductManager from "../dao/ProductManager.js";
import { cartModel } from "../models/cartModel.js";
import { productModel } from "../models/productModel.js";
const router = Router();
router.get("/", (req, res) => {
  res.render("index", { title: "Inicio - Ecommerce" });
});
router.get("/products", async (req, res) => {
  // const products = await ProductManager.getProducts();
  
  // Al abrir la vista de productos creamos un carrito en la base de datos
  const { limit = 10, page = 1, category, available, sort } = req.query;
  const filter = category ? { category: category } : {};
  if (available) filter.stock = { $gt: 0 };
  const products = await productModel.paginate(filter, {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
    lean: true,
  });
  const { totalPages, prevPage, nextPage, hasPrevPage, hasNextPage } = products;
  const cartID = req.query.cid || crypto.randomUUID()
  const cart= await cartModel.findOne({ id: cartID })
  const totalCartProducts = cart?.products.reduce((acc, product) => acc + product.quantity, 0) ||0
  res.render("products.handlebars", {
    title:"Productos - Ecommerce",
    products: products.docs,
    cid: cartID,
    totalCartProducts: totalCartProducts,
    pagination: {
      totalPages,
      prevPage,
      nextPage,
      page: page,
      hasPrevPage,
      hasNextPage,
      limit: limit,
      category: category,
      available: available,
      sort: sort,
    },
  });
});

router.get("/products/:id", async (req, res) => {
  const product = await productModel.findById(req.params.id).lean();
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  const pageTitle = `${product.title} - Ecommerce`;
  const cid = req.query.cid || crypto.randomUUID()
  res.render("product-detail.handlebars", {
    ...product,
    title: pageTitle,
    productTitle: product.title,
    cid: cid,
    _id: String(product._id),
  });
});
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartModel
    .findById(req.params.cid)
    .populate({
      path: "products.product",
      select: "title price",
    })
    .lean();
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  const totalCartProducts = cart?.products.reduce((acc, product) => acc + product.quantity, 0) ||0
    console.log(cart)
  res.render("cart.handlebars", {
    ...cart,
    totalCartProducts: totalCartProducts,
    title: "Carrito · Ecommerce",
    _id: String(cart._id),
  });
});
router.use(urlencoded({ extended: true }));
router.get("/add-product", async (req, res) => {
  res.render("product-form.handlebars");
});
export default router;
