import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.routes.js";
import { cartModel } from "./models/cartModel.js";
const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      isStock: (stock) => parseInt(stock) > 0,
    },
    partialsDir: [__dirname + "/views/partials/"],
  }),
);

app.set("views", __dirname + "/views");
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
const httpServer = app.listen(8080, () => {
  console.log("Servidor levantado en puerto 8080");
  mongoose.connect(process.env.DB_URI);
});
const socketServer = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

socketServer.on("connection", (clientSocket) => {
  const cid = clientSocket.handshake.auth.cid;
  clientSocket.on("add-to-cart", async ({ pid }) => {
    let cart = await cartModel.findOneAndUpdate(
      { id: cid, "products.product": pid },
      { $inc: { "products.$.quantity": 1 } },
      { returnDocument: "after" },
    );
    if (!cart) {
      cart = await cartModel.findOneAndUpdate(
        { id: cid },
        { $push: { products: { product: pid, quantity: 1 } } },
        { returnDocument: "after" },
      );
    }
    if (!cart)
      cart = await cartModel.create({
        id: cid,
        products: [{ product: pid, quantity: 1 }],
      });
    if (cart) {
      await cart.populate({ path: "products.product", select: "title price" });
    }
    socketServer.emit("cart-updated", { cart, newProductID: pid });
  });
  clientSocket.on("remove-from-cart", async ({ pid }) => {
    let cart = await cartModel.findOneAndUpdate(
      { id: cid, "products.product": pid },
      { $pull: { products: { product: pid } } },
      { returnDocument: "after" },
    );
    socketServer.emit("cart-updated", cart);
    socketServer.emit("cart-updated-remove-product", { cid, pid });
  });
});
mongoose.connection.on("connected", () => {
  console.log("Conexión a MongoDB Atlas establecida");
});
mongoose.connection.on("error", (err) => {
  console.error("Error en la conexión:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Conexión a MongoDB Atlas desconectada");
});
