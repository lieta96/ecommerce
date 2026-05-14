import fs from "fs";
import { __dirname } from "../utils.js";
class ProductManager {
  constructor() {
    this.productsPath = __dirname + "/dao/data/products.json";
    this.folderPath = __dirname + "/dao/data";
    this._init();
  }
  _init() {
    try {
      if (!fs.existsSync(this.folderPath)) {
        fs.mkdirSync(this.folderPath, { recursive: true });
      }
      if (!fs.existsSync(this.productsPath)) {
        fs.writeFileSync(this.productsPath, JSON.stringify([]));
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getProducts() {
    try {
      const file = await fs.promises.readFile(this.productsPath, "utf-8");
      const parsed = JSON.parse(file);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      throw new Error(error);
    }
  }
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const productById = products.find((elm) => elm.id == id);
      return productById;
    } catch (error) {
      throw new Error(error.message);
    }
  }
    async deleteProductById(id) {
    const products = await this.getProducts();
    const indexProduct = products.findIndex((obj) => obj.id == id);
    const deletedProduct = products[indexProduct];
    if (indexProduct > -1) {
      products.splice(indexProduct, 1);
      await fs.promises.writeFile(
        this.productsPath,
        JSON.stringify(products),
        {},
      );
    }
    return deletedProduct;
  }
  async updateProductById(id, updatedProduct) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex((elm) => elm.id == id);
      if (productIndex !== -1) {
        const nextProduct = {
          ...products[productIndex],
          ...updatedProduct,
          id: Number(id),
        };
        products[productIndex] = nextProduct;
        await fs.promises.writeFile(
          this.productsPath,
          JSON.stringify(products),
          {
            encoding: "utf-8",
          },
        );
        return nextProduct;
      } else throw new Error("Producto no encontrado");
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async createProduct(product) {
    if (product.title && !isNaN(parseFloat(product.price))) {
      const products = await this.getProducts();
      const maxId =
        products.length > 0 ? Math.max(...products.map((elm) => elm.id)) : 0;
      product.id = maxId + 1;
      product.status = product.status ?? true;
      products.push(product);

      try {
        await fs.promises.writeFile(
          this.productsPath,
          JSON.stringify(products),
          {
            encoding: "utf-8",
          },
        );
        return product;
      } catch (error) {
        throw new Error(error.message);
      }
    } else throw new Error("Name o price incorrectos");
  }
}
export default new ProductManager();
