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
export const cartModel = model("carts", cartSchema);
