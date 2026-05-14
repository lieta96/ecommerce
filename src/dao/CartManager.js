import fs from "fs";
import { __dirname } from "../utils.js";
class CartManager {
  constructor() {
    this.cartsPath = __dirname + "/dao/data/carts.json";
    this.folderPath = __dirname + "/dao/data";
    this._init();
  }
  _init() {
    try {
      if (!fs.existsSync(this.folderPath)) {
        fs.mkdirSync(this.folderPath, { recursive: true });
      }
      if (!fs.existsSync(this.cartsPath)) {
        fs.writeFileSync(this.cartsPath, JSON.stringify([]));
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getCarts() {
    try {
      const file = await fs.promises.readFile(this.cartsPath, "utf-8");
      const parsed = JSON.parse(file);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      throw new Error(error);
    }
  }
  async createCart() {
    const carts = await this.getCarts();
    const maxId =
      carts.length > 0 ? Math.max(...carts.map((elm) => elm.id)) : 0;
    const cart = { id: maxId + 1, products: [] };
    carts.push(cart);
    try {
      await fs.promises.writeFile(this.cartsPath, JSON.stringify(carts), {
        encoding: "utf-8",
      });
      return cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getCartById(id) {
    try {
      const carts = await this.getCarts();
      const cartById = carts.find((elm) => elm.id == id);
      if (!cartById) return "El carrito solicitado no existe";
      return cartById;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async addProductToCart(cid, pid) {
    let requiredCart = await this.getCartById(cid);
    if (!requiredCart) return "El carrito solicitado no existe";
    const ProductManager = (await import("./ProductManager.js")).default;
    const requiredProduct = await ProductManager.getProductById(pid);
    if (!requiredProduct) return "El producto solicitado no existe";
    let { products } = requiredCart;
    const productInCartIndex = products.findIndex(
      (elm) => elm.id == requiredProduct.id,
    );
    if (productInCartIndex == -1)
      products.push({ id: requiredProduct.id, quantity: 1 });
    else products[productInCartIndex].quantity++;
    const carts = await this.getCarts();

    const updatedCarts = carts.map((cart) => {
      if (cart.id == cid) {
        requiredCart = {
          ...cart,
          products,
        };
        return requiredCart;
      } else return cart;
    });

    await fs.promises.writeFile(this.cartsPath, JSON.stringify(updatedCarts), {
      encoding: "utf-8",
    });
    return requiredCart;
  }
  async deleteProduct(cid, pid) {
    const carts = await this.getCarts();
    let cartIndex = carts.findIndex((elm) => elm.id == cid);
    if (cartIndex == -1) return "El carrito solicitado no existe";
    const filteredProducts = carts[cartIndex].products.filter(
      (elm) => elm.id != pid,
    );
    carts[cartIndex].products = filteredProducts;
    await fs.promises.writeFile(this.cartsPath, JSON.stringify(carts), {
      encoding: "utf-8",
    });
    return carts[cartIndex];
  }
}
export default new CartManager();
