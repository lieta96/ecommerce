import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: (title) => {
        return title.length > 2;
      },
      message: (title) =>
        `${title} no es válido. Debe contener más de dos caracteres. `,
    },
  },
  description: String,
  price: {type: Number, required: true,min: 0,
  },
  category: { type: String, index: true },
  stock: { type: Number, min: 1, default: 1,
  },
  status: Boolean,
  code: { type: String, unique: true, required: true },
  thumbnails: { type: [String], default: [] },
  id: { type: String, unique: true, required: true },
});
productSchema.plugin(mongoosePaginate); // Conecta el plugin
export const productModel = model(
  "products", // acá va el nombre de la colección de la DB
  productSchema,
);
