import { Router, urlencoded } from "express";
import express from "express";
// import { attachManagerToRequest } from "../middlewares/carts.middlewares.js";
import { uploader } from "../utils.js";
import { cartModel } from "../models/cartModel.js";

const router = Router();

// router.use(attachManagerToRequest);

router.get("/", async (req, res) => {
  try {
    // const carts = await req.cartManager.getCarts();
    const carts = await cartModel.find({});
    res.status(200).send(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    // const cart = await req.cartManager.getCartById(req.params.id);
    const cart = await cartModel.findById(req.params.id).populate({
      path: "products.product",
      select: "title",
    });
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    return res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    // const cart = await req.cartManager.createCart();
    const cart = await cartModel.create(req.body);
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(express.json(), urlencoded({ extended: true }));

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    // const cart = await req.cartManager.addProductToCart(
    //   req.params.cid,
    //   req.params.pid,
    // );
    const { cid, pid } = req.params;

    let cart = await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": 1 } },
      { returnDocument: "after" },
    );

    if (!cart) {
      cart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $push: { products: { product: pid, quantity: 1 } } },
        { returnDocument: "after" },
      );
    }

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    // const cart = await req.cartManager.deleteProduct(
    //   req.params.cid,
    //   req.params.pid,
    // );
    const { cid, pid } = req.params;
    let cart = await cartModel.findOneAndUpdate(
      { _id: cid, "products.product": pid },
      { $pull: { products: { product: pid } } },
      { returnDocument: "after" },
    );
    if (!cart) {
      cart = await cartModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { returnDocument: "after" },
      );
    }
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    return res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/:cid", async (req, res) => {
  try {
    // const cart = await req.cartManager.deleteProduct(
    //   req.params.cid,
    //   req.params.pid,
    // );
    const { cid, pid } = req.params;
    let cart = await cartModel.findOneAndUpdate(
      { _id: cid,  },
      { $set: { products: [] } },
      { returnDocument: "after" },
    );
    
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    return res.status(200).send(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
