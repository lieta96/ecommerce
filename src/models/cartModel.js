import { Schema, model, Types } from "mongoose";
const cartSchema = new Schema({
  id:{ type: String, unique: true, required: true },
  products: {
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: "products", //nombre de la colección
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  },
});
cartSchema.pre(["find", "findOne"],async  function () {
  this.populate({
    path: "products.product",
    select: "title", 
  });
});
export const cartModel = model("carts", cartSchema);
