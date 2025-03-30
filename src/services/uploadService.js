import { bucket } from "../config/multer.js";
import { BadRequestError } from "../utils/errors/errors.js";

export const uploadImage = async (file, category) => {
    if (!file) throw new Error("File tidak boleh kosong!");

    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedImageTypes.includes(file.mimetype)) {
        throw new BadRequestError("Hanya file gambar yang diperbolehkan!", ["Upload image error"]);
    }

    let folder = "images";
    if (category === "news") folder = `${folder}/news`;
    if (category === "profile") folder = `${folder}/profile`;

    const fileUrl = await uploadToGCS(file, folder);
    return ({ message: "Gambar berhasil diupload!", fileUrl });
};

export const uploadPDF = async (file) => {
    if (!file) throw new Error("File tidak boleh kosong!");

    if (file.mimetype !== "application/pdf") {
        throw new BadRequestError("Hanya file PDF yang diperbolehkan!", ["Upload pdf error"]);
    }

    const fileUrl = await uploadToGCS(file, "portfolio");
    return { message: "PDF berhasil diupload!", fileUrl };
};

const uploadToGCS = (file, folder) => {
    return new Promise((resolve, reject) => {
        const uniqueFilename = `${folder}/${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(uniqueFilename);

        const blobStream = fileUpload.createWriteStream({
            metadata: { contentType: file.mimetype }
        });

        blobStream.on("error", (err) => reject(err));
        blobStream.on("finish", async () => {
            try {
                const fileUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFilename}`;
                resolve(fileUrl);
            } catch (err) {
                reject(err);
            }
        });

        blobStream.end(file.buffer);
    });
};