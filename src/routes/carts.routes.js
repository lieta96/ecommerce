import { Router, urlencoded } from "express";
import express from "express";
import { attachManagerToRequest } from "../middlewares/carts.middlewares.js";
import { uploader } from "../utils.js";

const router = Router();

router.use(attachManagerToRequest);

router.get("/", async (req, res) => {
  try {
    const carts = await req.cartManager.getCarts();
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const cart = await req.cartManager.getCartById(req.params.id);
    return res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const cart = await req.cartManager.createCart();
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(express.json(), urlencoded({ extended: true }));

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await req.cartManager.addProductToCart(
      req.params.cid,
      req.params.pid,
    );
    return res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
