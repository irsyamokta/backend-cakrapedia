import * as newsRepository from "../repositories/news.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import * as categoryRepository from "../repositories/category.repository.js";
import { createNewsValidator, updateNewsValidator, newsStatusValidator } from "../utils/validators/index.js";
import { uploadImage } from "../utils/upload.utils.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const getNews = async () => {
    const news = await newsRepository.getNews();
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { message: "Berita berhasil didapatkan", news };
};

export const getNewsById = async (newsId) => {
    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { message: "Berita berhasil didapatkan", news };
};

export const getNewsPublished = async () => {
    const news = await newsRepository.getNewsPublished();
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { message: "Berita berhasil didapatkan", news };
};

export const getNewsByCategory = async (categoryId) => {
    const news = await newsRepository.getNewsByCategory(categoryId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { message: "Berita berhasil didapatkan", news };
};

export const getNewsByAuthor = async (authorId) => {
    const news = await newsRepository.getNewsByAuthor(authorId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");
    return { message: "Berita berhasil didapatkan", news };
};

export const createNews = async (userId, data, file) => {
    if (!file) throw new BadRequestError("Gambar tidak boleh kosong!", ["Upload gambar diperlukan"]);

    const { error } = createNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { title, content, categoryId } = data;
    const imageUrl = await uploadImage(file, "news");

    const author = await newsRepository.getAuthor(userId);
    if (!author) throw new NotFoundError("Penulis tidak ditemukan");

    const news = await newsRepository.createNews(title, content, categoryId, imageUrl.fileUrl, userId);

    return { message: "Berita berhasil dibuat", news };
};

export const updateNews = async (userId, newsId, data, file) => {
    if (!file) throw new BadRequestError("Gambar tidak boleh kosong!", ["Upload gambar diperlukan"]);

    const { error } = updateNewsValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const { title, content, categoryId } = data;
    const imageUrl = await uploadImage(file, "news");

    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await userRepository.getUserById(userId, { id: true, role: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id)
        throw new BadRequestError("Anda tidak memiliki izin untuk mengubah berita ini", ["Anda bukan penulis berita ini"]);

    const newsData = {
        title: title ?? news.title,
        content: content ?? news.content,
        imageUrl: imageUrl.fileUrl ?? news.imageUrl,
        categoryId: categoryId ?? news.categoryId
    };

    const updatedNews = await newsRepository.updateNews(newsId, newsData);

    return { message: "Berita berhasil diperbarui", updatedNews };
};

export const deleteNews = async (userId, newsId) => {
    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await userRepository.getUserById(userId, { id: true, role: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id)
        throw new BadRequestError("Anda tidak memiliki izin untuk menghapus berita ini", ["Anda bukan penulis berita ini"]);

    await newsRepository.deleteNews(newsId);

    return { message: "Berita berhasil dihapus" };
};

export const newsStatus = async (userId, newsId, data) => {
    const { error } = newsStatusValidator(data);
    if (error) throw new BadRequestError("Validasi gagal", error.details.map(err => err.message));

    const news = await newsRepository.getNewsById(newsId);
    if (!news) throw new NotFoundError("Berita tidak ditemukan");

    const user = await userRepository.getUserById(userId, { id: true, role: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!["EDITOR", "ADMIN"].includes(user.role) && news.authorId !== user.id)
        throw new BadRequestError("Anda tidak memiliki izin untuk mengubah status berita ini", ["Anda bukan penulis berita ini"]);

    const { status } = data;
    const updatedNews = await newsRepository.newsStatus(newsId, status);

    return { message: "Status berita berhasil diperbarui", updatedNews };
};