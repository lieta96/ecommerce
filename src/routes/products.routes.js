import { Router, urlencoded } from "express";
import express from "express";
import { attachManagerToRequest } from "../middlewares/products.middlewares.js";
import { uploader } from "../utils.js";

const router = Router();

router.use(attachManagerToRequest);

router.get("/", async (req, res) => {
  try {
    const products = await req.productManager.getProducts();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const product = await req.productManager.deleteProductById(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await req.productManager.getProductById(req.params.id);
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(express.json(), urlencoded({ extended: true }));

router.post(
  "/",
  uploader.single("thumbnail"), // lo pasamos como middleware para que ataje el post
  async (req, res) => {
    try {
      req.body.thumbnails =
        req.file && req.file.filename ? [req.file.filename] : [];
      const product = await req.productManager.createProduct(req.body);
      res.status(200).send(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
router.put("/:id", async (req, res) => {
  try {
    const product = await req.productManager.updateProductById(
      req.params.id,
      req.body,
    );
    return res.status(200).send(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
