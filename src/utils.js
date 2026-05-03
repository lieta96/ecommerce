import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
const __filename = fileURLToPath(import.meta.url); // esto nos devuelve la cadena de texto en el archivo en el que estás
export const __dirname = dirname(__filename); // acá lo trasnformamos en una ruta de sistema para que se pueda interpretar

// Configuración para guardar archivos

const storage = multer.diskStorage({
  // para almacenar en el disco sino se puede almacenar en memoria pero es más efímero
  destination: (req, file, cb) => {
    cb(null, __dirname + "/public/images/");
  },
  fileFilter: (req, file, cb) => { // solo aceptamos imágenes
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname );
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});
export const uploader = multer({
  storage,
}) // multer devuelve un middleware