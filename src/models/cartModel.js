import { Schema, model, Types } from "mongoose";
const cartSchema = new Schema({
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
    deafult: [],
  },
});
export const cartModel = model("carts", cartSchema);
