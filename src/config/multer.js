import { Storage } from "@google-cloud/storage"; 
import multer from "multer";

const projectId = process.env.PROJECT_ID;
const bucketName = process.env.BUCKET_NAME;

const storage = new Storage({ projectId });
const bucket = storage.bucket(bucketName);

const multerStorage = multer.memoryStorage(); 
const multerUpload = multer({ storage: multerStorage }).single("file"); 

export { multerUpload, bucket };
