import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";
import viewsRouter from "./routes/views.routes.js";
const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      isStock: (stock) => stock > 0,
    },
    partialsDir: [__dirname + "/views/partials/"],
  }),
);

app.set("views", __dirname + "/views");

app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);
app.listen(8080, () => {
  console.log("Servidor levantado en puerto 8080");
  mongoose.connect(process.env.DB_URI,);
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