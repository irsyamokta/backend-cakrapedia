import multer from "multer";

const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage }).single("file");

export { multerUpload };
