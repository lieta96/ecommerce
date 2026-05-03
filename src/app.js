import express from "express";
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
// -------- --------
app.use(express.json());
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("/", viewsRouter);
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
