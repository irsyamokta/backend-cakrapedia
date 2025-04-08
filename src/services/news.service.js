import * as newsRepository from "../repositories/news.repository.js";
import * as categoryRepository from "../repositories/category.repository.js";
import { createNewsValidator, updateNewsValidator, newsStatusValidator } from "../utils/validators/index.js";
import { uploadImage } from "../utils/upload.utils.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const createNews = async (userId, data, file) => {
    if (!file) throw new BadRequestError("Gambar tidak boleh kosong!", ["Upload gambar diperlukan"]);

    const { error } = createNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { title, content, categoryId } = data;
    const imageUrl = await uploadImage(file, "news");

    const author = await newsRepository.getAuthor(userId);
    if (!author) throw new NotFoundError("Penulis tidak ditemukan");

    const news = await newsRepository.createNewsData(title, content, categoryId, imageUrl.fileUrl, userId);

    return { message: "Berita berhasil dibuat", news };
};