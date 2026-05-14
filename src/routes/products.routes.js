import { Router, urlencoded } from "express";
import express from "express";
// import { attachManagerToRequest } from "../middlewares/products.middlewares.js";
import { uploader } from "../utils.js";
import { productModel } from "../models/productModel.js";
const router = Router();
// router.use(attachManagerToRequest);
router.get("/", async (req, res) => {
  // Traemos el listado de productos
  try {
    // const products = await req.productManager.getProducts();
    const { limit = 10, page = 1, category, available, sort } = req.query;
    const filter = category ? { category: category } : {};
    if (available) filter.stock = { $gt: 0 };
    const products = await productModel.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true,
    });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    // const product = await req.productManager.deleteProductById(req.params.id);
    const product = await productModel.findByIdAndDelete(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    // const product = await req.productManager.getProductById(req.params.id);
    const product = await productModel.findById(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(express.json(), urlencoded({ extended: true }));
router.post("/", uploader.single("thumbnail"), async (req, res) => {
  try {
    req.body.thumbnails =
      req.file && req.file.filename ? [req.file.filename] : [];
    // const product = await req.productManager.createProduct(req.body);
    req.body.id = crypto.randomUUID();
    const product = await productModel.create(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/bulk", async (req, res) => {
  try {
    // Ruta agregada para poder subir varios productos a la vez
    const productsArray = req.body;
    if (!Array.isArray(productsArray)) {
      return res
        .status(400)
        .json({ error: "Se esperaba un array de productos" });
    }
    productsArray.map((elm) => {
      elm.id = crypto.randomUUID();
      return elm;
    });
    const products = await productModel.insertMany(productsArray);
    res.status(201).send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    // const product = await req.productManager.updateProductById(
    //   req.params.id,
    //   req.body,
    // );
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" },
    );
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
